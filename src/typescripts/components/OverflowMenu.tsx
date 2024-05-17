import React, { useCallback } from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"
import ModalContent from "./ModalContent"
import { title } from "process"

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

    const openFile = useCallback(async () => {
        try {
            const response = await fetch(attachment.contentUrl)
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.statusText}`,
                )
            }

            const blob = await response.blob()
            const fileURL = URL.createObjectURL(blob)

            const win = window.open("")

            if (win.document) {
                win.document.write(
                    "<html><head><title>" +
                        attachment.fileName +
                        '</title></head><body height="100%" width="100%"><iframe src="' +
                        fileURL +
                        '" height="100%" width="100%" frameborder="0"></iframe></body></html>',
                )
            }
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
            <Item value="view" onClick={() => openFile()}>
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
