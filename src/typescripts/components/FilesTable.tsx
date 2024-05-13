import React from "react"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import {
    Body,
    Cell,
    Head,
    HeaderCell,
    HeaderRow,
    Row,
    Table,
} from "@zendeskgarden/react-tables"
import { Button } from "@zendeskgarden/react-buttons"
import { collectedAttachmens } from "./NavTabs"

interface attachmentsObj {
    attachments: Array<collectedAttachmens>
}

// async function openFile(url: string) {
//     const blob = await fetch(url).then((r) => r.blob())
//     const fileURL = URL.createObjectURL(blob)
//     const newWindow = window.open(fileURL)
//     return FileBox(fileURL)
//     setTimeout(function () {
//         newWindow.document.title = "Spaceman"
//     }, 100)
// }

async function openModal(data: string) {
    const client = ZAFClient.init()

    const blob = await fetch(data).then((r) => r.blob())
    const fileURL = URL.createObjectURL(blob)

    client
        .invoke("instances.create", {
            location: "modal",
            url: "assets/modal.html",
            size: { width: "600px", height: "700px" },
            title: "File Viewer",
        })
        .then(function () {})
}

const OverflowMenu = (attachmentFileUrl: string) => {
    return (
        <Menu
            button={(props) => (
                <Button {...props} size="small" isNeutral focusInset>
                    ::
                </Button>
            )}
        >
            <Item value="view" onClick={() => openModal(attachmentFileUrl)}>
                View
            </Item>
            <Item
                value="download"
                onClick={() => console.log(attachmentFileUrl)}
            >
                Download
            </Item>
            <Item value="delete" onClick={() => console.log(attachmentFileUrl)}>
                Delete
            </Item>
        </Menu>
    )
}

function formatDate(date: string): string {
    const cdate = new Date(date)
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: false,
    } as const
    date = cdate.toLocaleDateString("en-us", options)
    return date
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = [
        "Bytes",
        "KiB",
        "MiB",
        "GiB",
        "TiB",
        "PiB",
        "EiB",
        "ZiB",
        "YiB",
    ]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function FilesTable(attachments: attachmentsObj): React.ReactNode {
    return (
        <Table size="small">
            <Head>
                <HeaderRow>
                    <HeaderCell style={{ width: "45%" }}>File name</HeaderCell>
                    <HeaderCell style={{ width: "22.5%", textAlign: "center" }}>
                        Size
                    </HeaderCell>
                    <HeaderCell style={{ width: "22.5%", textAlign: "center" }}>
                        Date
                    </HeaderCell>
                    <HeaderCell style={{ width: "10%" }} />
                </HeaderRow>
            </Head>
            <Body>
                {attachments.attachments.map(
                    (attachment: collectedAttachmens, index: number) => (
                        <Row key={index}>
                            <Cell
                                isTruncated
                                style={{
                                    width: "45%",
                                }}
                            >
                                {attachment.fileName}
                            </Cell>
                            <Cell
                                style={{ width: "22.5%", textAlign: "right" }}
                            >
                                {formatBytes(attachment.size)}
                            </Cell>
                            <Cell
                                style={{ width: "22.5%", textAlign: "right" }}
                            >
                                {formatDate(attachment.timestamp)}
                            </Cell>
                            <Cell
                                hasOverflow
                                style={{ width: "10%", textAlign: "right" }}
                            >
                                {OverflowMenu(attachment.contentUrl)}
                            </Cell>
                        </Row>
                    ),
                )}
            </Body>
        </Table>
    )
}

export default FilesTable
