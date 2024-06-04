let zendeskClient: any

export const getZendeskClient = () => {
    if (!zendeskClient) {
        zendeskClient = (window as any).ZAFClient.init()
    }
    return zendeskClient
}

// Expose globally to use in modal.html
;(window as any).getZendeskClient = getZendeskClient

export const getSubDomain = async () => {
    const zafClient = getZendeskClient()
    const context = await zafClient.context()
    return String(context.account.subdomain)
}
