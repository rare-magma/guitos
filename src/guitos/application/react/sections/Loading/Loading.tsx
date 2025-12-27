import { Container, Row, Spinner } from "react-bootstrap";

export function Loading() {
  return (
    <Container
      fluid={true}
      className="position-absolute top-50 start-50 translate-middle"
    >
      <Row className="justify-content-center">
        {/** biome-ignore lint/a11y/useSemanticElements: bootstrap isn't semantic */}
        <Spinner animation="border" role="status" />
      </Row>
    </Container>
  );
}
