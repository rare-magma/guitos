import { Budget } from "./Budget";

interface BudgetListProps {
  budgets: Budget[];
}

function BudgetList({ budgets }: BudgetListProps) {
  return JSON.stringify(budgets, null, " ");
}

export default BudgetList;
