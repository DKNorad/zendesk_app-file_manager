import React, { useState } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import FilesTable from "./FilesTable"

declare const ZAFClient: any
const zafClient = ZAFClient.init()

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
    thumbnails: Array<null | { url: string; width: number; height: number }>
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
}

async function getCommentData() {
    try {
        // Await the promise to resolve and get the ticket ID from the response
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

        // Make the API request with the retrieved ticket ID
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
    const collectedAttachmentData = Array<collectedAttachmens>()

    for (const comment of commentData.comments) {
        if (comment.attachments.length > 0) {
            for (const attachment of comment.attachments) {
                if (fileType && !fileType.includes(attachment.content_type)) {
                    continue
                } else {
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
                    }
                    collectedAttachmentData.push(obj)
                }
            }
        }
    }
    return collectedAttachmentData
}

function NavTabs(): React.ReactNode {
    const [selectedTab, setSelectedTab] = useState("Files")

    return (
        <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
            <TabList>
                <Tab item="Files">Files</Tab>
                <Tab item="Images">Images</Tab>
            </TabList>
            <TabPanel item="Files">
                <FilesTable files={getCommentData()} />
            </TabPanel>
            <TabPanel item="Images">
                The sugar maple is one of America’s most-loved trees. In fact,
                more states have claimed it as their state tree than any other
                single species—for New York, West Virginia, Wisconsin, and
                Vermont, the maple tree stands alone.
            </TabPanel>
        </Tabs>
    )
}

export default NavTabs
