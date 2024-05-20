import React, { useEffect, useState } from "react"

const Modal: React.FC = () => {
    const [blobObjectUrl, setBlobObjectUrl] = useState<string>("")
    const contentUrl = parseParams(window.location.hash)

    useEffect(() => {
        const readFile = async () => {
            try {
                console.log(contentUrl)
                setBlobObjectUrl(contentUrl)
            } catch (error) {
                console.error("Failed to open the file:", error)
            }
        }

        readFile()
    }, [contentUrl])

    function parseParams(paramString: string): string {
        return paramString.slice(6)
    }

    return (
        <div style={{ height: "99vh", width: "98vw" }}>
            <iframe
                style={{ height: "100%", width: "100%", border: "none" }}
                src={blobObjectUrl}
            ></iframe>
        </div>
    )
}

export default Modal
