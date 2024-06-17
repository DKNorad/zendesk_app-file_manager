import React from "react"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import NavTabs from "./components/NavTabs"
import { AppProps, AppState } from "./utils/interfaces"

class App extends React.Component<AppProps, AppState> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _client: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _appData: any

    constructor(props: AppProps) {
        super(props)
        this._client = props.client
        this._appData = props.appData
    }

    async componentDidMount() {
        this._client.invoke("resize", { width: "100%", height: "668px" })
    }

    render() {
        return (
            <ThemeProvider theme={{ ...DEFAULT_THEME }}>
                <NavTabs />
            </ThemeProvider>
        )
    }

    /**
     * Handle error
     * @param {Object} error error object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _handleError(error: any): void {
        console.log("An error is handled here: ", error.message)
    }
}

export default App
