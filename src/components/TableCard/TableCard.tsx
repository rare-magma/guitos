import Big from "big.js";
import { useRef } from "react";
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
import {
  calcAvailable,
  calcPercentage,
  calcSaved,
  calcTotal,
  calcWithGoal,
  intlFormat,
  roundBig,
} from "../../utils";
import { Budget } from "../Budget/Budget";
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

  const isRevenue = label === "Revenue";
  const isExpense = label === "Expenses";
  const table = isExpense ? budget?.expenses : budget?.incomes;
  const total = table?.total ?? 0;

  function handleIncomeChange(item: Income) {
    let newBudget: Budget | undefined;
    if (budget) {
      newBudget = budget;
      newBudget.incomes = item;
      newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        incomes: {
          ...budget.incomes,
          items: item.items,
          total: item.total,
        },
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
        },
      });
    }
  }

  function handleExpenseChange(item: Expense) {
    let newBudget: Budget;
    if (budget) {
      newBudget = budget;
      newBudget.expenses = item;
      newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        expenses: {
          ...budget.expenses,
          items: item.items,
          total: item.total,
        },
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
        },
      });
    }
  }

  function addTable(tableBeingEdited: Income | Expense | undefined) {
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

    isExpense ? handleExpenseChange(newTable) : handleIncomeChange(newTable);
  }

  function removeTable(toBeDeleted: ItemForm) {
    if (!table?.items) return;
    const isIncome = toBeDeleted.constructor.name === "Income";
    const newTable = isIncome ? ({} as Income) : ({} as Expense);

    newTable.items = table.items.filter(
      (item: { id: number }) => item.id !== toBeDeleted.id,
    );

    newTable.total = roundBig(calcTotal(newTable.items), 2);
    isExpense ? handleExpenseChange(newTable) : handleIncomeChange(newTable);
  }

  function handleChange(item: ItemForm) {
    if (!table?.items) return;
    const isIncome = item.constructor.name === "Income";
    const newTable = isIncome ? ({} as Income) : ({} as Expense);

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
    isExpense ? handleExpenseChange(newTable) : handleIncomeChange(newTable);
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
        {table?.items?.map((item: ItemForm) => (
          <ItemFormGroup
            key={`${label}-${item.id}-item-form-group`}
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
              variant={label.toLowerCase() + "-plus-button"}
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
