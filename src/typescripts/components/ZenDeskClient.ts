let zendeskClient: any

export const getZendeskClient = () => {
    if (!zendeskClient) {
        zendeskClient = (window as any).ZAFClient.init()
    }
    return zendeskClient
}
