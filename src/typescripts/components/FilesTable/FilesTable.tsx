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
import { Tooltip } from "@zendeskgarden/react-tooltips"
import OverflowMenu from "../OverflowMenu"
import LoaderSkeleton from "../loaders/LoaderSkeleton"
import {
    documentIcon,
    formatBytes,
    formatDate,
    genericIcon,
    pdfIcon,
    zipIcon,
} from "../../utils/utils"
import {
    FilesTableattachmentsObj,
    collectedAttachmens,
} from "../../utils/interfaces"
import { FaSearch } from "react-icons/fa"

function FilesTable({
    attachments,
}: FilesTableattachmentsObj): React.ReactNode {
    const [loading, setLoading] = useState<boolean>(true)

    const [sortColumn, setSortColumn] = useState<string>("fileName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const [searchInput, setSearchInput] = useState<string>("")
    const [searchExpanded, setSearchExpanded] = useState<boolean>(false)
    const [filteredAttachments, setFilteredAttachments] = useState<
        collectedAttachmens[]
    >([])

    useEffect(() => {
        setLoading(false)
    }, [])

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
        <div className="files-table-container">
            <div
                className="search-container"
                style={{ display: "flex", alignItems: "center" }}
            >
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
                            <Row key={index} isStriped={index % 2 === 0}>
                                <Cell
                                    isTruncated
                                    style={{
                                        width: "45%",
                                    }}
                                >
                                    {" "}
                                    <img
                                        src={
                                            contentTypeImages[
                                                attachment.contentType
                                            ] || genericIcon
                                        }
                                        style={{ paddingRight: "5px" }}
                                    />
                                    <Tooltip content={attachment.fileName}>
                                        <span>{attachment.fileName}</span>
                                    </Tooltip>
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
        </div>
    )
}

export default FilesTable
