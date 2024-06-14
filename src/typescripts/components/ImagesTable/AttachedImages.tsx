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
import { formatBytes, formatDate, missingImage } from "../../utils/utils"
import {
    AttachedImagesattachmentsObj,
    collectedAttachmens,
} from "../../utils/interfaces"
import { FaSearch } from "react-icons/fa"

const AttachedImagesTable: React.FC<AttachedImagesattachmentsObj> = ({
    attachments,
}) => {
    const [sortColumn, setSortColumn] = useState<string>("imageName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [popupImage, setPopupImage] = useState<string | null>(null)

    const [searchInput, setSearchInput] = useState<string>("")
    const [searchExpanded, setSearchExpanded] = useState<boolean>(false)
    const [filteredAttachments, setFilteredAttachments] = useState<
        collectedAttachmens[]
    >([])

    if (attachments.length === 0) {
        return null
    }

    // Sort attachments based on the selected column and order
    const sortedAttachments = [...filteredAttachments].sort((a, b) => {
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

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            const filtered = attachments.filter((attachment) =>
                attachment.fileName
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()),
            )
            setFilteredAttachments(filtered)
        }, 500)

        return () => clearTimeout(delaySearch)
    }, [attachments, searchInput])

    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchInput(event.target.value)
    }

    const toggleSearch = () => {
        setSearchExpanded(!searchExpanded)
    }

    const handleSearchInputBlur = () => {
        setSearchExpanded(searchInput !== "")
    }

    const handleSearchInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Escape") {
            setSearchExpanded(searchInput !== "")
        }
    }

    return (
        <>
            <style>
                {`
                    .cell-with-image {
                        position: relative;
                        width: 20%;
                        height: 85px;
                        cursor: zoom-in;
                    }

                    .cell-with-image img {
                        max-width: 60%;
                        height: auto;
                    }

                    .image-popup-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 999;
                    }

                    .image-popup {
                        position: relative;
                        max-width: 80%;
                        max-height: 80%;
                        background-color: #fff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        padding: 10px;
                        overflow: hidden;
                    }

                    .image-popup img {
                        max-width: 100%;
                        max-height: 100%;
                        display: block;
                    }

                    .close-button {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: rgba(0, 0, 0, 0.5);
                        border: none;
                        color: #fff;
                        padding: 5px 10px;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 50%;
                    }
                `}
            </style>
            <div className="search-container" style={{ alignItems: "left" }}>
                <div
                    className={`search-icon ${
                        searchExpanded ? "expanded" : ""
                    }`}
                    onClick={toggleSearch}
                    style={{
                        padding: "8px",
                        transition: "all 0.3s ease-in-out",
                        cursor: "pointer",
                    }}
                >
                    <FaSearch
                        style={{
                            fontSize: "18px",
                            color: searchExpanded ? "#333" : "#888",
                        }}
                    />
                </div>
                {searchExpanded && (
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        onBlur={handleSearchInputBlur}
                        onKeyDown={handleSearchInputKeyDown}
                        style={{
                            borderRadius: "20px",
                            padding: "8px 12px",
                            width: "200px",
                            overflow: "hidden",
                            border: "1px solid #ccc",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease-in-out",
                            marginLeft: "8px",
                        }}
                    />
                )}
            </div>
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
                            <Row
                                key={index}
                                style={{ height: "85px" }}
                                isStriped={index % 2 === 0}
                            >
                                <Cell
                                    className="cell-with-image"
                                    onClick={() =>
                                        handleClick(
                                            attachment.contentUrl
                                                ? attachment.contentUrl
                                                : missingImage,
                                        )
                                    }
                                >
                                    {attachment.thumbnails &&
                                    attachment.thumbnails[0] ? (
                                        <img
                                            src={
                                                attachment.thumbnails[0]
                                                    .content_url
                                            }
                                            alt={attachment.fileName}
                                        />
                                    ) : (
                                        <img
                                            src={missingImage}
                                            alt={"No thumbnail"}
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