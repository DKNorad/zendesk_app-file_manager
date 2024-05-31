import React from "react"
import { Dots } from "@zendeskgarden/react-loaders"
import { Col, Row } from "@zendeskgarden/react-grid"

const LoaderDots = () => {
    return (
        <Row justifyContent="center">
            <Col>
                <Dots size={32} />
            </Col>
        </Row>
    )
}

export default LoaderDots
