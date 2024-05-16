import React from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"

declare const ZAFClient: any

const OverflowMenu = (attachment: collectedAttachmens) => {
    const openModal = () => {
        // Initialize Zendesk client and open Zendesk modal
        const client = (window as any).ZAFClient.init()
        client
            .invoke("instances.create", {
                location: "modal",
                url: "assets/modal.html",
                size: { width: "100%", height: "600px" },
            })
            .then((modalContext: any) => {
                const modalClient = client.instance(
                    modalContext["instances.create"][0].instanceGuid,
                )
                modalClient.on("modal.close", () => {
                    client.invoke("instances.close", modalContext)
                })
            })
    }

    async function deleteAttachment() {
        const zafClient = ZAFClient.init()

        try {
            const options = {
                url: `/api/v2/tickets/${attachment.ticketID}/comments/${attachment.messageID}/attachments/${attachment.attachmentID}/redact`,
                type: "PUT",
                contentType: "application/json",
            }

            await zafClient.request(options)
        } catch (error) {
            console.error("Failed to redact attachment:", error)
        }
    }

    async function openFile() {
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
    }

    return (
        <Menu
            button={(props) => (
                <Button {...props} size="small" isNeutral focusInset>
                    ::
                </Button>
            )}
        >
            <Item value="view" onClick={() => openFile()}>
                View
            </Item>
            <Item
                value="download"
                onClick={() => window.open(attachment.contentUrl, "_blank")}
            >
                Download
            </Item>
            <Item value="delete" onClick={() => deleteAttachment()}>
                Delete
            </Item>
        </Menu>
    )
}

export default OverflowMenu
