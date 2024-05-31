import React from "react"
import { MD, XXL } from "@zendeskgarden/react-typography"
import { Skeleton } from "@zendeskgarden/react-loaders"
import { Col, Row } from "@zendeskgarden/react-grid"

const LoaderSkeleton = ({ items }: { items: number }) => (
    <Row justifyContent="center">
        <Col>
            <XXL>
                <Skeleton />
            </XXL>
            <MD>
                {Array.from({ length: items }).map((_, index) => (
                    <Skeleton key={index} />
                ))}
            </MD>
        </Col>
    </Row>
)

export default LoaderSkeleton
