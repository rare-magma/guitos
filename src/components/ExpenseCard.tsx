import { Expense } from "./Expense";
import React from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";

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
        <div className="mt-3" />
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="sm"
            //   onClick={addIncome}
            name=""
            value=""
          >
            +
          </Button>
        </div>
      </Card.Body>
      <Card.Footer className="d-grid gap-2">
        <InputGroup className="mb-1" key={expense.id + "-total-group"}>
          <InputGroup.Text>total</InputGroup.Text>
          <Form.Control
            aria-label={"expense-total"}
            key={expense.id + "total"}
            defaultValue={calcTotal(expense.expenses)}
            disabled
            readOnly
          />
        </InputGroup>
      </Card.Footer>
    </Card>
  );
}

export default ExpenseCard;
