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

interface dataEntry {
    attachments: FilesObject[]
    timestamp: string
}
interface Attachment {
    contentType: string
    contentUrl: string
    filename: string
}

export interface FilesObject {
    files: Attachment[]
    length: number
}

const OverflowMenu = (attachmentFileID: number) => {
    return (
        <Menu
            button={(props) => (
                <Button {...props} size="small" isPill focusInset>
                    ::
                </Button>
            )}
        >
            <Item value="view" onClick={() => console.log(attachmentFileID)}>
                View
            </Item>
            <Item
                value="download"
                onClick={() => console.log(attachmentFileID)}
            >
                Download
            </Item>
            <Item value="delete" onClick={() => console.log(attachmentFileID)}>
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
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    } as const
    date = cdate.toLocaleDateString("en-us", options)
    return date
}

function FilesTable(files: FilesObject[]): React.ReactNode {
    if (files.length === 0) return "No attachments found."
    const fileAttachments = Object.values(files)[0]
    console.log(fileAttachments)

    return (
        <Table size="small" style={{ minWidth: 450 }}>
            <Head>
                <HeaderRow>
                    <HeaderCell style={{ width: "60%" }}>File name</HeaderCell>
                    <HeaderCell style={{ width: "30%", textAlign: "center" }}>
                        Date
                    </HeaderCell>
                    <HeaderCell style={{ width: "10%" }} />
                </HeaderRow>
            </Head>
            <Body>
                {fileAttachments.flatMap((entry: dataEntry, index: number) =>
                    entry.attachments.map((attachment, attachmentIndex) => (
                        <Row key={`${index}-${attachmentIndex}`}>
                            <Cell
                                isTruncated
                                style={{
                                    width: "60%",
                                }}
                            >
                                {attachment.filename}
                            </Cell>
                            <Cell style={{ width: "30%", textAlign: "right" }}>
                                {formatDate(entry.timestamp)}
                            </Cell>
                            <Cell
                                hasOverflow
                                style={{ width: "10%", textAlign: "right" }}
                            >
                                {OverflowMenu(attachment.filename)}
                            </Cell>
                        </Row>
                    )),
                )}
            </Body>
        </Table>
    )
}

export default FilesTable
