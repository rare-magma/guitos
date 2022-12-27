import { Income } from "./Income";
import React, { useState } from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";

interface IncomeCardProps {
  income: Income;
  onChange: (income: Income) => void;
}

function IncomeCard({ income: initialIncome }: IncomeCardProps) {
  const [income, setIncome] = useState(initialIncome);
  const [total, setTotal] = useState(calcTotal(income.incomes));

  const addIncome = (incomeBeingEdited: Income) => {
    const newIncome = new Income();
    const newItemForm = new ItemForm();
    newItemForm.id = income.incomes.length + 1;
    newItemForm.name = "";
    newItemForm.value = 0;
    newIncome.incomes = incomeBeingEdited.incomes.concat(newItemForm);
    setTotal(calcTotal(newIncome.incomes));
    setIncome(newIncome);
  };

  const recalcTotal = (incomeBeingEdited: Income) => {
    setTotal(calcTotal(incomeBeingEdited.incomes));
  };

  const removeIncome = (removeId: number) => {
    const newIncome = new Income();
    newIncome.incomes = income.incomes.filter((item) => item.id !== removeId);
    setIncome(newIncome);
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

    let updatedIncome: Income;

    setIncome((i) => {
      updatedIncome = new Income({ ...i, ...change });
      return updatedIncome;
    });
  };

  return (
    <Card>
      <Card.Header>Income</Card.Header>
      <Card.Body>
        {income.incomes.map(
          (item: ItemForm, i: React.Key | null | undefined) => (
            <ItemFormGroup
              key={i}
              itemForm={item}
              onRemove={() => {
                removeIncome(item.id);
              }}
            />
          )
        )}
        <div className="mt-3" />
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              addIncome(income);
            }}
            name=""
            value=""
          >
            +
          </Button>
        </div>
      </Card.Body>
      <Card.Footer className="d-grid gap-2">
        <InputGroup className="mb-1" key={income.id + "-total-group"}>
          <InputGroup.Text>total</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"income-total"}
            key={income.id + "total"}
            value={total}
            disabled
            readOnly
            onClick={() => {
              recalcTotal(income);
            }}
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
      </Card.Footer>
    </Card>
  );
}

export default IncomeCard;
