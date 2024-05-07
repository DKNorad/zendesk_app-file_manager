import React, { useEffect, useState } from "react"
import { Tabs, TabList, Tab, TabPanel } from "@zendeskgarden/react-tabs"
import FilesTable, { FilesObject } from "./FilesTable"

declare const ZAFClient: any

const NavTabs = () => {
    const [selectedTab, setSelectedTab] = useState("Files")
    const [attachments, setAttachments] = useState<FilesObject[]>([])

    useEffect(() => {
        const zafClient = ZAFClient.init()
        const fetchAttachments = async () => {
            try {
                const data = await zafClient.get("ticket.conversation")
                const fetchedAttachments = data["ticket.conversation"].flatMap(
                    (attachmentObj: { attachments: any }) =>
                        attachmentObj.attachments || [],
                )
                setAttachments(fetchedAttachments)
            } catch (error) {
                console.error("Error fetching attachments:", error)
            }
        }

        fetchAttachments()
    }, [])

    return (
        <div>
            <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
                <TabList>
                    <Tab item="Files">Files</Tab>
                    <Tab item="Images">Images</Tab>
                </TabList>
                <TabPanel item="Files">
                    <FilesTable files={attachments} />
                </TabPanel>
                <TabPanel item="Images">
                    The sugar maple is one of America’s most-loved trees. In
                    fact, more states have claimed it as their state tree than
                    any other single species—for New York, West Virginia,
                    Wisconsin, and Vermont, the maple tree stands alone.
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default NavTabs
