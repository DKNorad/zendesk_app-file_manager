import React, { useState, useEffect } from "react"
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
import OverflowMenu from "./OverflowMenu"
import LoaderSkeleton from "./loaders/LoaderSkeleton"
import {
    documentIcon,
    formatBytes,
    formatDate,
    genericIcon,
    pdfIcon,
    zipIcon,
} from "../utils/utils"
import {
    FilesTableattachmentsObj,
    collectedAttachmens,
} from "../utils/interfaces"

function FilesTable({
    attachments,
}: FilesTableattachmentsObj): React.ReactNode {
    const [loading, setLoading] = useState<boolean>(true)

    const [sortColumn, setSortColumn] = useState<string>("fileName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    useEffect(() => {
        setLoading(false)
    }, [])

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

    if (loading) {
        return <LoaderSkeleton items={attachments.length} />
    }

    const contentTypeImages: { [key: string]: string } = {
        "text/plain": documentIcon,
        "text/x-log": documentIcon,
        "text/csv": documentIcon,
        "application/pdf": pdfIcon,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            documentIcon,
        "application/vnd.visio": genericIcon,
        "application/unknown": genericIcon,
        "application/xml-dtd": documentIcon,
        "application/zip": zipIcon,
    }

    return (
        <Table size="small">
            <Head>
                <HeaderRow>
                    <SortableCell
                        width={"45%"}
                        onClick={() => toggleSortOrder("fileName")}
                    >
                        File name
                    </SortableCell>
                    <SortableCell
                        width={"22.5%"}
                        style={{ float: "right" }}
                        onClick={() => toggleSortOrder("size")}
                    >
                        Size
                    </SortableCell>
                    <SortableCell
                        width={"22.5%"}
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
                    (attachment: collectedAttachmens, index) => (
                        <Row key={index}>
                            <Cell
                                isTruncated
                                style={{
                                    width: "45%",
                                }}
                            >
                                <img
                                    src={
                                        contentTypeImages[
                                            attachment.contentType
                                        ] || genericIcon
                                    }
                                    style={{ paddingRight: "5px" }}
                                />
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
                                    verticalAlign: "middle",
                                }}
                            >
                                <OverflowMenu
                                    attachment={attachment}
                                    fileType="text"
                                />
                            </Cell>
                        </Row>
                    ),
                )}
            </Body>
        </Table>
    )
}

export default FilesTable
