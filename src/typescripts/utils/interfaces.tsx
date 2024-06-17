/* eslint-disable @typescript-eslint/no-explicit-any */
// App
export interface AppProps {
    client: any
    appData: any
}

export interface AppState {
    attachments: { filename: string; contentUrl: string }[]
}

// ImagesTable
export interface ImagesTableAttachmentsObj {
    attachedImages: Array<collectedAttachmens>
    embeddedImages: Array<CollectedEmbeddedImages>
}

// AttachedImages
export interface AttachedImagesattachmentsObj {
    attachments: Array<collectedAttachmens>
}

// EmbeddedImages
export interface EmbeddedImagesattachmentsObj {
    attachments: Array<CollectedEmbeddedImages>
}

// NavTabs
// Defining the interfaces for the objects returned by the API.
export interface commentsObject {
    comments: commentObject[]
    count: number
    next_page: string | null
    previous_page: string | null
}
export interface commentObject {
    attachments: attachment[]
    audit_id: number
    author_id: number
    body: string
    created_at: string
    html_body: string
    id: number
    metadata: object
    plain_body: string
    public: boolean
    type: string
    via: {
        channel: string
        source: {
            from: any
            to: { name: string; address: string; rel: string }
        }
    }
}

export interface thumbnail {
    content_type: string
    content_url: string
    deleted: boolean
    file_name: string
    height: number | null
    width: number | null
    id: number
    inline: boolean
    malware_access_verride: boolean
    malware_scan_results: string
    mapped_content_url: string
    size: number
    url: string
}

export interface attachment {
    content_type: string
    content_url: string
    deleted: boolean
    file_name: string
    height: number | null
    width: number | null
    id: number
    inline: boolean
    malware_access_verride: boolean
    malware_scan_results: string
    mapped_content_url: string
    size: number
    thumbnails: Array<null | thumbnail>
    url: string
}

export interface collectedAttachmens {
    contentType: string
    contentUrl: string
    fileName: string
    height: number | null
    width: number | null
    size: number
    timestamp: string
    messageID: number
    ticketID: number
    attachmentID: number
    thumbnails: Array<null | thumbnail>
    [key: string]: any
}

export interface CollectedEmbeddedImages {
    contentUrl: string
    fileName: string
    timestamp: string
    [key: string]: any
}

// Modal
export interface ModalContentProps {
    data?: { url: string; fileName: string }
    fileType?: string
}

// OverflowMenu
export interface OverflowMenuProps {
    attachment: collectedAttachmens | CollectedEmbeddedImages
    fileType: string
}

export interface DeletionError {
    error: string
    description: string
}

// ConfirmDeleteModal
export interface ConfirmDeleteModalProps {
    visible: boolean
    onClose: () => void
    onDelete: () => void
    fileName: string
}

//FilesTable
export interface FilesTableattachmentsObj {
    attachments: Array<collectedAttachmens>
}
