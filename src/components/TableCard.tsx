import { useState } from "react";
import { ItemForm } from "./ItemForm";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import { calcTotal } from "../utils";
import { Expense } from "./Expense";
import { Income } from "./Income";

interface TableCardProps {
  items: Income | Expense;
  header: string;
  onChange: (table: Income | Expense) => void;
}

function TableCard({
  items: initialItems,
  header: label,
  onChange,
}: TableCardProps) {
  const [table, setTable] = useState(initialItems);
  const [total, setTotal] = useState(calcTotal(table.items));

  const addTable = (tableBeingEdited: Income | Expense) => {
    let newTable;
    if (label === "Incomes") {
      newTable = new Income();
    } else if (label === "Expenses") {
      newTable = new Expense();
    } else {
      throw new Error("Messed up table type");
    }
    const newItemForm = new ItemForm();

    newItemForm.id = table.items.length + 2;
    newItemForm.name = "";
    newItemForm.value = 0;

    newTable.id = table.id;
    newTable.items = tableBeingEdited.items.concat(newItemForm);
    newTable.total = calcTotal(newTable.items);

    setTable(newTable);
    setTotal(calcTotal(newTable.items));
    onChange(newTable);
  };

  const removeTable = (toBeDeleted: ItemForm) => {
    let newTable;
    if (toBeDeleted.constructor.name === "Income") {
      newTable = new Income();
    } else {
      newTable = new Expense();
    }
    newTable.id = table.id;
    newTable.items = table.items.filter(
      (item: { id: number }) => item.id !== toBeDeleted.id
    );
    newTable.total = calcTotal(newTable.items);

    setTable(newTable);
    setTotal(calcTotal(newTable.items));
    onChange(newTable);
  };

  const handleChange = (item: ItemForm) => {
    let newTable;
    if (item.constructor.name === "Income") {
      newTable = new Income();
    } else {
      newTable = new Expense();
    }
    newTable.id = table.id;
    newTable.items = table.items.map((i) => {
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

    setTable(newTable);
    setTotal(calcTotal(newTable.items));
    onChange(newTable);
  };

  return (
    <Card>
      <Card.Header>{label}</Card.Header>
      <Card.Body>
        {table.items?.map((item: ItemForm) => (
          <ItemFormGroup
            key={item.id}
            itemForm={item}
            onChange={handleChange}
            onRemove={() => {
              removeTable(item);
            }}
          />
        ))}
        <div className="mt-3" />
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              addTable(table);
            }}
            name=""
            value=""
          >
            +
          </Button>
        </div>
      </Card.Body>
      <Card.Footer className="d-grid gap-2">
        <InputGroup className="mb-1" key={table.id + "-total-group-" + label}>
          <InputGroup.Text>total</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={label + "-table-total"}
            key={label + table.id + "total"}
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

export default TableCard;
