import React from "react"
import { Col, Row as GridRow } from "@zendeskgarden/react-grid"
import { Menu, Item } from "@zendeskgarden/react-dropdowns.next"
import {
    Body,
    Cell,
    Head,
    HeaderCell,
    HeaderRow,
    OverflowButton,
    Row,
    Table,
} from "@zendeskgarden/react-tables"

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
        actions: "auto",
    }

    return adjustedWidths
}

function FilesTable(files: FilesObject[]) {
    const widths = adjustColumnWidths()
    if (files.length === 0) return "No attachments found."
    const fileAttachments = Object.values(files)[0]
    console.log(files)

    return (
        <Table>
            <Head>
                <HeaderRow>
                    <HeaderCell>File name</HeaderCell>
                    <HeaderCell
                        style={{
                            width: widths.actions,
                            textAlign: "right",
                        }}
                    >
                        Action
                    </HeaderCell>
                </HeaderRow>
            </Head>
            <Body>
                {fileAttachments.map(
                    (attachment: Attachment, index: number) => (
                        <Row key={index}>
                            <Cell>{attachment.filename}</Cell>
                            <Cell
                                hasOverflow
                                style={{
                                    width: widths.actions,
                                    textAlign: "right",
                                }}
                            >
                                {OverflowMenu(attachment.filename)}
                            </Cell>
                        </Row>
                    ),
                )}
            </Body>
        </Table>
    )
}

export default FilesTable
