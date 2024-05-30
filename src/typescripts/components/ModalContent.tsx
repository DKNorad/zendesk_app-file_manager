import React, { CSSProperties } from "react"

interface ModalContentProps {
    data: string
    fileType: string
}

const ModalContent: React.FC<ModalContentProps> = ({ data, fileType }) => {
    const styles: CSSProperties = {
        fontSize: "15px",
        letterSpacing: "0.3px",
    }

    const imgStyles: CSSProperties = {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        cursor: "pointer",
    }

    return fileType === "text" ? (
        <pre style={styles}>{data}</pre>
    ) : (
        <center>
            <a href={data} target="_blank" rel="noopener noreferrer">
                <img src={data} style={imgStyles} />
            </a>
        </center>
    )
}

export default ModalContent
