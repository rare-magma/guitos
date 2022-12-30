import { Expense } from "./Expense";
import { useState } from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";

interface ExpenseCardProps {
  expense: Expense;
  onChange: (expense: Expense) => void;
}

function ExpenseCard({ expense: initialExpense, onChange }: ExpenseCardProps) {
  const [expense, setExpense] = useState(initialExpense);
  const [total, setTotal] = useState(calcTotal(expense.expenses));

  const addExpense = (expenseBeingEdited: Expense) => {
    const newExpense = new Expense();
    const newItemForm = new ItemForm();

    newItemForm.id = expense.expenses.length + 2;
    newItemForm.name = "";
    newItemForm.value = 0;

    newExpense.id = expense.id;
    newExpense.expenses = expenseBeingEdited.expenses.concat(newItemForm);
    newExpense.total = calcTotal(newExpense.expenses);

    setExpense(newExpense);
    setTotal(calcTotal(newExpense.expenses));
    onChange(newExpense);
  };

  const removeExpense = (id: number) => {
    const newExpense = new Expense();
    newExpense.id = expense.id;
    newExpense.expenses = expense.expenses.filter((item) => item.id !== id);
    newExpense.total = calcTotal(newExpense.expenses);

    setExpense(newExpense);
    setTotal(calcTotal(newExpense.expenses));
    onChange(newExpense);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (item: ItemForm) => {
    const newExpense = new Expense();
    newExpense.id = expense.id;
    newExpense.expenses = expense.expenses.map((i) => {
      if (i.id === item.id) {
        return {
          id: item.id,
          name: item.name,
          value: Number(item.value),
          isNew: true,
        };
      }
      return i;
    });

    setExpense(newExpense);
    setTotal(calcTotal(newExpense.expenses));
    onChange(newExpense);
  };

  return (
    <Card>
      <Card.Header>Expenses</Card.Header>
      <Card.Body>
        {expense.expenses.map((item: ItemForm) => (
          <ItemFormGroup
            key={item.id}
            itemForm={item}
            onChange={handleChange}
            onRemove={() => {
              removeExpense(item.id);
            }}
          />
        ))}
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
            value={total}
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
