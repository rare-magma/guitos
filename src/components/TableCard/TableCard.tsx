import Big from "big.js";
import { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { calcPercentage, calcTotal, intlFormat, roundBig } from "../../utils";
import { ItemForm } from "../ItemForm/ItemForm";
import { ItemFormGroup } from "../ItemForm/ItemFormGroup";
import { Expense } from "./Expense";
import { Income } from "./Income";
import "./TableCard.css";

interface TableCardProps {
  items: Income | Expense;
  header: "Revenue" | "Expenses";
  onChange: (table: Income | Expense) => void;
}

export function TableCard({
  items: initialItems,
  header: label,
  onChange,
}: TableCardProps) {
  const [table, setTable] = useState(initialItems);
  const [total, setTotal] = useState(roundBig(calcTotal(table?.items), 2));

  const { budget, revenuePercentage } = useBudget();
  const { intlConfig } = useConfig();

  const inputRef = useRef<HTMLInputElement>(null);

  const isRevenue = label === "Revenue";
  const isExpense = label === "Expenses";

  function addTable(tableBeingEdited: Income | Expense) {
    const tableHasItems = table && table.items.length !== 0;
    const newItemForm = new ItemForm();
    const newTable = isRevenue ? new Income() : new Expense();
    let maxId;

    if (tableHasItems) {
      maxId = Math.max(
        ...table.items.map((i) => {
          return i.id;
        }),
      );
    } else {
      maxId = 0;
    }

    newItemForm.id = isNaN(maxId) ? 0 : maxId + 1;
    newItemForm.name = "";
    newItemForm.value = 0;

    newTable.items = tableBeingEdited.items.concat(newItemForm);
    newTable.total = roundBig(calcTotal(newTable.items), 2);

    setTable(newTable);
    setTotal(roundBig(calcTotal(newTable.items), 2));
    onChange(newTable);
  }

  function removeTable(toBeDeleted: ItemForm) {
    const isIncome = toBeDeleted.constructor.name === "Income";
    const newTable = isIncome ? new Income() : new Expense();

    newTable.items = table.items.filter(
      (item: { id: number }) => item.id !== toBeDeleted.id,
    );

    newTable.total = roundBig(calcTotal(newTable.items), 2);
    setTable(newTable);
    setTotal(roundBig(calcTotal(newTable.items), 2));
    onChange(newTable);
  }

  function handleChange(item: ItemForm) {
    const isIncome = item.constructor.name === "Income";
    const newTable = isIncome ? new Income() : new Expense();

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

    newTable.total = roundBig(calcTotal(newTable.items), 2);

    setTable(newTable);
    setTotal(newTable.total);
    onChange(newTable);
  }

  return (
    <Card
      key={`table-${label}-${intlConfig?.currency}`}
      className={label + "-card"}
    >
      <Card.Header className={label + "-card-header"}>
        <OverlayTrigger
          placement="top"
          overlay={
            isExpense ? (
              <Tooltip
                id={`tooltip-value-${label}`}
                style={{ position: "fixed" }}
              >
                {revenuePercentage}% of revenue
              </Tooltip>
            ) : (
              <></>
            )
          }
        >
          <Row>
            <Col>{label}</Col>
            <Col className="text-end fixed-width-font">
              <div aria-label="total amount">
                {intlConfig?.currency &&
                  intlFormat(roundBig(Big(total), 2), intlConfig?.currency)}
              </div>
            </Col>
          </Row>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body>
        {table?.items?.map((item: ItemForm) => (
          <ItemFormGroup
            key={`${label}-${item.id}`}
            itemForm={item}
            label={label}
            costPercentage={
              budget ? calcPercentage(item.value, budget.incomes.total) : 0
            }
            inputRef={inputRef}
            onChange={handleChange}
            onRemove={() => removeTable(item)}
          />
        ))}
        <div className="mt-3" />
        <div className="d-grid gap-2">
          <OverlayTrigger
            delay={250}
            placement="top"
            overlay={
              <Tooltip
                id={`tooltip-new-itemformgroup`}
                style={{ position: "fixed" }}
              >
                add new item
              </Tooltip>
            }
          >
            <Button
              variant={label + "-plus-button"}
              aria-label={`add item to ${label}`}
              size="sm"
              onClick={() => {
                addTable(table);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }}
              name=""
              value=""
            >
              <BsPlusLg aria-hidden />
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
}
