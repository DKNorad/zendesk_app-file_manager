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
import OverflowMenu from "../OverflowMenu"
import { formatDate } from "../../utils/utils"
import {
    CollectedEmbeddedImages,
    EmbeddedImagesattachmentsObj,
} from "../../utils/interfaces"

const EmbeddedImagesTable: React.FC<EmbeddedImagesattachmentsObj> = ({
    attachments,
}) => {
    if (attachments.length === 0) {
        return null
    }

    return (
        <Table>
            <Head>
                <HeaderRow>
                    <HeaderCell style={{ width: "20%" }} />
                    <HeaderCell style={{ width: "40%" }}>Image name</HeaderCell>
                    <HeaderCell style={{ width: "30%", textAlign: "center" }}>
                        Date
                    </HeaderCell>
                    <HeaderCell style={{ width: "10%" }} />
                </HeaderRow>
            </Head>
            <Body>
                {attachments.map(
                    (attachment: CollectedEmbeddedImages, index: number) => (
                        <Row key={index}>
                            <Cell style={{ width: "20%" }}>
                                <img
                                    src={attachment.contentUrl}
                                    alt={
                                        attachment.fileName || "Embedded image"
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
    )
}

export default EmbeddedImagesTable
