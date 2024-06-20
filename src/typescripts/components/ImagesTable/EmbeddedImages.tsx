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
import { formatDate } from "../../utils/utils"
import {
    CollectedEmbeddedImages,
    EmbeddedImagesattachmentsObj,
} from "../../utils/interfaces"
import "./ImagesTable.css"
import { Tooltip } from "@zendeskgarden/react-tooltips"

const EmbeddedImagesTable: React.FC<EmbeddedImagesattachmentsObj> = ({
    attachments,
}) => {
    const [widthStep, setWidthStep] = useState(0)
    const [sortColumn, setSortColumn] = useState<string>("imageName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [popupImage, setPopupImage] = useState<string | null>(null)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 400) {
                setWidthStep(0)
            } else if (window.innerWidth <= 400) {
                setWidthStep(1)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [window.innerWidth])

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
                            width="40%"
                            onClick={() => toggleSortOrder("fileName")}
                            sort={sortOrder === "asc" ? "asc" : "desc"}
                        >
                            Image name
                        </SortableCell>
                        {widthStep < 1 && (
                            <SortableCell
                                width="30%"
                                style={{ float: "right" }}
                                onClick={() => toggleSortOrder("timestamp")}
                                sort={sortOrder === "asc" ? "asc" : "desc"}
                            >
                                Date
                            </SortableCell>
                        )}
                        <HeaderCell style={{ width: "10%" }} />
                    </HeaderRow>
                </Head>
                <Body>
                    {sortedAttachments.length > 0 ? (
                        sortedAttachments.map(
                            (
                                attachment: CollectedEmbeddedImages,
                                index: number,
                            ) => (
                                <Row
                                    key={index}
                                    style={{ height: "85px" }}
                                    isStriped={index % 2 === 0}
                                >
                                    <Cell className="cell-with-image">
                                        <img
                                            src={attachment.contentUrl}
                                            alt={
                                                attachment.fileName ||
                                                "Embedded image"
                                            }
                                            onClick={() =>
                                                handleClick(
                                                    attachment.contentUrl,
                                                )
                                            }
                                        />
                                    </Cell>
                                    <Cell
                                        isTruncated
                                        style={{
                                            width: "40%",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        <Tooltip content={attachment.fileName}>
                                            <span>{attachment.fileName}</span>
                                        </Tooltip>
                                    </Cell>
                                    {widthStep < 1 && (
                                        <Cell
                                            style={{
                                                width: "30%",
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
                                            fileType="embeddedImage"
                                        />
                                    </Cell>
                                </Row>
                            ),
                        )
                    ) : (
                        <Row>
                            <Cell colSpan={4} style={{ textAlign: "center" }}>
                                No results found.
                            </Cell>
                        </Row>
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

export default EmbeddedImagesTable
