import { Income } from "./Income";
import React from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";

function calcTotal(description: string): string {
  return description.substring(0, 60) + "...";
}

interface IncomeCardProps {
  income: Income;
  onEdit: (income: Income) => void;
}

function IncomeCard(props: IncomeCardProps) {
  const { income, onEdit } = props;

  const handleEditClick = (incomeBeingEdited: Income) => {
    onEdit(incomeBeingEdited);
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
      </Card.Body>
      <Card.Footer className="d-grid gap-2">
        <Button
          variant="primary"
          size="sm"
          //   onClick={addIncome}
          name=""
          value=""
        >
          +
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default IncomeCard;
