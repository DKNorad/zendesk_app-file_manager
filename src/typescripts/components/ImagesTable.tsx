import React, { useState } from "react"
import { collectedAttachmens, CollectedEmbeddedImages } from "./NavTabs"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import EmbeddedImagesTable from "./imagesTable/EmbeddedImages"
import AttachedImagesTable from "./imagesTable/AttachedImages"

const ImagesTable: React.FC<attachmentsObj> = ({
    attachedImages,
    EmbeddedImages,
}) => {
    const [selectedTab, setSelectedTab] = useState("Attached Images")

    return (
        <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
            <TabList>
                <Tab item={"Attached Images"}>
                    Attached Images ({attachedImages.length})
                </Tab>
                <Tab item={"Embedded Images"}>
                    Embedded Images ({EmbeddedImages.length})
                </Tab>
            </TabList>
            <TabPanel item={"Attached Images"}>
                {attachedImages && attachedImages.length > 0 ? (
                    <AttachedImagesTable attachments={attachedImages} />
                ) : (
                    <p>No attached images found.</p>
                )}
            </TabPanel>
            <TabPanel item={"Embedded Images"}>
                {EmbeddedImages && EmbeddedImages.length > 0 ? (
                    <EmbeddedImagesTable attachments={EmbeddedImages} />
                ) : (
                    <p>No embedded images found.</p>
                )}
            </TabPanel>
        </Tabs>
    )
}

export default ImagesTable
