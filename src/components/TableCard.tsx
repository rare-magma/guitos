import { useState } from "react";
import { ItemForm } from "./ItemForm";
import {
  Card,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import ItemFormGroup from "./ItemFormGroup";
import {
  calcPercentage,
  calcTotal,
  intlFormat,
  round,
  userLang,
} from "../utils";
import { Expense } from "./Expense";
import { Income } from "./Income";
import { BsPlusLg } from "react-icons/bs";

interface TableCardProps {
  items: Income | Expense;
  revenueTotal: number;
  header: string;
  onChange: (table: Income | Expense) => void;
}

function TableCard({
  items: initialItems,
  revenueTotal,
  header: label,
  onChange,
}: TableCardProps) {
  const [table, setTable] = useState(initialItems);
  const [total, setTotal] = useState(calcTotal(table.items));
  const revenuePercentage = calcPercentage(total, revenueTotal);

  const addTable = (tableBeingEdited: Income | Expense) => {
    let newTable;
    if (label === "Revenue") {
      newTable = new Income();
    } else if (label === "Expenses") {
      newTable = new Expense();
    } else {
      throw new Error("Messed up table type");
    }

    const newItemForm = new ItemForm();

    let maxId;
    if (table.items.length !== 0) {
      maxId = Math.max(
        ...table.items.map((i) => {
          return i.id;
        })
      );
    } else {
      maxId = 0;
    }

    newItemForm.id = isNaN(maxId) ? 0 : maxId + 1;
    newItemForm.name = "";
    newItemForm.value = 0;

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
    newTable.items = table.items.map((i) => {
      if (i.id === item.id) {
        return {
          id: item.id,
          name: item.name,
          value: isNaN(item.value) ? 0 : Number(item.value),
        };
      }
      return i;
    });
    newTable.total = calcTotal(newTable.items);

    setTable(newTable);
    setTotal(newTable.total);
    onChange(newTable);
  };

  return (
    <Card className={label + "-card"}>
      <Card.Header className={label + "-card-header"}>
        <Row>
          <Col>{label}</Col>
          <Col className="text-end">
            <OverlayTrigger
              placement="top"
              overlay={
                label === "Expenses" ? (
                  <Tooltip id={`tooltip-value-${label}`}>
                    {revenuePercentage}% of revenue
                  </Tooltip>
                ) : (
                  <></>
                )
              }
            >
              <div>{intlFormat(round(total * 100, 2), userLang)}</div>
            </OverlayTrigger>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {table.items?.map((item: ItemForm) => (
          <ItemFormGroup
            key={item.id}
            itemForm={item}
            costPercentage={calcPercentage(item.value, revenueTotal)}
            onChange={handleChange}
            onRemove={() => {
              removeTable(item);
            }}
          />
        ))}
        <div className="mt-3" />
        <div className="d-grid gap-2">
          <Button
            variant={label + "-plus-button"}
            size="sm"
            onClick={() => {
              addTable(table);
            }}
            name=""
            value=""
          >
            <BsPlusLg />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TableCard;
