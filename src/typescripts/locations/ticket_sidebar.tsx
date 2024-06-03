import React from "react"
import ReactDOM from "react-dom"
import App from "../App"
import { getZendeskClient } from "../components/ZenDeskClient"

const client = getZendeskClient()
const container = document.getElementById("app")

client.on("app.registered", function (appData: any) {
    ReactDOM.render(<App client={client} appData={appData} />, container)
})
