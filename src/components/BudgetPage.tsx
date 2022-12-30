import { useEffect, useState } from "react";
import { Budget } from "./Budget";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ExpenseCard from "./ExpenseCard";
import IncomeCard from "./IncomeCard";
import { Stat } from "./Stat";
import StatCard from "./StatCard";
import { useLocalStorage } from "../utils";
import { Income } from "./Income";
import { Expense } from "./Expense";

function BudgetPage() {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState<Budget | null>(null);

  const [budgetList, setBudgetList] = useLocalStorage("budgetList", "");

  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const name = String(params.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (item: any) => {
    const newBudget = new Budget();
    if (budget !== null && budget.name !== null) {
      newBudget.name = budget.name;
    }
    if (budget !== null && budget.incomes !== null) {
      newBudget.incomes = budget.incomes;
    }
    if (budget !== null && budget.expenses !== null) {
      newBudget.expenses = budget.expenses;
    }
    if (budget !== null && budget.stats !== null) {
      newBudget.stats = budget.stats;
    }
    if (item instanceof Income) {
      newBudget.incomes = item;
    }
    if (item instanceof Expense) {
      newBudget.expenses = item;
    }
    if (item instanceof Stat) {
      newBudget.stats = item;
    }
    setBudget(newBudget);
  };

  useEffect(() => {
    setLoading(true);
    try {
      budgetList !== null &&
        Array.isArray(budgetList) &&
        budgetList
          .filter((budget: Budget) => budget.name === name)
          .map((data: Budget) => {
            setBudget(data);
            setLoading(false);
          });
    } catch {
      budgetList.catch((e: React.SetStateAction<string | null>) => {
        setError(e);
        setLoading(false);
      });
    }
  }, [budgetList, name, setBudgetList]);

  return (
    <div>
      <>
        {loading && (
          <div className="center-page">
            <span className="spinner primary"></span>
            <p>Loading...</p>
          </div>
        )}
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
                  <StatCard budget={budget} onChange={handleChange} />

                  <div className="mt-3" />

                  <IncomeCard income={budget.incomes} onChange={handleChange} />
                </div>
              </Col>

              <Col md="6">
                <ExpenseCard
                  expense={budget.expenses}
                  onChange={handleChange}
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
