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
import { formatBytes, formatDate } from "./FilesTable"

interface attachmentsObj {
    attachments: Array<collectedAttachmens>
}

const ImagesTable: React.FC<attachmentsObj> = ({ attachments }) => {
    return (
        <Table>
            <Head>
                <HeaderRow>
                    <HeaderCell style={{ width: "20%" }} />
                    <HeaderCell style={{ width: "30%" }}>Image name</HeaderCell>
                    <HeaderCell style={{ width: "20%", textAlign: "center" }}>
                        Size
                    </HeaderCell>
                    <HeaderCell style={{ width: "20%", textAlign: "center" }}>
                        Date
                    </HeaderCell>
                    <HeaderCell style={{ width: "10%" }} />
                </HeaderRow>
            </Head>
            <Body>
                {attachments.map(
                    (attachment: collectedAttachmens, index: number) =>
                        attachment.fileName !== "redacted.txt" &&
                        attachment.thumbnails &&
                        attachment.thumbnails[0] ? (
                            <Row key={index}>
                                <Cell
                                    style={{
                                        width: "20%",
                                    }}
                                >
                                    <img
                                        src={
                                            attachment.thumbnails[0].content_url
                                        }
                                        alt={attachment.fileName}
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                    />
                                </Cell>
                                <Cell
                                    isTruncated
                                    style={{
                                        width: "30%",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {attachment.fileName}
                                </Cell>
                                <Cell
                                    style={{
                                        width: "20%",
                                        textAlign: "right",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {formatBytes(attachment.size)}
                                </Cell>
                                <Cell
                                    style={{
                                        width: "20%",
                                        textAlign: "right",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {formatDate(attachment.timestamp)}
                                </Cell>
                                <Cell
                                    hasOverflow
                                    style={{
                                        width: "10%",
                                        textAlign: "right",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <OverflowMenu
                                        attachment={attachment}
                                        fileType="image"
                                    />
                                </Cell>
                            </Row>
                        ) : null,
                )}
            </Body>
        </Table>
    )
}

export default ImagesTable
