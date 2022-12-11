import { Expense } from "./Expense";
import React, { useState } from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";

interface ExpenseCardProps {
  expense: Expense;
}

function ExpenseCard({ expense: initialExpense }: ExpenseCardProps) {
  const [expense, setExpense] = useState(initialExpense);

  const addExpense = (expenseBeingEdited: Expense) => {
    const newExpense = new Expense();
    newExpense.expenses = expenseBeingEdited.expenses.concat(new ItemForm());
    setExpense(newExpense);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { type, name, value } = event.target;
    let updatedValue = value;

    if (type === "number") {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };

    let updatedExpense: Expense;

    setExpense((i) => {
      updatedExpense = new Expense({ ...i, ...change });
      return updatedExpense;
    });
  };

  return (
    <Card>
      <Card.Header>Expenses</Card.Header>
      <Card.Body>
        {expense.expenses.map(
          (item: ItemForm, i: React.Key | null | undefined) => (
            <ItemFormGroup key={i} itemForm={item} onChange={handleChange} />
          )
        )}
        <div className="mt-3" />
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              addExpense(expense);
            }}
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
            className="text-right"
            aria-label={"expense-total"}
            key={expense.id + "total"}
            defaultValue={calcTotal(expense.expenses)}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
      </Card.Footer>
    </Card>
  );
}

export default ExpenseCard;
