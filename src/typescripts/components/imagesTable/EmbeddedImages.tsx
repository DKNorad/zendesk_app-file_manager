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
import { formatDate } from "../../utils/utils"
import {
    CollectedEmbeddedImages,
    EmbeddedImagesattachmentsObj,
} from "../../utils/interfaces"

const EmbeddedImagesTable: React.FC<EmbeddedImagesattachmentsObj> = ({
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
        <div style={{ maxHeight: 490, overflow: "auto" }}>
            <Table>
                <Head>
                    <HeaderRow>
                        <HeaderCell style={{ width: "20%" }} />
                        <SortableCell
                            width="40%"
                            onClick={() => toggleSortOrder("fileName")}
                        >
                            Image name
                        </SortableCell>
                        <SortableCell
                            width="30%"
                            style={{ float: "right" }}
                            onClick={() => toggleSortOrder("timestamp")}
                        >
                            Date
                        </SortableCell>
                        <HeaderCell style={{ width: "10%" }} />
                    </HeaderRow>
                </Head>
                <Body>
                    {sortedAttachments.map(
                        (
                            attachment: CollectedEmbeddedImages,
                            index: number,
                        ) => (
                            <Row key={index}>
                                <Cell style={{ width: "20%" }}>
                                    <img
                                        src={attachment.contentUrl}
                                        alt={
                                            attachment.fileName ||
                                            "Embedded image"
                                        }
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                    />
                                </Cell>
                                <Cell
                                    isTruncated
                                    style={{
                                        width: "40%",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {attachment.fileName}
                                </Cell>
                                <Cell
                                    style={{
                                        width: "30%",
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
                                        fileType="embeddedImage"
                                    />
                                </Cell>
                            </Row>
                        ),
                    )}
                </Body>
            </Table>
        </div>
    )
}

export default EmbeddedImagesTable
