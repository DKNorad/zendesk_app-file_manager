import React from "react"
import ReactDOM from "react-dom"
import Modal from "../components/Modal"
import { getZendeskClient } from "../components/ZenDeskClient"

const client = getZendeskClient()
const container = document.getElementById("modal")

client.on("app.registered", function (appData: any) {
    ReactDOM.render(<Modal client={client} appData={appData} />, container)
})
