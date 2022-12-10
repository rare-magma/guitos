import { Col, Container, Row } from "react-bootstrap";
import { MOCK_BUDGETS } from "./MockBudgets";
import { Budget } from "./Budget";
import { useState } from "react";
import IncomeCard from "./IncomeCard";
import ExpenseCard from "./ExpenseCard";
import StatCard from "./StatCard";
import { Stat } from "./Stat";
import { Expense } from "./Expense";
import { Income } from "./Income";

function BudgetsPage() {
  const [budgets, setBudgets] = useState(MOCK_BUDGETS[0]);
  // const saveBudget = (budget: Budget) => {
  //   const updatedBudgets = budgets.map((budget: Budget) => {
  //     return budget.id === budget.id ? budget : budget;
  //   });
  //   setBudgets(updatedBudgets);
  // };
  console.log("budgets[0]" + JSON.stringify(budgets));

  return (
    <>
      <Container>
        <Row>
          <Col md="6">
            <Row style={{ padding: 10 }}>
              <StatCard
                stat={budgets.stats}
                onEdit={function (stat: Stat): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </Row>

            <Row style={{ padding: 10 }}>
              <IncomeCard
                income={budgets.incomes}
                onEdit={function (income: Income): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </Row>
          </Col>

          <Col md="6">
            <ExpenseCard
              expense={budgets.expenses}
              onEdit={function (expense: Expense): void {
                throw new Error("Function not implemented.");
              }}
            />
          </Col>
        </Row>
      </Container>
      <></>
    </>
  );
}
export default BudgetsPage;
