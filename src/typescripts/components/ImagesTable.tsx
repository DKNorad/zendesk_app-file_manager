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
        useState(true)
    const [hideEmbeddedDuplicates, setHideEmbeddedDuplicates] = useState(true)

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
        <>
            <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
                <TabList>
                    <Tab item={"Attached Images"}>
                        Attached Images ({filteredAttachedImages.length})
                    </Tab>
                    <Tab item={"Embedded Images"}>
                        Embedded Images ({filteredEmbeddedImages.length})
                    </Tab>
                </TabList>
                <TabPanel item={"Attached Images"}>
                    {loadingAttachedImages ? (
                        <LoaderSkeleton items={attachedImages.length} />
                    ) : filteredAttachedImages &&
                      filteredAttachedImages.length > 0 ? (
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
                                    <Label>
                                        Hide duplicate attached images
                                    </Label>
                                </Toggle>
                            </Field>
                            <AttachedImagesTable
                                attachments={filteredAttachedImages}
                            />
                        </>
                    ) : (
                        <p>No attached images found.</p>
                    )}
                </TabPanel>
                <TabPanel item={"Embedded Images"}>
                    {loadingEmbeddedImages ? (
                        <LoaderSkeleton items={EmbeddedImages.length} />
                    ) : filteredEmbeddedImages &&
                      filteredEmbeddedImages.length > 0 ? (
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
                                    <Label>
                                        Hide duplicate embedded images
                                    </Label>
                                </Toggle>
                            </Field>
                            <EmbeddedImagesTable
                                attachments={filteredEmbeddedImages}
                            />
                        </>
                    ) : (
                        <p>No embedded images found.</p>
                    )}
                </TabPanel>
            </Tabs>
        </>
    )
}

export default ImagesTable
