import React from "react"

interface ModalContentProps {
    data: string
    fileType: string
}

const ModalContent: React.FC<ModalContentProps> = ({ data, fileType }) => {
    const styles = {
        fontSize: "15px",
        letterSpacing: "0.3px",
    }

    return fileType === "text" ? (
        <pre style={styles}>{data}</pre>
    ) : (
        <center>
            <img src={data} />
        </center>
    )
}

export default ModalContent
