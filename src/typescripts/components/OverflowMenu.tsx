import React, { useCallback, useState } from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"
import ConfirmDeleteModal from "./DeleteModal"
import { getZendeskClient } from "./ZenDeskClient"
import ModalContent from "./ModalContent"
import { renderToString } from "react-dom/server"
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
    // For the delete confirmation modal
    const [isModalVisible, setModalVisible] = useState(false)
    const [selectedFileName, setSelectedFileName] = useState("")

    // For the file view modal
    const openFileModal = useCallback(async (url: string) => {
        try {
            const client = getZendeskClient()
            client
                .invoke("instances.create", {
                    location: "modal",
                    url: "assets/modal.html",
                    size: {
                        width: "80vw",
                        height: "70vh",
                    },
                })
                .then((modalContext: any) => {
                    const modalClient = client.instance(
                        modalContext["instances.create"][0].instanceGuid,
                    )
                    client.on("modalReady", function setHtml() {
                        const modalContentString = renderToString(
                            <ModalContent data={url} />,
                        )
                        modalClient.trigger("drawData", modalContentString)
                        client.off("modalReady", setHtml)
                    })
                    modalClient.on("modal.close", function () {})
                })
        } catch (error) {
            console.error("Failed to open modal:", error)
        }
    }, [])

    const openFile = useCallback(async (openType: string) => {
        try {
            const response = await fetch(attachment.contentUrl)
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.statusText}`,
                )
            }

            if (openType === "Modal") {
                const text = await response.text()
                openFileModal(text)
            } else {
                const blob = await response.blob()
                const fileURL = URL.createObjectURL(blob)
                window.open(fileURL, "_blank")
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
            setModalVisible(false)
        } catch (error) {
            console.error("Failed to redact attachment:", error)
        }
    }, [attachment.attachmentID, attachment.messageID, attachment.ticketID])

    const handleDeleteClick = useCallback(() => {
        setSelectedFileName(attachment.fileName)
        setModalVisible(true)
    }, [attachment.fileName])

    return (
        <>
            <Menu
                button={(props) => (
                    <Button {...props} size="small" isNeutral focusInset>
                        ::
                    </Button>
                )}
            >
                <Item value="view" onClick={() => openFile("Modal")}>
                    View
                </Item>
                <Item value="viewNewTab" onClick={() => openFile("NewTab")}>
                    View (New Tab)
                </Item>
                <Item
                    value="download"
                    onClick={() => window.open(attachment.contentUrl, "_blank")}
                >
                    Download
                </Item>
                <Item value="delete" onClick={handleDeleteClick}>
                    Delete
                </Item>
            </Menu>
            <ConfirmDeleteModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onDelete={deleteAttachment}
                fileName={selectedFileName}
            />
        </>
    )
}

export default OverflowMenu
