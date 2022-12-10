import { Expense } from "./Expense";
import React from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";

function calcTotal(description: string): string {
  return description.substring(0, 60) + "...";
}

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

function ExpenseCard(props: ExpenseCardProps) {
  const { expense, onEdit } = props;

  const handleEditClick = (expenseBeingEdited: Expense) => {
    onEdit(expenseBeingEdited);
  };

  return (
    <Card>
      <Card.Header>Expenses</Card.Header>
      <Card.Body>
        {expense.expenses.map(
          (item: ItemForm, i: React.Key | null | undefined) => (
            <ItemFormGroup
              key={i}
              itemForm={item}
              onEdit={function (itemForm: ItemForm): void {
                throw new Error("Function not implemented.");
              }}
            />
          )
        )}
      </Card.Body>
      <Card.Footer className="d-grid gap-2">
        <Button
          variant="primary"
          size="sm"
          // onClick={addExpense}
          name=""
          value=""
        >
          +
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default ExpenseCard;
