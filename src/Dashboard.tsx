import { Col, Container, Row } from "react-bootstrap";
import GuitosTable from "./GuitosTable";

function Dashboard() {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <GuitosTable />
          </Col>
          <Col md={{ span: 6 }}>
            <GuitosTable />
          </Col>
        </Row>
        <Row>
          <Col>
            <GuitosTable />
          </Col>
        </Row>
      </Container>
      <></>
    </>
  );
}
export default Dashboard;
