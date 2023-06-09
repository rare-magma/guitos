import { useRef, useState } from "react";
import { ItemForm } from "../ItemForm/ItemForm";
import {
  Card,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import { CurrencyInputProps } from "react-currency-input-field";
import Big from "big.js";
import { roundBig, calcTotal, calcPercentage, intlFormat } from "../../utils";
import ItemFormGroup from "../ItemForm/ItemFormGroup";
import { Expense } from "./Expense";
import { Income } from "./Income";

interface TableCardProps {
  items: Income | Expense;
  revenueTotal: number;
  header: string;
  intlConfig: CurrencyInputProps["intlConfig"];
  onChange: (table: Income | Expense) => void;
}

function TableCard({
  items: initialItems,
  revenueTotal,
  header: label,
  intlConfig,
  onChange,
}: TableCardProps) {
  const [table, setTable] = useState(initialItems);
  const [total, setTotal] = useState(roundBig(calcTotal(table.items), 2));
  const revenuePercentage = calcPercentage(total, revenueTotal);
  const inputRef = useRef<HTMLInputElement>(null);

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
    newTable.total = roundBig(calcTotal(newTable.items), 2);

    setTable(newTable);
    setTotal(roundBig(calcTotal(newTable.items), 2));
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
    newTable.total = roundBig(calcTotal(newTable.items), 2);

    setTable(newTable);
    setTotal(roundBig(calcTotal(newTable.items), 2));
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
    newTable.total = roundBig(calcTotal(newTable.items), 2);

    setTable(newTable);
    setTotal(newTable.total);
    onChange(newTable);
  };

  return (
    <Card
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      key={"table-" + label + intlConfig?.currency}
      className={label + "-card"}
    >
      <Card.Header className={label + "-card-header"}>
        <Row>
          <Col>{label}</Col>
          <Col className="text-end fixed-width-font">
            <OverlayTrigger
              placement="top"
              overlay={
                label === "Expenses" ? (
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
              <div>
                {intlFormat(
                  roundBig(Big(total), 2),
                  intlConfig?.currency as string
                )}
              </div>
            </OverlayTrigger>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {table.items?.map((item: ItemForm) => (
          <ItemFormGroup
            key={`${label}-${item.id}`}
            itemForm={item}
            intlConfig={intlConfig}
            label={label}
            costPercentage={calcPercentage(item.value, revenueTotal)}
            inputRef={inputRef}
            onChange={handleChange}
            onRemove={() => {
              removeTable(item);
            }}
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
              <BsPlusLg />
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TableCard;
