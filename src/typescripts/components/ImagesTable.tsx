import React, { useState, useEffect } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import EmbeddedImagesTable from "./imagesTable/EmbeddedImages"
import AttachedImagesTable from "./imagesTable/AttachedImages"
import { ImagesTableattachmentsObj } from "../utils/interfaces"
import { getUniqueImageUrls } from "../utils/utils"
import { Field, Label, Toggle } from "@zendeskgarden/react-forms"
import LoaderSkeleton from "./loaders/LoaderSkeleton"

const ImagesTable: React.FC<ImagesTableattachmentsObj> = ({
    attachedImages,
    EmbeddedImages,
}) => {
    const [selectedTab, setSelectedTab] = useState("Attached Images")

    const [hideAttachmentsDuplicates, setHideAttachmentsDuplicates] =
        useState(false)
    const [hideEmbeddedDuplicates, setHideEmbeddedDuplicates] = useState(false)

    const [uniqueAttachedImages, setUniqueAttachedImages] =
        useState(attachedImages)
    const [uniqueEmbeddedImages, setUniqueEmbeddedImages] =
        useState(EmbeddedImages)

    const [loadingAttachedImages, setLoadingAttachedImages] = useState(true)
    const [loadingEmbeddedImages, setLoadingEmbeddedImages] = useState(true)

    useEffect(() => {
        const filterImages = async () => {
            const uniqueAttachedImagesUrls = await getUniqueImageUrls(
                attachedImages.map((img) => img.contentUrl),
            )

            const uniqueEmbeddedImagesUrls = await getUniqueImageUrls(
                EmbeddedImages.map((img) => img.contentUrl),
            )

            setUniqueAttachedImages(
                attachedImages.filter((img) =>
                    uniqueAttachedImagesUrls.includes(img.contentUrl),
                ),
            )
            setUniqueEmbeddedImages(
                EmbeddedImages.filter((img) =>
                    uniqueEmbeddedImagesUrls.includes(img.contentUrl),
                ),
            )

            setLoadingAttachedImages(false)
            setLoadingEmbeddedImages(false)
        }

        filterImages()
    }, [attachedImages, EmbeddedImages])

    const filteredAttachedImages = hideAttachmentsDuplicates
        ? uniqueAttachedImages
        : attachedImages

    const filteredEmbeddedImages = hideEmbeddedDuplicates
        ? uniqueEmbeddedImages
        : EmbeddedImages

    return (
        <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
            <TabList>
                <Tab
                    item={"Attached Images"}
                    disabled={filteredAttachedImages.length === 0}
                >
                    Attached ({filteredAttachedImages.length})
                </Tab>
                <Tab
                    item={"Embedded Images"}
                    disabled={filteredEmbeddedImages.length === 0}
                >
                    Embedded ({filteredEmbeddedImages.length})
                </Tab>
            </TabList>

            {filteredAttachedImages.length > 0 && (
                <TabPanel item={"Attached Images"}>
                    {loadingAttachedImages ? (
                        <LoaderSkeleton items={attachedImages.length} />
                    ) : (
                        <>
                            <Field>
                                <Toggle
                                    checked={hideAttachmentsDuplicates}
                                    onChange={() =>
                                        setHideAttachmentsDuplicates(
                                            !hideAttachmentsDuplicates,
                                        )
                                    }
                                >
                                    <Label>Hide duplicates</Label>
                                </Toggle>
                            </Field>
                            <AttachedImagesTable
                                attachments={filteredAttachedImages}
                            />
                        </>
                    )}
                </TabPanel>
            )}

            {filteredEmbeddedImages.length > 0 && (
                <TabPanel item={"Embedded Images"}>
                    {loadingEmbeddedImages ? (
                        <LoaderSkeleton items={EmbeddedImages.length} />
                    ) : (
                        <>
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
                            <EmbeddedImagesTable
                                attachments={filteredEmbeddedImages}
                            />
                        </>
                    )}
                </TabPanel>
            )}
        </Tabs>
    )
}

export default ImagesTable
