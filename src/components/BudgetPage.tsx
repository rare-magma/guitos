import React, { useEffect, useState } from "react";
import { Budget } from "./Budget";
import { useParams } from "react-router-dom";
import { MOCK_BUDGETS } from "./MockBudgets";
import { Container, Row, Col } from "react-bootstrap";
import { Expense } from "./Expense";
import ExpenseCard from "./ExpenseCard";
import { Income } from "./Income";
import IncomeCard from "./IncomeCard";
import { Stat } from "./Stat";
import StatCard from "./StatCard";

function BudgetPage() {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = Number(params.id);
  useEffect(() => {
    setLoading(true);
    MOCK_BUDGETS.filter((budget) => budget.id === id).map((data) => {
      setBudget(data);
      setLoading(false);
    });
    // .catch((e: React.SetStateAction<string | null>) => {
    //   setError(e);
    //   setLoading(false);
    // });
  }, [id]);
  return (
    <div>
      <>
        {/* {loading && (
          <div className="center-page">
            <span className="spinner primary"></span>
            <p>Loading...</p>
          </div>
        )} */}
        {error && (
          <div className="row">
            <div className="card large error">
              <section>
                <p>
                  <span className="icon-alert inverse "></span> {error}
                </p>
              </section>
            </div>
          </div>
        )}
        {budget && (
          <Container>
            <Row>
              <Col md="6">
                <div className="card-columns">
                  <StatCard
                    stat={budget.stats}
                    onEdit={function (stat: Stat): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                  <div className="mt-3" />

                  <IncomeCard
                    income={budget.incomes}
                    onEdit={function (income: Income): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              </Col>

              <Col md="6">
                <ExpenseCard
                  expense={budget.expenses}
                  onEdit={function (expense: Expense): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </Col>
            </Row>
          </Container>
        )}
      </>
    </div>
  );
}

export default BudgetPage;
