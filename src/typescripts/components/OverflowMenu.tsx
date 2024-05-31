import React, { useCallback, useState } from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import DeleteInformationModal from "./DeleteInformationModal"
import { getZendeskClient } from "./ZenDeskClient"
import Modal from "./Modal"
import { renderToString } from "react-dom/server"

interface Props {
    attachment: collectedAttachmens
    fileType: string
}

export interface DeletionError {
    error: string
    description: string
}

const OverflowMenu: React.FC<Props> = ({ attachment, fileType }) => {
    // For the delete confirmation modal
    const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] =
        useState(false)
    const [
        isDeleteInformationModalVisible,
        setisDeleteInformationModalVisible,
    ] = useState(false)
    const [selectedFileName, setSelectedFileName] = useState("")
    const [deletionError, setDeletionError] = useState<
        DeletionError | undefined
    >()

    // For the file view modal
    const openFileModal = useCallback(
        async (url: string) => {
            try {
                const client = getZendeskClient()
                const context = await client.context()
                const parent_guid = context.instanceGuid

                const modalContext = await client.invoke("instances.create", {
                    location: "modal",
                    url: `assets/modal.html#parent_guid=${parent_guid}`,
                    size: { width: "80vw", height: "70vh" },
                })

                const modalClient = client.instance(
                    modalContext["instances.create"][0].instanceGuid,
                )

                const setHtml = () => {
                    const modalContentString = renderToString(
                        fileType === "image" ? (
                            <Modal
                                data={{
                                    url: url,
                                    fileName: attachment.fileName,
                                }}
                                fileType="image"
                            />
                        ) : (
                            <Modal
                                data={{
                                    url: url,
                                    fileName: attachment.fileName,
                                }}
                                fileType="text"
                            />
                        ),
                    )
                    modalClient.trigger("drawData", modalContentString)
                    client.off("modalReady", setHtml)
                }

                client.on("modalReady", setHtml)
                modalClient.on("modal.close", () => {})
            } catch (error) {
                console.error("Failed to open modal:", error)
            }
        },
        [fileType],
    )

    const openFile = useCallback(async (openType: string) => {
        try {
            if (fileType === "image" && openType === "Modal") {
                openFileModal(attachment.contentUrl)
            } else {
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
            }
        } catch (error) {
            console.error("Failed to open the file:", error)
        }
    }, [])

    const deleteAttachment = useCallback(async () => {
        try {
            const client = getZendeskClient()
            const options = {
                url: `/api/v2/tickets/${attachment.ticketID}/comments/${attachment.messageID}/attachments/${attachment.attachmentID}/redact`,
                type: "PUT",
                contentType: "application/json",
            }

            // Define a timeout duration in milliseconds
            const TIMEOUT_DURATION = 5000 // 5 seconds

            // Create a promise that resolves after the timeout duration
            const timeoutPromise = new Promise<void>((_, reject) => {
                setTimeout(() => {
                    reject(new Error("Request timed out"))
                }, TIMEOUT_DURATION)
            })

            // Create a promise for the API request
            const requestPromise = client.request(options)

            // Use Promise.race to race between the request and the timeout
            await Promise.race([requestPromise, timeoutPromise])

            // If the request succeeds, update state accordingly
            setConfirmDeleteModalVisible(false)
            setisDeleteInformationModalVisible(true)
        } catch (error: any) {
            if (
                error &&
                error.responseJSON &&
                typeof error.responseJSON === "object"
            ) {
                const responseJSON = error.responseJSON as DeletionError
                setDeletionError(responseJSON)
                setConfirmDeleteModalVisible(false)
                setisDeleteInformationModalVisible(true)
            } else {
                console.error("Failed to delete attachment:", error)
            }
        }
    }, [attachment.attachmentID, attachment.messageID, attachment.ticketID])

    const handleDeleteClick = useCallback(() => {
        setSelectedFileName(attachment.fileName)
        setConfirmDeleteModalVisible(true)
    }, [attachment.fileName])

    const handleViewNewTabClick = () => {
        if (fileType === "image") {
            window.open(attachment.contentUrl, "_blank")
        } else {
            openFile("NewTab")
        }
    }

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
                <Item value="viewNewTab" onClick={handleViewNewTabClick}>
                    View (New Tab)
                </Item>
                {fileType !== "image" && (
                    <Item
                        value="download"
                        onClick={() =>
                            window.open(attachment.contentUrl, "_blank")
                        }
                    >
                        Download
                    </Item>
                )}
                <Item value="delete" onClick={handleDeleteClick}>
                    Delete
                </Item>
            </Menu>
            <ConfirmDeleteModal
                visible={isConfirmDeleteModalVisible}
                onClose={() => setConfirmDeleteModalVisible(false)}
                onDelete={deleteAttachment}
                fileName={selectedFileName}
            />
            <DeleteInformationModal
                visible={isDeleteInformationModalVisible}
                onClose={() => setisDeleteInformationModalVisible(false)}
                fileName={selectedFileName}
                deletionError={deletionError}
            />
        </>
    )
}

export default OverflowMenu
