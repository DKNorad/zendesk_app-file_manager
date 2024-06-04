import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import Modal from "../components/Modal"
import { getZendeskClient } from "../components/ZenDeskClient"

const ModalContainer: React.FC = () => {
    const container = document.getElementById("modal")

    useEffect(() => {
        if (!container) {
            console.error("Modal container not found in the DOM")
            return
        }

        const client = getZendeskClient()

        const handleAppRegistered = (appData: any) => {
            ReactDOM.render(
                <Modal client={client} appData={appData} />,
                container,
            )
        }

        client.on("app.registered", handleAppRegistered)

        return () => {
            client.off("app.registered", handleAppRegistered)
        }
    }, [container])

    return null
}

export default ModalContainer
