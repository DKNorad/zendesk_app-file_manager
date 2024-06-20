import React, { useEffect, useState } from "react"
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
import { formatBytes, formatDate } from "../../utils/utils"
import {
    AttachedImagesattachmentsObj,
    collectedAttachmens,
} from "../../utils/interfaces"
import "./ImagesTable.css"
import { Tooltip } from "@zendeskgarden/react-tooltips"
import imageIcon from "/src/images/file_types/icons8-image-file-80.png"

const AttachedImagesTable: React.FC<AttachedImagesattachmentsObj> = ({
    attachments,
}) => {
    const [widthStep, setWidthStep] = useState(0)
    const [sortColumn, setSortColumn] = useState<string>("imageName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [popupImage, setPopupImage] = useState<string | null>(null)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 760) {
                setWidthStep(0)
            } else if (window.innerWidth <= 560) {
                setWidthStep(2)
            } else if (window.innerWidth <= 760) {
                setWidthStep(1)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [window.innerWidth])

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

    const handleClick = (imageUrl: string) => {
        setPopupImage(imageUrl)
    }

    const handlePopupClose = () => {
        setPopupImage(null)
    }

    return (
        <>
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
                        {widthStep < 2 && (
                            <SortableCell
                                width={"20%"}
                                style={{ float: "right" }}
                                onClick={() => toggleSortOrder("size")}
                            >
                                Size
                            </SortableCell>
                        )}
                        {widthStep < 1 && (
                            <SortableCell
                                width={"20%"}
                                style={{ float: "right" }}
                                onClick={() => toggleSortOrder("timestamp")}
                            >
                                Date
                            </SortableCell>
                        )}
                        <HeaderCell width={"10%"} />
                    </HeaderRow>
                </Head>
                <Body>
                    {sortedAttachments.map(
                        (attachment: collectedAttachmens, index: number) => (
                            <Row
                                key={index}
                                style={{ height: "85px" }}
                                isStriped={index % 2 === 0}
                            >
                                <Cell className="cell-with-image">
                                    {attachment.thumbnails &&
                                    attachment.thumbnails[0] ? (
                                        <img
                                            src={
                                                attachment.thumbnails[0]
                                                    .content_url
                                            }
                                            alt={attachment.fileName}
                                            onClick={() =>
                                                handleClick(
                                                    attachment.contentUrl
                                                        ? attachment.contentUrl
                                                        : imageIcon,
                                                )
                                            }
                                        />
                                    ) : (
                                        <img
                                            src={imageIcon}
                                            alt={"No thumbnail"}
                                            onClick={() =>
                                                handleClick(
                                                    attachment.contentUrl
                                                        ? attachment.contentUrl
                                                        : imageIcon,
                                                )
                                            }
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
                                    <Tooltip content={attachment.fileName}>
                                        <span>{attachment.fileName}</span>
                                    </Tooltip>
                                </Cell>
                                {widthStep < 2 && (
                                    <Cell
                                        style={{
                                            width: "20%",
                                            textAlign: "right",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {formatBytes(attachment.size)}
                                    </Cell>
                                )}
                                {widthStep < 1 && (
                                    <Cell
                                        style={{
                                            width: "20%",
                                            textAlign: "right",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {formatDate(attachment.timestamp)}
                                    </Cell>
                                )}
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
                        ),
                    )}
                </Body>
            </Table>
            {popupImage && (
                <div className="image-popup-overlay" onClick={handlePopupClose}>
                    <div
                        className="image-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-button"
                            onClick={handlePopupClose}
                        >
                            &times;
                        </button>
                        <img src={popupImage} alt="Popup" />
                    </div>
                </div>
            )}
        </>
    )
}

export default AttachedImagesTable
