import React, { useState, useMemo } from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import { IconButton } from "@zendeskgarden/react-buttons"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import DeleteInformationModal from "./DeleteInformationModal"
import { getZendeskClient } from "./ZenDeskClient"
import Modal from "./Modal"
import { renderToString } from "react-dom/server"
import {
    CollectedEmbeddedImages,
    DeletionError,
    OverflowMenuProps,
    collectedAttachmens,
} from "../utils/interfaces"
import { overFlowImage } from "../utils/utils"

// Type guard to check if attachment is of type collectedAttachmens
function isCollectedAttachment(
    attachment: collectedAttachmens | CollectedEmbeddedImages,
): attachment is collectedAttachmens {
    return (
        (attachment as collectedAttachmens).ticketID !== undefined &&
        (attachment as collectedAttachmens).messageID !== undefined &&
        (attachment as collectedAttachmens).attachmentID !== undefined
    )
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({
    attachment,
    fileType,
}) => {
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

    const openFileModal = async (url: string) => {
        try {
            const client = getZendeskClient()
            const context = await client.context()
            const parent_guid = context.instanceGuid

            const modalContext = await client.invoke("instances.create", {
                location: "modal",
                url: `assets/modal.html#parent_guid=${parent_guid}`,
                size: { width: "80vw", height: "70vh" },
            })

            const modalGuid = modalContext["instances.create"][0].instanceGuid
            const modalClient = client.instance(modalGuid)

            const handleModalReady = async () => {
                try {
                    let fileTypeModal
                    if (fileType === "image" || fileType === "embeddedImage") {
                        fileTypeModal = "image"
                    } else {
                        fileTypeModal = "text"
                    }

                    const modalContentString = renderToString(
                        <Modal
                            data={{
                                url: url,
                                fileName: attachment.fileName ?? "Unknown",
                            }}
                            fileType={fileTypeModal}
                        />,
                    )

                    await modalClient.trigger("drawData", modalContentString)

                    const modalElement = document.querySelector(
                        ".modal-content-selector",
                    )
                    if (modalElement) {
                        modalElement.scrollTop = modalElement.scrollHeight
                    }

                    // Unsubscribe from the event after handling it
                    client.off("modalReady", handleModalReady)
                } catch (error) {
                    console.error(
                        "Error during modal content rendering:",
                        error,
                    )
                }
            }

            // Attach the handler for modal readiness
            client.on("modalReady", handleModalReady)

            // Clean up the event listener when modal is closed
            modalClient.on("modal.close", () => {
                client.off("modalReady", handleModalReady)
            })
        } catch (error) {
            console.error("Failed to open modal:", error)
        }
    }

    const openFile = async (openType: string) => {
        try {
            if (
                (fileType === "image" ||
                    fileType === "embeddedImage" ||
                    fileType === "pdf") &&
                openType === "Modal"
            ) {
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
    }

    const attachmentDetails = useMemo(() => {
        if (isCollectedAttachment(attachment)) {
            return {
                ticketID: attachment.ticketID,
                messageID: attachment.messageID,
                attachmentID: attachment.attachmentID,
            }
        }
        return null
    }, [attachment])

    const deleteAttachment = async () => {
        if (!attachmentDetails) {
            console.error("Cannot delete attachment: invalid type")
            return
        }

        try {
            const client = getZendeskClient()
            const options = {
                url: `/api/v2/tickets/${attachmentDetails.ticketID}/comments/${attachmentDetails.messageID}/attachments/${attachmentDetails.attachmentID}/redact`,
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
    }

    const handleDeleteClick = () => {
        setSelectedFileName(attachment.fileName ?? "Unknown")
        setConfirmDeleteModalVisible(true)
    }

    const handleViewNewTabClick = () => {
        if (fileType === "image") {
            window.open(attachment.contentUrl, "_blank")
        } else {
            openFile("NewTab")
        }
    }

    const forModal =
        fileType === "Text" ||
        fileType === "image" ||
        fileType === "embeddedImage" ||
        fileType === "Log" ||
        fileType === "XML" ||
        fileType === "CSV" ||
        fileType === "File"

    const forNewTab =
        fileType === "Text" ||
        fileType === "image" ||
        fileType === "embeddedImage" ||
        fileType === "Log" ||
        fileType === "XML" ||
        fileType === "CSV" ||
        fileType === "File" ||
        fileType === "PDF"

    return (
        <>
            <Menu
                button={(props) => (
                    <IconButton
                        {...props}
                        size="small"
                        aria-label="Actions"
                        isNeutral
                        focusInset
                    >
                        <img src={overFlowImage} />
                    </IconButton>
                )}
            >
                <Item
                    value="view"
                    onClick={forModal ? () => openFile("Modal") : undefined}
                    isDisabled={!forModal}
                >
                    View
                </Item>
                <Item
                    value="viewNewTab"
                    onClick={forNewTab ? handleViewNewTabClick : undefined}
                    isDisabled={!forNewTab}
                >
                    View (New Tab)
                </Item>
                {fileType !== "image" && fileType !== "embeddedImage" && (
                    <Item
                        value="download"
                        onClick={() =>
                            window.open(attachment.contentUrl, "_blank")
                        }
                    >
                        Download
                    </Item>
                )}
                {fileType !== "embeddedImage" && (
                    <Item value="delete" onClick={handleDeleteClick}>
                        Delete
                    </Item>
                )}
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
