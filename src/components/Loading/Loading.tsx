import { Container, Row, Spinner } from "react-bootstrap";

export function Loading() {
  return (
    <Container
      fluid
      className="position-absolute top-50 start-50 translate-middle"
    >
      <Row className="justify-content-center">
        <Spinner animation="border" role="status" />
      </Row>
    </Container>
  );
}
