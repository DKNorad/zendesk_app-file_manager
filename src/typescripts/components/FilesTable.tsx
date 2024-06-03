import React, { useState, useEffect } from "react"
import {
    Body,
    Cell,
    Head,
    HeaderCell,
    HeaderRow,
    Row,
    Table,
} from "@zendeskgarden/react-tables"
import OverflowMenu from "./OverflowMenu"
import LoaderSkeleton from "./loaders/LoaderSkeleton"
import { formatBytes, formatDate } from "../utils/utils"
import {
    FilesTableattachmentsObj,
    collectedAttachmens,
} from "../utils/interfaces"

function FilesTable({
    attachments,
}: FilesTableattachmentsObj): React.ReactNode {
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    if (attachments.length === 0) {
        return null
    }

    if (loading) {
        return <LoaderSkeleton items={attachments.length} />
    }

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
                {attachments.map(
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
