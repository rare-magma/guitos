import Stats from "./Stats";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { MOCK_BUDGETS } from "./MockBudgets";

function Dashboard() {
  const budget = MOCK_BUDGETS[0];
  return (
    <>
      <Container>
        <Row>
          <Col md="6">
            <Row>
              <Card>
                <Card.Header>Stats</Card.Header>
                <Card.Body>{/* <Stats data={budget.stats} /> */}</Card.Body>
              </Card>
            </Row>

            <Row>
              <Card>
                <Card.Header>Income</Card.Header>
                <Card.Body>
                  <InputGroup size="sm" className="mb-3">
                    {Array.from(budget.incomes).map((item) => (
                      <InputGroup
                        className="mb-3"
                        key={budget.incomes.indexOf(item) + item.name}
                      >
                        <Form.Control
                          aria-label={item.name}
                          key={budget.incomes.indexOf(item) + item.name}
                          defaultValue={item.name}
                        />
                        <Form.Control
                          aria-label={item.value.toString()}
                          key={budget.incomes.indexOf(item) + item.name}
                          defaultValue={item.value.toString()}
                          className="text-right"
                        />
                      </InputGroup>
                    ))}
                  </InputGroup>
                </Card.Body>
                <Card.Footer className="d-grid gap-2">
                  <Button variant="primary" size="sm">
                    +
                  </Button>
                </Card.Footer>
              </Card>
            </Row>
          </Col>

          <Col>
            <Card>
              <Card.Header>Expenses</Card.Header>
              <Card.Body>
                <InputGroup className="mb-3">
                  {Array.from(budget.expenses).map((item) => (
                    <InputGroup
                      className="mb-3"
                      key={budget.expenses.indexOf(item) + item.name}
                    >
                      <Form.Control
                        aria-label={item.name}
                        key={budget.expenses.indexOf(item) + item.name}
                        defaultValue={item.name}
                      />
                      <Form.Control
                        aria-label={item.value.toString()}
                        key={budget.expenses.indexOf(item) + item.name}
                        defaultValue={item.value.toString()}
                        className="justify-content-end"
                      />
                    </InputGroup>
                  ))}
                </InputGroup>
              </Card.Body>
              <Card.Footer className="d-grid gap-2">
                <Button variant="primary" size="sm">
                  +
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <></>
    </>
  );
}
export default Dashboard;
