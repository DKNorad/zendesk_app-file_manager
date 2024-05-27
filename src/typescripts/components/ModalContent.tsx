import React from "react"

interface ModalContentProps {
    data: string
}

const ModalContent: React.FC<ModalContentProps> = ({ data }) => {
    const styles = {
        fontSize: "16px",
        fontWeight: 400,
    }

    return <pre style={styles}>{data}</pre>
}

export default ModalContent
