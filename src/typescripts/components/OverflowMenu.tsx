import React, { useCallback } from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"
// import ModalContent from "./ModalContent"

interface Props {
    attachment: collectedAttachmens
}

function getMimeType(file) {
    const reader = new FileReader()
    reader.onloadend = function () {
        const arr = new Uint8Array(reader.result).subarray(0, 4)
        let header = ""
        for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16)
        }
        console.log("header: ", header)
        switch (header) {
            case "89504e47":
                return "image/png"
            case "47494638":
                return "image/gif"
            case "25504446":
                return "application/pdf"
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
                return "image/jpeg"
            default:
                return "unknown"
        }
    }
    reader.readAsArrayBuffer(file)
}

const OverflowMenu: React.FC<Props> = ({ attachment }) => {
    const openModal = useCallback(async (url: string) => {
        try {
            const client = (window as any).ZAFClient.init()
            const options = {
                location: "modal",
                url: "assets/modal.html#file=" + url,
                size: {
                    width: "80vw",
                    height: "80vh",
                },
            }

            const modalContext = await client.invoke(
                "instances.create",
                options,
            )
            const modalClient = client.instance(
                modalContext["instances.create"][0].instanceGuid,
            )

            modalClient.on("modal.close", () => {
                URL.revokeObjectURL(url)
                client.invoke("instances.close", modalContext)
            })
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

            // console.log("fileType: ", getMimeType(blob))

            const fileURL = URL.createObjectURL(blob)
            openModal(fileURL)
            // const win = window.open("", "_blank")

            // if (win && win.document) {
            //     const html = `<html><head><title>${attachment.fileName}</title></head><body height="100%" width="100%"><iframe src="${fileURL}" height="100%" width="100%" frameborder="0"></iframe></body></html>`
            //     win.document.write(html)
            // } else {
            //     console.error(
            //         "Failed to open the file: Window or document is null",
            //     )
            // }
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
