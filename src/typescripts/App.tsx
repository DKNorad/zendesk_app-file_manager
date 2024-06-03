import React from "react"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import { Grid, Row, Col } from "@zendeskgarden/react-grid"
import NavTabs from "./components/NavTabs"
import { AppProps, AppState } from "./utils/interfaces"

class App extends React.Component<AppProps, AppState> {
    _client: any
    private _appData: any

    constructor(props: AppProps) {
        super(props)
        this._client = props.client
        this._appData = props.appData
        this.state = { attachments: [] }
    }

    async componentDidMount() {
        this._client.invoke("resize", { width: "100%", height: "700px" })
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
