import React from "react"
import {
    Body,
    Cell,
    Head,
    HeaderCell,
    HeaderRow,
    Row,
    Table,
} from "@zendeskgarden/react-tables"
import { collectedAttachmens } from "./NavTabs"
import OverflowMenu from "./OverflowMenu"

interface attachmentsObj {
    attachments: Array<collectedAttachmens>
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
                    (attachment: collectedAttachmens, index: number) =>
                        attachment.fileName !== "redacted.txt" ? (
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
                                    style={{
                                        width: "22.5%",
                                        textAlign: "right",
                                    }}
                                >
                                    {formatBytes(attachment.size)}
                                </Cell>
                                <Cell
                                    style={{
                                        width: "22.5%",
                                        textAlign: "right",
                                    }}
                                >
                                    {formatDate(attachment.timestamp)}
                                </Cell>
                                <Cell
                                    hasOverflow
                                    style={{
                                        width: "10%",
                                        textAlign: "right",
                                    }}
                                >
                                    <OverflowMenu attachment={attachment} />
                                </Cell>
                            </Row>
                        ) : null,
                )}
            </Body>
        </Table>
    )
}

export default FilesTable
