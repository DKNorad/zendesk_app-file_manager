// src/locations/modal.tsx
import React from "react"
import ReactDOM from "react-dom"
import Modal from "../components/Modal"

declare const ZAFClient: any

const client = ZAFClient.init()
const container = document.getElementById("modal")

client.on("app.registered", function (appData: any) {
    ReactDOM.render(<Modal client={client} appData={appData} />, container)
})
