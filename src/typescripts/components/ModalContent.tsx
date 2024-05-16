// src/components/ModalContent.tsx
import React from "react"

interface ModalContentProps {
    data: {
        contentType: string
        contentUrl: string
        fileName: string
        size: number
        timestamp: string
    }
}

const ModalContent: React.FC<ModalContentProps> = ({ data }) => {
    return (
        <div>
            <h2>{data.fileName}</h2>
            <p>Content Type: {data.contentType}</p>
            <p>Size: {data.size} bytes</p>
            <p>Timestamp: {data.timestamp}</p>
            {data.contentUrl && (
                <a
                    href={data.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View File
                </a>
            )}
        </div>
    )
}

export default ModalContent
