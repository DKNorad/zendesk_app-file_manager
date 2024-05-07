import React from "react"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import { Grid, Row, Col } from "@zendeskgarden/react-grid"
import { resizeContainer, escapeSpecialChars as escape } from "./lib/helpers"
import NavTabs from "./components/NavTabs"

const MAX_HEIGHT = 1000

interface Props {
    client: any
    appData: any
}

interface State {
    attachments: { filename: string; contentUrl: string }[]
}

class App extends React.Component<Props, State> {
    _client: any
    private _appData: any

    constructor(props: Props) {
        super(props)
        this._client = props.client
        this._appData = props.appData
        this.state = { attachments: [] }
    }

    async componentDidMount() {
        // await this.fetchAttachments()
        await this.resizeContainer()
    }

    async fetchAttachments() {
        try {
            const data = await this._client.get("ticket.conversation")
            const attachments = data["ticket.conversation"].flatMap(
                (attachmentObj: { attachments: any }) =>
                    attachmentObj.attachments || [],
            )
            this.setState({ attachments })
        } catch (error) {
            console.error("Error fetching attachments:", error)
        }
    }

    async resizeContainer() {
        try {
            await resizeContainer(this._client, MAX_HEIGHT)
        } catch (error) {
            console.error("Error resizing container:", error)
        }
    }

    render() {
        return (
            <ThemeProvider theme={{ ...DEFAULT_THEME }}>
                <Grid>
                    <Row>
                        <Col>
                            <NavTabs />
                        </Col>
                    </Row>
                </Grid>
            </ThemeProvider>
        )
    }

    /**
     * Handle error
     * @param {Object} error error object
     */
    _handleError(error: any): void {
        console.log("An error is handled here: ", error.message)
    }
}

export default App
