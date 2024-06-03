import React, { useEffect, useState } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import FilesTable from "./FilesTable"
import { getZendeskClient, getSubDomain } from "./ZenDeskClient"
import ImagesTable from "./ImagesTable"
import LoaderSkeleton from "./loaders/LoaderSkeleton"
import {
    commentObject,
    commentsObject,
    collectedAttachmens,
    CollectedEmbeddedImages,
} from "../utils/interfaces"

const zafClient = getZendeskClient()

async function getCommentData(): Promise<
    | [
          collectedAttachmens[],
          CollectedEmbeddedImages[],
          collectedAttachmens[],
          collectedAttachmens[],
          collectedAttachmens[],
      ]
    | undefined
> {
    try {
        const ticketResponse = await zafClient.get("ticket.id")
        const ticketId = ticketResponse["ticket.id"]

        if (!ticketId) {
            throw new Error("Ticket ID not found")
        }

        const options = {
            url: `/api/v2/tickets/${ticketId}/comments`,
            type: "GET",
            contentType: "application/json",
        }

        const response = await zafClient.request(options)

        return getAttachmentData(response, null, ticketId)
    } catch (error) {
        console.error("Failed to retrieve comments:", error)
    }
}

async function checkForEmbeddedImage(comment: commentObject) {
    const subdomain = await getSubDomain()
    const embeddedImageRegex1 = new RegExp(
        `!\\[\\]\\((https:\\/\\/${subdomain}\\.telco\\.com\\/attachments\\/token\\/[^\\s]+\\?name=[^\\)]+)\\)`,
        "g",
    )
    const embeddedImageRegex2 = new RegExp(
        `!\\[\\]\\((https:\\/\\/${subdomain}\\.zendesk\\.com\\/attachments\\/token\\/[^\\/?]+\\/\\?name=[^\\)]+)\\)`,
        "g",
    )

    const matches: string[] = []
    let match

    while ((match = embeddedImageRegex1.exec(comment.body)) !== null) {
        matches.push(match[1])
    }

    while ((match = embeddedImageRegex2.exec(comment.body)) !== null) {
        matches.push(match[1])
    }
    return matches
}

async function getAttachmentData(
    commentData: commentsObject,
    fileType: Array<string> | null,
    ticketID: number,
): Promise<
    [
        collectedAttachmens[],
        CollectedEmbeddedImages[],
        collectedAttachmens[],
        collectedAttachmens[],
        collectedAttachmens[],
    ]
> {
    const collectedText: collectedAttachmens[] = []
    const collectedImages: collectedAttachmens[] = []
    const collectedPDF: collectedAttachmens[] = []
    const collectedOther: collectedAttachmens[] = []
    const collectedEmbeddedImage: CollectedEmbeddedImages[] = []

    for (const comment of commentData.comments) {
        const embeddedImageData = await checkForEmbeddedImage(comment)
        for (const imageUrl of embeddedImageData) {
            const parsedUrl = new URL(imageUrl)
            const searchParams = new URLSearchParams(parsedUrl.search)
            const filename = searchParams.get("name")

            const alreadyAdded = collectedEmbeddedImage.some(
                (obj) => obj.contentUrl === imageUrl,
            )

            if (!alreadyAdded) {
                const obj: CollectedEmbeddedImages = {
                    contentUrl: imageUrl,
                    fileName: filename,
                    timestamp: comment.created_at,
                }
                collectedEmbeddedImage.push(obj)
            }
        }

        if (comment.attachments.length > 0) {
            for (const attachment of comment.attachments) {
                if (attachment.file_name === "redacted.txt") {
                    continue
                }

                if (fileType && !fileType.includes(attachment.content_type)) {
                    continue
                }

                const obj: collectedAttachmens = {
                    contentUrl: attachment.content_url,
                    fileName: attachment.file_name,
                    size: attachment.size,
                    timestamp: comment.created_at,
                    width: attachment.width,
                    height: attachment.height,
                    contentType: attachment.content_type,
                    messageID: comment.id,
                    ticketID: ticketID,
                    attachmentID: attachment.id,
                    thumbnails: attachment.thumbnails,
                }

                if (attachment.content_type.includes("image")) {
                    collectedImages.push(obj)
                } else if (attachment.content_type.includes("pdf")) {
                    collectedPDF.push(obj)
                } else if (attachment.content_type.includes("text")) {
                    collectedText.push(obj)
                } else {
                    collectedOther.push(obj)
                }
            }
        }
    }

    return [
        collectedImages,
        collectedEmbeddedImage,
        collectedPDF,
        collectedText,
        collectedOther,
    ]
}

