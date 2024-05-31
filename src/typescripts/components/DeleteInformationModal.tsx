import React from "react"
import { Button } from "@zendeskgarden/react-buttons"
import {
    Modal,
    Header,
    Body,
    Footer,
    FooterItem,
    Close,
} from "@zendeskgarden/react-modals"
import { DeletionError } from "./OverflowMenu"

interface DeleteInformationModalProps {
    visible: boolean
    onClose: () => void
    fileName: string
    deletionError?: DeletionError
}

const DeleteInformationModal: React.FC<DeleteInformationModalProps> = ({
    visible,
    onClose,
    fileName,
    deletionError,
}) => {
    return (
        <>
            {visible && (
                <Modal onClose={onClose}>
                    <Header tag="h2">
                        {!deletionError
                            ? "File Deleted Successfully"
                            : "Error Deleting File"}
                    </Header>
                    <Body>
                        {!deletionError ? (
                            `${fileName} was successfully deleted.`
                        ) : (
                            <>
                                An error occurred while trying to delete{" "}
                                {fileName}.
                                <br />
                                <br />
                                Error: {deletionError.error}.
                                <br />
                                Description: {deletionError.description}.
                            </>
                        )}
                    </Body>
                    <Footer>
                        <FooterItem>
                            <Button onClick={onClose}>OK</Button>
                        </FooterItem>
                    </Footer>
                    <Close aria-label="Close modal" />
                </Modal>
            )}
        </>
    )
}

export default DeleteInformationModal
