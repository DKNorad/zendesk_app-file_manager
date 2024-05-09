import React from "react"
import { Col, Row as GridRow } from "@zendeskgarden/react-grid"
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
        <GridRow justifyContent="center">
            <Col>
                <Menu hasArrow={false} isCompact button="">
                    <Item
                        value="view"
                        onClick={() => console.log(attachmentFileID)}
                    >
                        View
                    </Item>
                    <Item
                        value="download"
                        onClick={() => console.log(attachmentFileID)}
                    >
                        Download
                    </Item>
                    <Item
                        value="delete"
                        onClick={() => console.log(attachmentFileID)}
                    >
                        Delete
                    </Item>
                </Menu>
            </Col>
        </GridRow>
    )
}

const adjustColumnWidths = () => {
    const adjustedWidths = {
        filename: "auto",
        date: "auto",
        actions: "auto",
    }

    return adjustedWidths
}

function formatDate(date: string): string {
    const cdate = new Date(date)
    const options = { year: "numeric", month: "short", day: "numeric" }
    date = cdate.toLocaleDateString("en-us", options)
    return date
}

function FilesTable(files: FilesObject[]): React.ReactNode {
    const widths = adjustColumnWidths()
    if (files.length === 0) return "No attachments found."
    const fileAttachments = Object.values(files)[0]

    return (
        <Table>
            <Head>
                <HeaderRow>
                    <HeaderCell style={{ width: "60%" }}>File name</HeaderCell>
                    <HeaderCell style={{ width: "20%", textAlign: "right" }}>
                        Date
                    </HeaderCell>
                    <HeaderCell style={{ width: "20%", textAlign: "right" }}>
                        Action
                    </HeaderCell>
                </HeaderRow>
            </Head>
            <Body>
                {fileAttachments.flatMap((entry: dataEntry, index: number) =>
                    entry.attachments.map((attachment, attachmentIndex) => (
                        <Row key={`${index}-${attachmentIndex}`}>
                            <Cell
                                style={{
                                    width: "60%",
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                }}
                            >
                                {attachment.filename}
                            </Cell>
                            <Cell style={{ width: "20%", textAlign: "right" }}>
                                {formatDate(entry.timestamp)}
                            </Cell>
                            <Cell style={{ width: "20%", textAlign: "right" }}>
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
