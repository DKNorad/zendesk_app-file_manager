import React from "react"
import ReactDOM from "react-dom"
import App from "../App"

declare const ZAFClient: any

const client = ZAFClient.init()
const container = document.getElementById("app")

client.on("app.registered", function (appData: any) {
    ReactDOM.render(<App client={client} appData={appData} />, container)
})
