import React from "react"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import { Grid, Row, Col } from "@zendeskgarden/react-grid"

interface Props {
    client: any
    appData: any
}

class Modal extends React.Component<Props> {
    _client: any
    private _appData: any

    constructor(props: Props) {
        super(props)
        this._client = props.client
        this._appData = props.appData
        this.state = { attachments: [] }
    }

    async componentDidMount() {
        this._client.invoke("resize", { width: "100%", height: "700px" })
    }

    render() {
        return (
            <ThemeProvider theme={{ ...DEFAULT_THEME }}>
                123444444444
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

export default Modal
