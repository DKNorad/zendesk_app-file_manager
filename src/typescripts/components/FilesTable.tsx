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

const OverflowMenu = (attachmentFileID: number) => {
    return (
        <Menu
            button={(props) => (
                <Button {...props} size="small" isNeutral focusInset>
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

function FilesTable(files: Array<collectedAttachmens>): React.ReactNode {
    console.log(files)
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
                {files.map((attachment: collectedAttachmens, index: number) => (
                    <Row key={index}>
                        <Cell
                            isTruncated
                            style={{
                                width: "60%",
                            }}
                        >
                            {attachment.fileName}
                        </Cell>
                        <Cell style={{ width: "30%", textAlign: "right" }}>
                            {formatDate(attachment.timestamp)}
                        </Cell>
                        <Cell
                            hasOverflow
                            style={{ width: "10%", textAlign: "right" }}
                        >
                            {OverflowMenu(attachment.fileName)}
                        </Cell>
                    </Row>
                ))}
            </Body>
        </Table>
    )
}

export default FilesTable
