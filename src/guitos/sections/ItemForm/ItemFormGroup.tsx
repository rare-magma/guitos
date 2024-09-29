import { immerable, produce } from "immer";
import type React from "react";
import { type RefObject, useRef, useState } from "react";
import {
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Popover,
  Tooltip,
} from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import { BsXLg } from "react-icons/bs";
import { calc, parseLocaleNumber, roundBig } from "../../../utils";
import { useBudget } from "../../context/BudgetContext";
import type { Expenses } from "../../domain/expenses";
import type { Incomes } from "../../domain/incomes";
import { useDB } from "../../hooks/useDB";
import { CalculateButton } from "../CalculateButton/CalculateButton";
import "./ItemFormGroup.css";
import { Budget } from "../../domain/budget";
import type { BudgetItem } from "../../domain/budgetItem";
import type { ItemOperation } from "../../domain/calculationHistoryItem";
import { UserOptions } from "../../domain/userOptions";

interface ItemFormProps {
  itemForm: BudgetItem;
  costPercentage: number;
  label: string;
  inputRef: RefObject<HTMLInputElement>;
  userOptions: UserOptions;
}

export function ItemFormGroup({
  itemForm,
  costPercentage,
  inputRef,
  label,
  userOptions,
}: ItemFormProps) {
  const [needsRerender, setNeedsRerender] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { budget, setBudget } = useBudget();
  const { deleteCalcHist, saveCalcHist } = useDB();
  const isExpense = label === "Expenses";
  const table = isExpense ? budget?.expenses : budget?.incomes;

  function handleCalcHist(operation: ItemOperation, changeValue: number) {
    if (!budget) return;
    const newItemForm = isExpense
      ? budget.expenses.items.find(
          (item: BudgetItem) => item.id === itemForm.id,
        )
      : budget.incomes.items.find(
          (item: BudgetItem) => item.id === itemForm.id,
        );
    if (!newItemForm) return;
    const calcHistID = `${budget.id}-${label}-${newItemForm.id}`;
    saveCalcHist(calcHistID, {
      [immerable]: true,
      id: calcHistID,
      itemForm: newItemForm,
      changeValue,
      operation,
    }).catch((e: unknown) => {
      throw e;
    });
  }

  function handleChange(
    operation: ItemOperation,
    value?: string,
    event?: React.ChangeEvent<HTMLInputElement>,
    changeValue?: number,
  ) {
    if (!budget) return;
    if (!itemForm) return;

    let saveInHistory = false;
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    const newState = produce((draft) => {
      const newItemForm = isExpense
        ? draft.expenses.items.find(
            (item: BudgetItem) => item.id === itemForm.id,
          )
        : draft.incomes.items.find(
            (item: BudgetItem) => item.id === itemForm.id,
          );
      if (!newItemForm) return;

      switch (operation) {
        case "name":
          if (event) newItemForm.name = event.target.value;
          break;
        case "value":
          if (value) {
            newItemForm.value = parseLocaleNumber(value, userOptions.locale);
          }
          break;
        default:
          if (changeValue) {
            newItemForm.value = calc(itemForm.value, changeValue, operation);
            saveInHistory = true;
            setNeedsRerender(!needsRerender);
            handleCalcHist(operation, changeValue);
          }
          break;
      }

      if (isExpense) {
        draft.expenses.total = roundBig(
          Budget.itemsTotal(draft.expenses.items),
          2,
        );
      } else {
        draft.incomes.total = roundBig(
          Budget.itemsTotal(draft.incomes.items),
          2,
        );
      }
      draft.stats.available = roundBig(Budget.available(draft as Budget), 2);
      draft.stats.withGoal = Budget.availableWithGoal(draft as Budget);
      draft.stats.saved = Budget.saved(draft as Budget);
    }, budget);

    setBudget(newState(), saveInHistory);
  }

  function handleRemove(toBeDeleted: BudgetItem) {
    if (!table?.items) return;
    if (!budget) return;

    const newTable = isExpense ? ({} as Expenses) : ({} as Incomes);
    const newState = produce((draft) => {
      if (isExpense) {
        draft.expenses = newTable;
      } else {
        draft.incomes = newTable;
      }
      newTable.items = table.items.filter(
        (item: BudgetItem) => item.id !== toBeDeleted.id,
      );
      newTable.total = roundBig(Budget.itemsTotal(newTable.items), 2);
      draft.stats.available = roundBig(Budget.available(draft as Budget), 2);
      draft.stats.withGoal = Budget.availableWithGoal(draft as Budget);
      draft.stats.saved = Budget.saved(draft as Budget);
    }, budget);
    setBudget(newState(), true);

    const calcHistID = `${budget.id}-${label}-${toBeDeleted.id}`;
    deleteCalcHist(calcHistID).catch((e: unknown) => {
      throw e;
    });
  }

  return (
    <InputGroup
      size="sm"
      className="mb-1"
      key={`${itemForm.id}-${label}-group`}
    >
      <OverlayTrigger
        delay={250}
        placement="top"
        overlay={
          costPercentage > 0 ? (
            <Tooltip
              id={`tooltip-value-${label}-${itemForm.id}`}
              style={{ position: "fixed" }}
            >
              {costPercentage}% of revenue
            </Tooltip>
          ) : (
            <></>
          )
        }
      >
        <Form.Control
          id={`${label}-${itemForm.id}-name`}
          aria-label={`item ${itemForm.id} name`}
          key={`${itemForm.id}-${label}-name`}
          className="w-25"
          ref={inputRef}
          defaultValue={itemForm.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("name", undefined, e)
          }
          type="text"
          maxLength={255}
        />
      </OverlayTrigger>
      <OverlayTrigger
        delay={250}
        placement="top"
        overlay={
          costPercentage > 0 ? (
            <Tooltip
              id={`tooltip-costPercentage-${label}-${itemForm.id}`}
              style={{ position: "fixed" }}
            >
              {costPercentage}% of revenue
            </Tooltip>
          ) : (
            <></>
          )
        }
      >
        <CurrencyInput
          id={`${label}-${itemForm.id}-value`}
          key={`${itemForm.id}-${label}-value-${needsRerender}`}
          className="text-end form-control straight-corners fixed-width-font"
          aria-label={`item ${itemForm.id} value`}
          name="item-value"
          intlConfig={UserOptions.toIntlConfig(userOptions)}
          defaultValue={itemForm.value}
          allowNegativeValue={false}
          maxLength={14}
          ref={valueRef}
          onFocus={() => valueRef.current?.setSelectionRange(0, 25)}
          onValueChange={(value) => handleChange("value", value)}
        />
      </OverlayTrigger>
      <CalculateButton
        itemForm={itemForm}
        label={label}
        onCalculate={(changeValue, operation) =>
          handleChange(operation, "", undefined, changeValue)
        }
      />
      <OverlayTrigger
        trigger="click"
        placement="top"
        rootClose={true}
        overlay={
          <Popover id={"popover-delete-button"}>
            <Popover.Body>
              <OverlayTrigger
                delay={250}
                placement="top"
                overlay={
                  <Tooltip
                    id={"tooltip-delete-itemformgroup"}
                    style={{ position: "fixed" }}
                  >
                    delete item
                  </Tooltip>
                }
              >
                <Button
                  id={`item-${itemForm.id}-delete-confirmation-button`}
                  aria-label={`confirm item ${itemForm.id} deletion`}
                  key={`${itemForm.id}-${label}-delete-confirmation-button`}
                  variant="delete"
                  type="button"
                  size="sm"
                  ref={deleteButtonRef}
                  onClick={() => handleRemove(itemForm)}
                >
                  <BsXLg aria-hidden={true} />
                </Button>
              </OverlayTrigger>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          id={`delete-${label}-${itemForm.id}-button`}
          aria-label={`delete item ${itemForm.id}`}
          key={`${itemForm.id}-${label}-delete-button`}
          variant="delete"
          type="button"
          onClick={() => {
            setTimeout(() => {
              deleteButtonRef.current?.focus();
            }, 0);
          }}
        >
          <BsXLg aria-hidden={true} />
        </Button>
      </OverlayTrigger>
    </InputGroup>
  );
}
