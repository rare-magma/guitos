import Big from "big.js";
import { produce } from "immer";
import { Reorder } from "motion/react";
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
import { intlFormat, roundBig } from "../../../utils";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { ItemFormGroup } from "../ItemForm/ItemFormGroup";
import "./TableCard.css";
import { BudgetCalculator } from "../../application/budgetCalculator";
import type { Budget } from "../../domain/budget";
import { BudgetItem } from "../../domain/budgetItem";
import type { Expenses } from "../../domain/expenses";
import type { Incomes } from "../../domain/incomes";

interface TableCardProps {
  header: "Revenue" | "Expenses";
}

// biome-ignore lint/style/noDefaultExport: lazy loading
export default function TableCard({ header: label }: TableCardProps) {
  const { budget, setBudget, revenuePercentage } = useBudget();
  const { userOptions } = useConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggable, setIsDraggable] = useState(false);

  const isRevenue = label === "Revenue";
  const isExpense = label === "Expenses";
  const table = isExpense ? budget?.expenses : budget?.incomes;
  const total = table?.total ?? 0;

  function reorderTable(newOrder: BudgetItem[]) {
    if (!budget) return;
    const newState = produce((draft) => {
      if (isExpense) {
        draft.expenses.items = newOrder;
      } else {
        draft.incomes.items = newOrder;
      }
    }, budget);
    setBudget(newState(), true);
  }

  function handleTableChange(item: Incomes | Expenses) {
    if (!budget) return;
    const newState = produce((draft) => {
      if (isExpense) {
        draft.expenses = item;
      } else {
        draft.incomes = item;
      }
      draft.stats.available = roundBig(
        BudgetCalculator.available(draft as Budget),
        2,
      );
      draft.stats.withGoal = BudgetCalculator.availableWithGoal(
        draft as Budget,
      );
      draft.stats.saved = BudgetCalculator.saved(draft as Budget);
    }, budget);
    setBudget(newState(), true);
  }

  function addItemToTable(tableBeingEdited: Incomes | Expenses | undefined) {
    if (!tableBeingEdited) return;
    const tableHasItems = table && table.items.length !== 0;
    const newItemForm = BudgetItem.create();
    const newTable = isRevenue ? ({} as Incomes) : ({} as Expenses);
    let maxId: number;

    if (tableHasItems) {
      maxId = Math.max(
        ...table.items.map((i: BudgetItem) => {
          return i.id;
        }),
      );
    } else {
      maxId = 0;
    }

    newItemForm.id = Number.isNaN(maxId) ? 0 : maxId + 1;
    newItemForm.name = "";
    newItemForm.value = 0;

    newTable.items = tableBeingEdited.items.concat(newItemForm);
    newTable.total = roundBig(BudgetCalculator.itemsTotal(newTable.items), 2);

    handleTableChange(newTable);
  }

  return (
    <Card
      key={`table-${label}-${userOptions.currencyCode}-${table?.items.length}`}
      className={`${label}-card`}
    >
      <Card.Header className={`${label}-card-header`}>
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
              // biome-ignore lint/complexity/noUselessFragments: react types need it
              <></>
            )
          }
        >
          <Row>
            <Col>{label}</Col>
            <Col className="text-end fixed-width-font">
              <div>{intlFormat(roundBig(Big(total), 2), userOptions)}</div>
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
            {table.items?.map((item: BudgetItem) => (
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
                      ? BudgetItem.percentage(item.value, budget.incomes.total)
                      : 0
                  }
                  inputRef={inputRef}
                  userOptions={userOptions}
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
                id={"tooltip-new-itemformgroup"}
                style={{ position: "fixed" }}
              >
                add new item
              </Tooltip>
            }
          >
            <Button
              variant={`${label.toLowerCase()}-plus-button`}
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
              <BsPlusLg aria-hidden={true} />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            delay={250}
            placement="top"
            overlay={
              <Tooltip
                id={"tooltip-reorder-itemformgroup"}
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
              variant="outline-info toggle"
              value={1}
              size="sm"
              onClick={() => setIsDraggable(!isDraggable)}
              checked={isDraggable}
            >
              <BsArrowsVertical aria-hidden={true} />
            </ToggleButton>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
}