function NavTabs(): React.ReactNode {
    const [selectedTab, setSelectedTab] = useState("Text Files")
    const [imageFiles, setImageFiles] = useState<collectedAttachmens[]>([])
    const [embeddedImageFiles, setEmbeddedImageFiles] = useState<
        CollectedEmbeddedImages[]
    >([])
    const [pdfFiles, setPdfFiles] = useState<collectedAttachmens[]>([])
    const [textFiles, setTextFiles] = useState<collectedAttachmens[]>([])
    const [otherFiles, setOtherFiles] = useState<collectedAttachmens[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCommentData()
                if (data) {
                    const [
                        imageData,
                        embeddedImageData,
                        pdfData,
                        textData,
                        otherData,
                    ] = data as [
                        collectedAttachmens[],
                        CollectedEmbeddedImages[],
                        collectedAttachmens[],
                        collectedAttachmens[],
                        collectedAttachmens[],
                    ]
                    setImageFiles(imageData)
                    setEmbeddedImageFiles(embeddedImageData)
                    setPdfFiles(pdfData)
                    setTextFiles(textData)
                    setOtherFiles(otherData)
                    setLoading(false)
                }
            } catch (error) {
                console.error("Error fetching attachment data:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
            <TabList>
                <Tab item="Text Files">Text Files ({textFiles.length})</Tab>
                <Tab item="Images">
                    Images ({imageFiles.length + embeddedImageFiles.length})
                </Tab>
                <Tab item="PDFs">PDFs ({pdfFiles.length})</Tab>
                <Tab item="Other">Other ({otherFiles.length})</Tab>
            </TabList>
            <TabPanel item="Text Files">
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <LoaderSkeleton items={textFiles.length} />
                    </div>
                ) : (
                    <>
                        {textFiles && textFiles.length > 0 ? (
                            <FilesTable attachments={textFiles} />
                        ) : (
                            <p>No text files found.</p>
                        )}
                    </>
                )}
            </TabPanel>
            <TabPanel item="Images">
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <LoaderSkeleton items={imageFiles.length} />
                    </div>
                ) : (
                    <>
                        {(imageFiles && imageFiles.length > 0) ||
                        (embeddedImageFiles &&
                            embeddedImageFiles.length > 0) ? (
                            <ImagesTable
                                attachedImages={imageFiles}
                                EmbeddedImages={embeddedImageFiles}
                            />
                        ) : (
                            <p>No images found.</p>
                        )}
                    </>
                )}
            </TabPanel>
            <TabPanel item="PDFs">
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <LoaderSkeleton items={pdfFiles.length} />
                    </div>
                ) : (
                    <>
                        {pdfFiles && pdfFiles.length > 0 ? (
                            <FilesTable attachments={pdfFiles} />
                        ) : (
                            <p>No PDF files found.</p>
                        )}
                    </>
                )}
            </TabPanel>
            <TabPanel item="Other">
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <LoaderSkeleton items={otherFiles.length} />
                    </div>
                ) : (
                    <>
                        {otherFiles && otherFiles.length > 0 ? (
                            <FilesTable attachments={otherFiles} />
                        ) : (
                            <p>No Other attachments found.</p>
                        )}
                    </>
                )}
            </TabPanel>
        </Tabs>
    )
}

export default NavTabs
