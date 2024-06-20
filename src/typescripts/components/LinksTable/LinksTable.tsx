import React, { useState, useEffect } from "react"
import {
    Body,
    Cell,
    Head,
    HeaderRow,
    Row,
    SortableCell,
    Table,
} from "@zendeskgarden/react-tables"
import { Col, Grid, Row as GridRow } from "@zendeskgarden/react-grid"
import { LinksTableProps } from "../../utils/interfaces"
import { Tooltip } from "@zendeskgarden/react-tooltips"
import { FaSearch } from "react-icons/fa"

function LinksTable({ linksData }: LinksTableProps): React.ReactNode {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const [searchInput, setSearchInput] = useState<string>("")
    const [searchExpanded, setSearchExpanded] = useState<boolean>(false)
    const [filteredLinksData, setFilteredLinksData] = useState<string[]>([])

    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchInput(event.target.value)
    }

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            const filtered = linksData.filter((link) =>
                link.toLowerCase().includes(searchInput.toLowerCase()),
            )
            setFilteredLinksData(filtered)
        }, 500)

        return () => clearTimeout(delaySearch)
    }, [searchInput])

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

    const sortedLinks = [...filteredLinksData].sort((a, b) => {
        if (a === b) {
            return 0
        }

        if (sortOrder === "asc") {
            return a < b ? -1 : 1
        } else {
            return a > b ? -1 : 1
        }
    })

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    return (
        <>
            <Grid>
                <GridRow justifyContent="start" alignItems="center">
                    <Col textAlign="end">
                        <GridRow justifyContent="end" alignItems="center">
                            {searchExpanded && (
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search..."
                                    value={searchInput}
                                    onChange={handleSearchInputChange}
                                    onBlur={handleSearchInputBlur}
                                    onKeyDown={handleSearchInputKeyDown}
                                />
                            )}
                            <div
                                className={`search-icon ${
                                    searchExpanded ? "expanded" : ""
                                }`}
                                onClick={toggleSearch}
                            >
                                <FaSearch
                                    style={{
                                        fontSize: "18px",
                                        color: searchExpanded ? "#333" : "#888",
                                    }}
                                />
                            </div>
                        </GridRow>
                    </Col>
                </GridRow>
            </Grid>
            <Table size="small">
                <Head>
                    <HeaderRow>
                        <SortableCell
                            onClick={toggleSortOrder}
                            sort={sortOrder === "asc" ? "asc" : "desc"}
                        >
                            Link
                        </SortableCell>
                    </HeaderRow>
                </Head>
                <Body>
                    {sortedLinks.map((link: string, index) => (
                        <Row key={index} isStriped={index % 2 === 0}>
                            <Cell
                                isTruncated
                                style={{
                                    width: "45%",
                                }}
                            >
                                <Tooltip content={link}>
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {link}
                                    </a>
                                </Tooltip>
                            </Cell>
                        </Row>
                    ))}
                </Body>
            </Table>
        </>
    )
}

export default LinksTable
