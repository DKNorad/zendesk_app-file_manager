// src/components/Modal.tsx
import React from "react"
import ModalContent from "./ModalContent"
import { collectedAttachmens } from "./NavTabs"

interface Props {
    client: any
    appData: any
    attachment: collectedAttachmens
}

class Modal extends React.Component<Props> {
    _client: any
    _appData: any
    attachment: collectedAttachmens

    constructor(props: Props) {
        super(props)
        this._client = props.client
        this._appData = props.appData
        this.attachment = props.attachment
    }

    render() {
        return 123
    }

    /**
     * Handle error
     * @param {Object} error error object
     */
    _handleError(error: any): void {
        console.log("An error is handled here: ", error.message)
    }
}

export default Modal
