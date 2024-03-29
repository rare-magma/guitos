import Big from "big.js";
import { Reorder } from "framer-motion";
import { produce } from "immer";
import { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  ToggleButton,
  Tooltip,
} from "react-bootstrap";
import { BsArrowsVertical, BsPlusLg } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import {
  calcAvailable,
  calcPercentage,
  calcSaved,
  calcTotal,
  calcWithGoal,
  intlFormat,
  roundBig,
} from "../../utils";
import { ItemForm } from "../ItemForm/ItemForm";
import { ItemFormGroup } from "../ItemForm/ItemFormGroup";
import { Expense } from "./Expense";
import { Income } from "./Income";
import "./TableCard.css";

interface TableCardProps {
  header: "Revenue" | "Expenses";
}

export function TableCard({ header: label }: TableCardProps) {
  const { budget, setBudget, revenuePercentage } = useBudget();
  const { intlConfig } = useConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggable, setIsDraggable] = useState(false);

  const isRevenue = label === "Revenue";
  const isExpense = label === "Expenses";
  const table = isExpense ? budget?.expenses : budget?.incomes;
  const total = table?.total ?? 0;

  function reorderTable(newOrder: ItemForm[]) {
    if (!budget) return;
    const newState = produce((draft) => {
      isExpense
        ? (draft.expenses.items = newOrder)
        : (draft.incomes.items = newOrder);
    }, budget);
    setBudget(newState(), true);
  }

  function handleTableChange(item: Income | Expense) {
    if (!budget) return;
    const newState = produce((draft) => {
      isExpense ? (draft.expenses = item) : (draft.incomes = item);
      draft.stats.available = roundBig(calcAvailable(draft), 2);
      draft.stats.withGoal = calcWithGoal(draft);
      draft.stats.saved = calcSaved(draft);
    }, budget);
    setBudget(newState(), true);
  }

  function addItemToTable(tableBeingEdited: Income | Expense | undefined) {
    if (!tableBeingEdited) return;
    const tableHasItems = table && table.items.length !== 0;
    const newItemForm = {} as ItemForm;
    const newTable = isRevenue ? ({} as Income) : ({} as Expense);
    let maxId: number;

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

    handleTableChange(newTable);
  }

  return (
    <Card
      key={`table-${label}-${intlConfig?.currency}-${table?.items.length}`}
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
        {table?.items && (
          <Reorder.Group
            axis="y"
            values={table.items}
            onReorder={reorderTable}
            as="div"
          >
            {table.items?.map((item: ItemForm) => (
              <Reorder.Item
                key={item.id}
                value={item}
                as="div"
                dragListener={isDraggable}
              >
                <ItemFormGroup
                  key={`${label}-${item.id}-item-form-group`}
                  itemForm={item}
                  label={label}
                  costPercentage={
                    budget
                      ? calcPercentage(item.value, budget.incomes.total)
                      : 0
                  }
                  inputRef={inputRef}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
        <div className="mt-3" />
        <div className="d-flex gap-2">
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
              variant={label.toLowerCase() + "-plus-button"}
              aria-label={`add item to ${label}`}
              size="sm"
              className="flex-grow-1"
              onClick={() => {
                addItemToTable(table);
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
          <OverlayTrigger
            delay={250}
            placement="top"
            overlay={
              <Tooltip
                id={`tooltip-reorder-itemformgroup`}
                style={{ position: "fixed" }}
              >
                toggle reordering of items
              </Tooltip>
            }
          >
            <ToggleButton
              id={`toggle-reorder-${label}`}
              aria-label={`reorder items in ${label}`}
              type="checkbox"
              variant="outline-info"
              value={1}
              size="sm"
              onClick={() => setIsDraggable(!isDraggable)}
              checked={isDraggable}
            >
              <BsArrowsVertical aria-hidden />
            </ToggleButton>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TableCard;
