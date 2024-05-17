import React, { useCallback } from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"
import ModalContent from "./ModalContent"

interface Props {
    attachment: collectedAttachmens
}

const OverflowMenu: React.FC<Props> = ({ attachment }) => {
    const openModal = useCallback(async (url: string) => {
        try {
            const client = (window as any).ZAFClient.init()
            const options = {
                location: "modal",
                url: "assets/modal.html#file=" + url,
                size: { width: "800px", height: "600px" },
            }

            const modalContext = await client.invoke(
                "instances.create",
                options,
            )
            const modalClient = client.instance(
                modalContext["instances.create"][0].instanceGuid,
            )

            modalClient.on("modal.close", () => {})
        } catch (error) {
            console.error("Failed to open modal:", error)
        }
    }, [])

    const openFile = useCallback(async (url: string) => {
        try {
            const response = await fetch(attachment.contentUrl)
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.statusText}`,
                )
            }

            const blob = await response.blob()
            const fileURL = URL.createObjectURL(blob)
            window.open(fileURL)
        } catch (error) {
            console.error("Failed to open the file:", error)
        }
    }, [])

    const deleteAttachment = useCallback(async () => {
        try {
            const client = (window as any).ZAFClient.init()
            const options = {
                url: `/api/v2/tickets/${attachment.ticketID}/comments/${attachment.messageID}/attachments/${attachment.attachmentID}/redact`,
                type: "PUT",
                contentType: "application/json",
            }

            await client.request(options)
        } catch (error) {
            console.error("Failed to redact attachment:", error)
        }
    }, [attachment.attachmentID, attachment.messageID, attachment.ticketID])

    return (
        <Menu
            button={(props) => (
                <Button {...props} size="small" isNeutral focusInset>
                    ::
                </Button>
            )}
        >
            <Item value="view" onClick={() => openFile(attachment.contentUrl)}>
                View
            </Item>
            <Item
                value="download"
                onClick={() => window.open(attachment.contentUrl, "_blank")}
            >
                Download
            </Item>
            <Item value="delete" onClick={deleteAttachment}>
                Delete
            </Item>
        </Menu>
    )
}

export default OverflowMenu
