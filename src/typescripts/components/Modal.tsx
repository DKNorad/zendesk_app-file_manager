import React, { useEffect, useState } from "react"

const Modal: React.FC = () => {
    const [blobText, setBlobText] = useState<string>("")
    const contentUrl = parseParams(window.location.hash)

    useEffect(() => {
        const readFile = async () => {
            try {
                const response = await fetch(contentUrl)
                if (!response.ok) {
                    throw new Error(
                        `Network response was not ok: ${response.statusText}`,
                    )
                }
                const blob = await response.blob()
                const text = await blob.text()
                setBlobText(text)
            } catch (error) {
                console.error("Failed to open the file:", error)
            }
        }

        readFile()
    }, [contentUrl])

    function parseParams(paramString: string): string {
        return paramString.slice(6)
    }

    return <div>{blobText}</div>
}

export default Modal
