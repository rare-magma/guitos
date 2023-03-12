import { useEffect, useState } from "react";
import { Budget } from "./Budget";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import TableCard from "./TableCard";
import { Stat } from "./Stat";
import StatCard from "./StatCard";
import {
  calcAvailable,
  calcSaved,
  calcWithGoal,
  useLocalStorage,
} from "../utils";
import { Income } from "./Income";
import { Expense } from "./Expense";

function BudgetPage() {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState<Budget | null>(null);

  const [budgetList, setBudgetList] = useLocalStorage("budgetList", "");
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const name = String(params.name);

  const handleIncomeChange = (item: Income) => {
    let newBudget: Budget;
    if (budget !== null) {
      newBudget = budget;
      newBudget.incomes = item;
      newBudget.stats.available = calcAvailable(newBudget);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        incomes: {
          ...budget.incomes,
          items: item.items,
          total: item.total,
          isNew: true,
        },
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
          isNew: true,
        },
        isNew: true,
      });
    }
  };

  const handleExpenseChange = (item: Expense) => {
    let newBudget: Budget;
    if (budget !== null) {
      newBudget = budget;
      newBudget.expenses = item;
      newBudget.stats.available = calcAvailable(newBudget);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        expenses: {
          ...budget.expenses,
          items: item.items,
          total: item.total,
          isNew: true,
        },
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
          isNew: true,
        },
        isNew: true,
      });
    }
  };

  const handleChange = (item: Stat) => {
    let newBudget: Budget;
    if (budget !== null) {
      newBudget = budget;
      newBudget.version = budget.version + 1;
      newBudget.stats = item;
      newBudget.stats.available = calcAvailable(newBudget);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);
      setBudget(newBudget);
    }
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
  }, [budgetList, name, budget, setBudgetList]);

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
                  <StatCard stat={budget.stats} onChange={handleChange} />

                  <div className="mt-3" />

                  <TableCard
                    items={budget.incomes}
                    header="Incomes"
                    onChange={handleIncomeChange}
                  />
                </div>
              </Col>

              <Col md="6">
                <TableCard
                  items={budget.expenses}
                  header="Expenses"
                  onChange={handleExpenseChange}
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
