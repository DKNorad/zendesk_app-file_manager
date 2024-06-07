import React, { useState } from "react"
import {
    Body,
    Cell,
    Head,
    HeaderCell,
    HeaderRow,
    Row,
    SortableCell,
    Table,
} from "@zendeskgarden/react-tables"
import OverflowMenu from "../OverflowMenu"
import { formatBytes, formatDate, missingImage } from "../../utils/utils"
import {
    AttachedImagesattachmentsObj,
    collectedAttachmens,
} from "../../utils/interfaces"

const AttachedImagesTable: React.FC<AttachedImagesattachmentsObj> = ({
    attachments,
}) => {
    const [sortColumn, setSortColumn] = useState<string>("imageName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    if (attachments.length === 0) {
        return null
    }

    // Sort attachments based on the selected column and order
    const sortedAttachments = [...attachments].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (aValue === bValue) {
            return 0
        }

        if (sortOrder === "asc") {
            return aValue < bValue ? -1 : 1
        } else {
            return aValue > bValue ? -1 : 1
        }
    })

    const toggleSortOrder = (column: string) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortOrder("asc")
        }
    }

    return (
        <Table>
            <Head>
                <HeaderRow>
                    <HeaderCell style={{ width: "20%" }} />
                    <SortableCell
                        width={"30%"}
                        onClick={() => toggleSortOrder("fileName")}
                    >
                        Image name
                    </SortableCell>
                    <SortableCell
                        width={"20%"}
                        style={{ float: "right" }}
                        onClick={() => toggleSortOrder("size")}
                    >
                        Size
                    </SortableCell>
                    <SortableCell
                        width={"20%"}
                        style={{ float: "right" }}
                        onClick={() => toggleSortOrder("timestamp")}
                    >
                        Date
                    </SortableCell>
                    <HeaderCell width={"10%"} />
                </HeaderRow>
            </Head>
            <Body>
                {sortedAttachments.map(
                    (attachment: collectedAttachmens, index: number) => (
                        console.log(attachment),
                        (
                            <Row key={index}>
                                <Cell style={{ width: "20%" }}>
                                    {attachment.thumbnails &&
                                    attachment.thumbnails[0] ? (
                                        <img
                                            src={
                                                attachment.thumbnails[0]
                                                    .content_url
                                            }
                                            alt={attachment.fileName}
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={missingImage}
                                            alt={"No thumbnail"}
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                            }}
                                        />
                                    )}
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
                        )
                    ),
                )}
            </Body>
        </Table>
    )
}

export default AttachedImagesTable
