import React, { useState } from "react";
import { Budget } from "./Budget";
import BudgetCard from "./BudgetCard";
import BudgetForm from "./BudgetForm";

interface BudgetListProps {
  budgets: Budget[];
  onSave: (budget: Budget) => void;
}

function BudgetList({ budgets, onSave }: BudgetListProps) {
  const [budgetBeingEdited, setBudgetBeingEdited] = useState({});

  const handleEdit = (budget: Budget) => {
    setBudgetBeingEdited(budget);
  };

  const cancelEditing = () => {
    setBudgetBeingEdited({});
  };

  return (
    <div className="row">
      {budgets.map((budget) => (
        <div key={budget.id} className="cols-sm">
          {budget === budgetBeingEdited ? (
            <BudgetForm
              budget={budget}
              onSave={onSave}
              onCancel={cancelEditing}
            />
          ) : (
            <BudgetCard budget={budget} onEdit={handleEdit} />
          )}
        </div>
      ))}
    </div>
  );
}

export default BudgetList;
