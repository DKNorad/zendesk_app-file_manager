import React from "react"
import { PALETTE } from "@zendeskgarden/react-theming"
import { Dots } from "@zendeskgarden/react-loaders"

const Loader = () => (
    <center>
        <Dots size={25} color={PALETTE.blue[600]} />
    </center>
)

export default Loader
