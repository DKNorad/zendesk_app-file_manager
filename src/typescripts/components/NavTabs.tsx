import React, { useEffect, useState } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import FilesTable from "./FilesTable/FilesTable"
import { getZendeskClient, getSubDomain } from "./ZenDeskClient"
import ImagesTable from "./ImagesTable/ImagesTable"
import LoaderSkeleton from "./Loaders/LoaderSkeleton"
import {
    commentObject,
    commentsObject,
    collectedAttachmens,
    CollectedEmbeddedImages,
} from "../utils/interfaces"
import { appMimeTypes, otherMimeTypes, textMimeTypes } from "../utils/utils"
import genericFileIcon from "/src/images/file_types/icons8-file-80.png"
import imageGalleryIcon from "/src/images/file_types/icons8-images-80.png"
import urlIcon from "/src/images/file_types/icons8-link-80.png"

const zafClient = getZendeskClient()

async function getCommentData(): Promise<
    | [collectedAttachmens[], CollectedEmbeddedImages[], collectedAttachmens[]]
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
        `!\\[\\]\\((https:\\/\\/${subdomain}\\.telco\\.com\\/attachments\\/token\\/[^\\s]+\\?name=[^\\)]+)\\)`,
        "g",
    )
    const embeddedImageRegex3 = new RegExp(
        `!\\[\\]\\((https:\\/\\/${subdomain}\\.zendesk\\.com\\/attachments\\/token\\/[^\\/?]+\\/\\?name=[^\\)]+)\\)`,
        "g",
    )
    const embeddedImageRegex4 = new RegExp(
        `!\\[image]\\((https:\\/\\/${subdomain}\\.zendesk\\.com\\/attachments\\/token\\/[^\\/?]+\\/\\?name=[^\\)]+)\\)`,
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
    while ((match = embeddedImageRegex3.exec(comment.body)) !== null) {
        matches.push(match[1])
    }
    while ((match = embeddedImageRegex4.exec(comment.body)) !== null) {
        matches.push(match[1])
    }
    return matches
}

async function getAttachmentData(
    commentData: commentsObject,
    fileType: Array<string> | null,
    ticketID: number,
): Promise<
    [collectedAttachmens[], CollectedEmbeddedImages[], collectedAttachmens[]]
> {
    const collectedFiles: collectedAttachmens[] = []
    const collectedImages: collectedAttachmens[] = []
    const collectedEmbeddedImage: CollectedEmbeddedImages[] = []

    function getMimeType(contentType: string): string {
        let mime = ""

        if (contentType.startsWith("text/")) {
            mime = textMimeTypes[contentType]
        } else if (contentType.startsWith("application/")) {
            mime = appMimeTypes[contentType]
        } else {
            mime = otherMimeTypes[contentType]
        }

        if (mime) {
            return mime
        } else {
            return "File"
        }
    }
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
                    fileName: filename ?? "Unknown",
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
                    mimeType: getMimeType(attachment.content_type),
                    contentType: attachment.content_type,
                    messageID: comment.id,
                    ticketID: ticketID,
                    attachmentID: attachment.id,
                    thumbnails: attachment.thumbnails,
                }

                if (attachment.content_type.includes("image")) {
                    collectedImages.push(obj)
                } else {
                    collectedFiles.push(obj)
                }
            }
        }
    }

    return [collectedImages, collectedEmbeddedImage, collectedFiles]
}

function NavTabs(): React.ReactNode {
    const [selectedTab, setSelectedTab] = useState("Files")
    const [imageFiles, setImageFiles] = useState<collectedAttachmens[]>([])
    const [embeddedImageFiles, setEmbeddedImageFiles] = useState<
        CollectedEmbeddedImages[]
    >([])
    const [files, setFiles] = useState<collectedAttachmens[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCommentData()
                if (data) {
                    const [imageData, embeddedImageData, fileData] = data as [
                        collectedAttachmens[],
                        CollectedEmbeddedImages[],
                        collectedAttachmens[],
                    ]
                    setImageFiles(imageData)
                    setEmbeddedImageFiles(embeddedImageData)
                    setFiles(fileData)
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
                <Tab item="Files" disabled={files.length === 0}>
                    <img
                        src={genericFileIcon}
                        style={{ width: "25px", paddingRight: "5px" }}
                    />
                    Files ({files.length})
                </Tab>
                <Tab
                    item="Media"
                    disabled={
                        imageFiles.length + embeddedImageFiles.length === 0
                    }
                >
                    <img
                        src={imageGalleryIcon}
                        style={{ width: "25px", paddingRight: "5px" }}
                    />
                    Media ({imageFiles.length + embeddedImageFiles.length})
                </Tab>
                <Tab item="Links">
                    {" "}
                    <img
                        src={urlIcon}
                        style={{ width: "25px", paddingRight: "5px" }}
                    />
                    Links
                </Tab>
            </TabList>
            {files.length > 0 && (
                <TabPanel item="Files">
                    {loading ? (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <LoaderSkeleton items={files.length} />
                        </div>
                    ) : (
                        <FilesTable attachments={files} />
                    )}
                </TabPanel>
            )}
            {(imageFiles.length > 0 || embeddedImageFiles.length > 0) && (
                <TabPanel item="Media">
                    {loading ? (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            <LoaderSkeleton items={imageFiles.length} />
                        </div>
                    ) : (
                        <ImagesTable
                            attachedImages={imageFiles}
                            embeddedImages={embeddedImageFiles}
                        />
                    )}
                </TabPanel>
            )}
        </Tabs>
    )
}

export default NavTabs
