import { ThemeProvider } from "@zendeskgarden/react-theming"
import React, { CSSProperties } from "react"
import { ModalContentProps } from "../utils/interfaces"

const Modal: React.FC<ModalContentProps> = ({ data, fileType }) => {
    const imgContainerStyles: CSSProperties = {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    }

    const imgStyles: CSSProperties = {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        cursor: "pointer",
    }

    return (
        <ThemeProvider>
            <>
                {fileType === "text" && (
                    <>
                        <h2>{data?.fileName}</h2>
                        <hr />
                        <pre>{data?.url}</pre>
                    </>
                )}
                {fileType === "image" && (
                    <div style={imgContainerStyles}>
                        <a
                            href={data?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={data?.url}
                                style={imgStyles}
                                alt="Image"
                            />
                        </a>
                    </div>
                )}
            </>
        </ThemeProvider>
    )
}

export default Modal
