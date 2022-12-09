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
import Budget from "./Budget";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import ItemForm from "./ItemForm";

function BudgetsPage() {
  const [budgets, setBudgets] = useState(MOCK_BUDGETS);
  const saveBudget = (budget: Budget) => {
    const updatedBudgets = budgets.map((budget: Budget) => {
      return budget.id === budget.id ? budget : budget;
    });
    setBudgets(updatedBudgets);
  };

  return (
    <>
      <Container>
        <Row>
          <Col md="6">
            <Row style={{ padding: 10 }}>
              <Card>
                <Card.Header>Stats</Card.Header>
                <Card.Body>
                  <InputGroup
                    className="mb-1"
                    key={budget.stats.available + budget.name}
                  >
                    <InputGroup.Text>available</InputGroup.Text>
                    <Form.Control
                      aria-label={"available"}
                      key={budget.stats?.available + budget.name}
                      defaultValue={budget.stats?.available}
                      disabled
                      readOnly
                    />
                  </InputGroup>
                  <InputGroup
                    className="mb-1"
                    key={budget.stats?.withGoal + budget.name}
                  >
                    <InputGroup.Text>with goal</InputGroup.Text>
                    <Form.Control
                      aria-label={"withGoal"}
                      key={budget.stats?.withGoal + budget.name}
                      defaultValue={budget.stats?.withGoal}
                      disabled
                      readOnly
                    />
                  </InputGroup>
                </Card.Body>
                <Card.Footer className="d-grid gap-2">
                  <Button variant="primary" size="sm">
                    +
                  </Button>
                </Card.Footer>
              </Card>
            </Row>

            <Row style={{ padding: 10 }}>
              <Card>
                <Card.Header>Income</Card.Header>
                <Card.Body>
                  {incomes.map((item, i) => (
                    <ItemForm name={item.name} value={item.value} />
                  ))}
                  <InputGroup size="sm" className="mb-3">
                    {Array.from(budget.incomes).map((item) => (
                      <InputGroup
                        className="mb-1"
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
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={addIncome}
                    value=""
                    name=""
                  >
                    +
                  </Button>
                </Card.Footer>
              </Card>
            </Row>
          </Col>

          <Col md="6">
            <Card>
              <Card.Header>Expenses</Card.Header>
              <Card.Body>
                <InputGroup className="mb-1">
                  {Array.from(budget.expenses).map((item) => (
                    <InputGroup
                      className="mb-1"
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
export default BudgetsPage;
