import React, { useEffect, useState } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import FilesTable from "./FilesTable"
import { getZendeskClient } from "./ZenDeskClient"
import ImagesTable from "./ImagesTable"
import LoaderSkeleton from "./loaders/LoaderSkeleton"

const zafClient = getZendeskClient()

// Defining the interfaces for the objects returned by the API.
interface commentsObject {
    comments: commentObject[]
    count: number
    next_page: string | null
    previous_page: string | null
}
interface commentObject {
    attachments: Array<attachment>
    audit_id: number
    author_id: number
    body: string
    created_at: string
    html_body: string
    id: number
    metadata: object
    plain_body: string
    public: boolean
    type: string
    via: object
}

interface thumbnail {
    content_type: string
    content_url: string
    deleted: boolean
    file_name: string
    height: number | null
    width: number | null
    id: number
    inline: boolean
    malware_access_verride: boolean
    malware_scan_results: string
    mapped_content_url: string
    size: number
    url: string
}

interface attachment {
    content_type: string
    content_url: string
    deleted: boolean
    file_name: string
    height: number | null
    width: number | null
    id: number
    inline: boolean
    malware_access_verride: boolean
    malware_scan_results: string
    mapped_content_url: string
    size: number
    thumbnails: Array<null | thumbnail>
    url: string
}

export interface collectedAttachmens {
    contentType: string
    contentUrl: string
    fileName: string
    height: number | null
    width: number | null
    size: number
    timestamp: string
    messageID: number
    ticketID: number
    attachmentID: number
    thumbnails: Array<null | thumbnail>
}

async function getMimeTypeFromUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(
                `Network response was not ok: ${response.statusText}`,
            )
        }

        const buffer = await response.arrayBuffer()
        const arr = new Uint8Array(buffer).subarray(0, 4)
        let header = ""
        for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16)
        }

        let riffType: Uint8Array | undefined
        let riffHeader = ""

        switch (header) {
            case "89504e47": // PNG
                return "image/png"
            case "47494638": // GIF
                return "image/gif"
            case "ffd8ffe0": // JPEG
            case "ffd8ffe1":
            case "ffd8ffe2":
                return "image/jpeg"
            case "424d": // BMP
                return "image/bmp"
            case "49492a00": // TIFF (Little Endian)
            case "4d4d002a": // TIFF (Big Endian)
                return "image/tiff"
            case "52494646": // WebP and others that start with RIFF
                riffType = new Uint8Array(buffer).subarray(8, 12)
                riffHeader = ""
                for (let i = 0; i < riffType.length; i++) {
                    riffHeader += String.fromCharCode(riffType[i])
                }
                if (riffHeader === "WEBP") {
                    return "image/webp"
                }
                break
            case "3c3f786d": // SVG (SVG images are text files that start with '<?xml')
                return "image/svg+xml"
            default:
                return "unknown"
        }

        // Additional check for SVG as it might start with other characters
        const text = new TextDecoder().decode(buffer)
        if (text.startsWith("<?xml") || text.startsWith("<svg")) {
            return "image/svg+xml"
        }

        return "unknown"
    } catch (error) {
        console.error("Failed to fetch or read the file:", error)
        return "unknown"
    }
}

async function getCommentData() {
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

function getAttachmentData(
    commentData: commentsObject,
    fileType: Array<string> | null,
    ticketID: number,
) {
    const collectedText = Array<collectedAttachmens>()
    const collectedImages = Array<collectedAttachmens>()
    const collectedPDF = Array<collectedAttachmens>()
    const collectedOther = Array<collectedAttachmens>()

    for (const comment of commentData.comments) {
        if (comment.attachments.length > 0) {
            for (const attachment of comment.attachments) {
                if (attachment.file_name === "redacted.txt") {
                    continue
                }

                if (fileType && !fileType.includes(attachment.content_type)) {
                    continue
                }

                const obj = {
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

    return [collectedImages, collectedPDF, collectedText, collectedOther]
}

function NavTabs(): React.ReactNode {
    const [selectedTab, setSelectedTab] = useState("Text Files")
    const [imageFiles, setImageFiles] = useState<collectedAttachmens[]>([])
    const [pdfFiles, setPdfFiles] = useState<collectedAttachmens[]>([])
    const [textFiles, setTextFiles] = useState<collectedAttachmens[]>([])
    const [otherFiles, setOtherFiles] = useState<collectedAttachmens[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCommentData()
                if (data) {
                    const [imageData, pdfData, textData, otherData] = data
                    setImageFiles(imageData)
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
                <Tab item="Text Files">Text Files</Tab>
                <Tab item="Images">Images</Tab>
                <Tab item="EmbeddedImages">Embedded Images</Tab>
                <Tab item="PDFs">PDFs</Tab>
                <Tab item="Other">Other</Tab>
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
                            <p>No Text Files attachments were found.</p>
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
                        {imageFiles && imageFiles.length > 0 ? (
                            <ImagesTable attachments={imageFiles} />
                        ) : (
                            <p>No Images attachments were found.</p>
                        )}
                    </>
                )}
            </TabPanel>
            <TabPanel item="EmbeddedImages">
                {loading ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <LoaderSkeleton items={imageFiles.length} />
                    </div>
                ) : (
                    <>
                        {imageFiles && imageFiles.length > 0 ? (
                            <ImagesTable attachments={imageFiles} />
                        ) : (
                            <p>No Embedded Images attachments were found.</p>
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
                            <p>No PDFs attachments were found.</p>
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
                            <p>No Other attachments were found.</p>
                        )}
                    </>
                )}
            </TabPanel>
        </Tabs>
    )
}

export default NavTabs
