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
import { ConfirmDeleteModalProps } from "../utils/interfaces"

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    visible,
    onClose,
    onDelete,
    fileName,
}) => {
    return (
        <>
            {visible && (
                <Modal onClose={onClose}>
                    <Header tag="h2">Deleting a file</Header>
                    <Body>
                        Are you sure you want to delete {fileName}?<br /> This
                        action cannot be undone.
                    </Body>
                    <Footer>
                        <FooterItem>
                            <Button onClick={onClose}>Cancel</Button>
                        </FooterItem>
                        <FooterItem>
                            <Button isPrimary isDanger onClick={onDelete}>
                                Delete
                            </Button>
                        </FooterItem>
                    </Footer>
                    <Close aria-label="Close modal" />
                </Modal>
            )}
        </>
    )
}

export default ConfirmDeleteModal
