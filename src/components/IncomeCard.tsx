import { Income } from "./Income";
import { useState } from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";

interface IncomeCardProps {
  income: Income;
  onChange: (income: Income) => void;
}

function IncomeCard({ income: initialIncome, onChange }: IncomeCardProps) {
  const [income, setIncome] = useState(initialIncome);
  const [total, setTotal] = useState(calcTotal(income.incomes));

  const addIncome = (incomeBeingEdited: Income) => {
    const newIncome = new Income();
    const newItemForm = new ItemForm();

    newItemForm.id = income.incomes.length + 2;
    newItemForm.name = "";
    newItemForm.value = 0;

    newIncome.id = income.id;
    newIncome.incomes = incomeBeingEdited.incomes.concat(newItemForm);
    newIncome.total = calcTotal(newIncome.incomes);

    setIncome(newIncome);
    setTotal(calcTotal(newIncome.incomes));
    onChange(newIncome);
  };

  const removeIncome = (id: number) => {
    const newIncome = new Income();
    newIncome.id = income.id;
    newIncome.incomes = income.incomes.filter((item) => item.id !== id);
    newIncome.total = calcTotal(newIncome.incomes);

    setIncome(newIncome);
    setTotal(calcTotal(newIncome.incomes));
    onChange(newIncome);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (item: ItemForm) => {
    const newIncome = new Income();
    newIncome.id = income.id;
    newIncome.incomes = income.incomes.map((i: ItemForm) => {
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

    setIncome(newIncome);
    setTotal(calcTotal(newIncome.incomes));
    onChange(newIncome);
  };

  return (
    <Card>
      <Card.Header>Income</Card.Header>
      <Card.Body>
        {income.incomes.map((item: ItemForm) => (
          <ItemFormGroup
            key={item.id}
            itemForm={item}
            onChange={handleChange}
            onRemove={() => {
              removeIncome(item.id);
            }}
          />
        ))}
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
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
      </Card.Footer>
    </Card>
  );
}

export default IncomeCard;
