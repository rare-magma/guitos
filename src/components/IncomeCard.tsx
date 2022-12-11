import { Income } from "./Income";
import React, { SyntheticEvent, useState } from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";

interface IncomeCardProps {
  income: Income;
}

function IncomeCard({ income: initialIncome }: IncomeCardProps) {
  const [income, setIncome] = useState(initialIncome);

  const addIncome = (incomeBeingEdited: Income) => {
    const newIncome = new Income();
    newIncome.incomes = incomeBeingEdited.incomes.concat(new ItemForm());
    setIncome(newIncome);
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
            aria-label={"income-total"}
            key={income.id + "total"}
            defaultValue={calcTotal(income.incomes)}
            disabled
            readOnly
          />
        </InputGroup>
      </Card.Footer>
    </Card>
  );
}

export default IncomeCard;
