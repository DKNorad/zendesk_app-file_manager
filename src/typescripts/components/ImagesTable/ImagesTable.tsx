import React, { useState, useEffect } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import EmbeddedImagesTable from "./EmbeddedImages"
import AttachedImagesTable from "./AttachedImages"
import {
    CollectedEmbeddedImages,
    ImagesTableAttachmentsObj,
    collectedAttachmens,
} from "../../utils/interfaces"
import { getUniqueImageUrls } from "../../utils/utils"
import { Field, Label, Toggle } from "@zendeskgarden/react-forms"
import LoaderSkeleton from "../Loaders/LoaderSkeleton"
import { FaSearch } from "react-icons/fa"
import "./ImagesTable.css"
import { Col, Grid, Row } from "@zendeskgarden/react-grid"

const ImagesTable: React.FC<ImagesTableAttachmentsObj> = ({
    attachedImages = [],
    embeddedImages = [],
}) => {
    const [loadingAttachedImages, setLoadingAttachedImages] = useState(true)
    const [loadingEmbeddedImages, setLoadingEmbeddedImages] = useState(true)

    const [selectedTab, setSelectedTab] = useState("Attached Images")

    const [hideAttachmentsDuplicates, setHideAttachmentsDuplicates] =
        useState(false)
    const [hideEmbeddedDuplicates, setHideEmbeddedDuplicates] = useState(false)

    const [searchInput, setSearchInput] = useState<string>("")
    const [searchExpanded, setSearchExpanded] = useState<boolean>(false)

    const [uniqueAttachedImages, setUniqueAttachedImages] = useState<
        collectedAttachmens[]
    >([])
    const [uniqueEmbeddedImages, setUniqueEmbeddedImages] = useState<
        CollectedEmbeddedImages[]
    >([])

    const [filteredAttachedImages, setFilteredAttachedImages] =
        useState(attachedImages)
    const [filteredEmbeddedImages, setFilteredEmbeddedImages] =
        useState(embeddedImages)

    useEffect(() => {
        const filterImages = async () => {
            const uniqueAttachedImagesUrls = await getUniqueImageUrls(
                attachedImages.map((img) => img.contentUrl),
            )
            const uniqueEmbeddedImagesUrls = await getUniqueImageUrls(
                embeddedImages.map((img) => img.contentUrl),
            )

            setUniqueAttachedImages(
                attachedImages.filter((img) =>
                    uniqueAttachedImagesUrls.includes(img.contentUrl),
                ),
            )
            setUniqueEmbeddedImages(
                embeddedImages.filter((img) =>
                    uniqueEmbeddedImagesUrls.includes(img.contentUrl),
                ),
            )

            setLoadingAttachedImages(false)
            setLoadingEmbeddedImages(false)
        }

        filterImages()
    }, [attachedImages, embeddedImages])

    useEffect(() => {
        if (selectedTab !== "Attached Images") {
            return
        }

        const filterAttachedImages = () => {
            const imagesToWorkWith = hideAttachmentsDuplicates
                ? uniqueAttachedImages
                : attachedImages

            if (!imagesToWorkWith) return

            const filtered = imagesToWorkWith.filter((attachment) =>
                attachment.fileName
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()),
            )
            setFilteredAttachedImages(filtered)
        }

        filterAttachedImages()
    }, [hideAttachmentsDuplicates, searchInput])

    useEffect(() => {
        if (selectedTab !== "Embedded Images") {
            return
        }

        const filterEmbeddedImages = () => {
            const imagesToWorkWith = hideEmbeddedDuplicates
                ? uniqueEmbeddedImages
                : embeddedImages

            if (!imagesToWorkWith) return

            const filtered = imagesToWorkWith.filter((attachment) =>
                attachment.fileName
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()),
            )
            setFilteredEmbeddedImages(filtered)
        }

        filterEmbeddedImages()
    }, [hideEmbeddedDuplicates, searchInput])

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            let imagesToWorkWith
            if (hideAttachmentsDuplicates) {
                imagesToWorkWith = uniqueAttachedImages
            } else {
                imagesToWorkWith = attachedImages
            }

            const filtered = imagesToWorkWith.filter((attachment) =>
                attachment.fileName
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()),
            )
            setFilteredAttachedImages(filtered)
        }, 500)

        return () => clearTimeout(delaySearch)
    }, [attachedImages, searchInput])

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
        <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
            <TabList>
                <Tab
                    item={"Attached Images"}
                    disabled={attachedImages.length === 0}
                >
                    Attached ({filteredAttachedImages.length})
                </Tab>
                <Tab
                    item={"Embedded Images"}
                    disabled={embeddedImages.length === 0}
                >
                    Embedded ({filteredEmbeddedImages.length})
                </Tab>
            </TabList>

            {attachedImages.length > 0 && (
                <TabPanel item={"Attached Images"}>
                    {loadingAttachedImages ? (
                        <LoaderSkeleton items={attachedImages.length} />
                    ) : (
                        <Grid>
                            <Row justifyContent="start" alignItems="center">
                                <Col size={4}>
                                    <Field>
                                        <Toggle
                                            isCompact
                                            checked={hideAttachmentsDuplicates}
                                            onChange={() =>
                                                setHideAttachmentsDuplicates(
                                                    !hideAttachmentsDuplicates,
                                                )
                                            }
                                        >
                                            <Label isRegular>
                                                Hide duplicates
                                            </Label>
                                        </Toggle>
                                    </Field>
                                </Col>
                                <Col textAlign="end">
                                    <Row
                                        justifyContent="end"
                                        alignItems="center"
                                    >
                                        {searchExpanded && (
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Search..."
                                                value={searchInput}
                                                onChange={
                                                    handleSearchInputChange
                                                }
                                                onBlur={handleSearchInputBlur}
                                                onKeyDown={
                                                    handleSearchInputKeyDown
                                                }
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
                                                    color: searchExpanded
                                                        ? "#333"
                                                        : "#888",
                                                }}
                                            />
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <AttachedImagesTable
                                attachments={filteredAttachedImages}
                            />
                        </Grid>
                    )}
                </TabPanel>
            )}

            {embeddedImages.length > 0 && (
                <TabPanel item={"Embedded Images"}>
                    {loadingEmbeddedImages ? (
                        <LoaderSkeleton items={embeddedImages.length} />
                    ) : (
                        <Grid>
                            <Row justifyContent="start" alignItems="center">
                                <Col size={4}>
                                    <Field>
                                        <Toggle
                                            checked={hideEmbeddedDuplicates}
                                            onChange={() =>
                                                setHideEmbeddedDuplicates(
                                                    !hideEmbeddedDuplicates,
                                                )
                                            }
                                        >
                                            <Label>Hide duplicates</Label>
                                        </Toggle>
                                    </Field>
                                </Col>
                                <Col textAlign="end">
                                    <Row
                                        justifyContent="end"
                                        alignItems="center"
                                    >
                                        {searchExpanded && (
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Search..."
                                                value={searchInput}
                                                onChange={
                                                    handleSearchInputChange
                                                }
                                                onBlur={handleSearchInputBlur}
                                                onKeyDown={
                                                    handleSearchInputKeyDown
                                                }
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
                                                    color: searchExpanded
                                                        ? "#333"
                                                        : "#888",
                                                }}
                                            />
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <EmbeddedImagesTable
                                    attachments={filteredEmbeddedImages}
                                />
                            </Row>
                        </Grid>
                    )}
                </TabPanel>
            )}
        </Tabs>
    )
}

export default ImagesTable
