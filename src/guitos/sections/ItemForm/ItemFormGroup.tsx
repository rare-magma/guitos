import { produce } from "immer";
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
import CurrencyInput, { type IntlConfig } from "react-currency-input-field";
import { BsXLg } from "react-icons/bs";
import { calc, parseLocaleNumber, roundBig } from "../../../utils";

import "./ItemFormGroup.css";
import { BudgetCalculator } from "@guitos/application/budgetCalculator";
import { useBudget } from "@guitos/context/BudgetContext";
import type { Budget } from "@guitos/domain/budget";
import type { BudgetItem } from "@guitos/domain/budgetItem";
import type { Expenses } from "@guitos/domain/expenses";
import type { Incomes } from "@guitos/domain/incomes";
import { commandBus } from "@guitos/infrastructure/buses";
import { PersistOperationsCommand } from "@guitos/operations/application/persistOperations/persistOperationsCommand";
import { RemoveOperationsCommand } from "@guitos/operations/application/removeOperations/removeOperationsCommand";
import { ItemOperation } from "@guitos/operations/domain/itemOperation";
import type { MathOperation } from "@guitos/operations/domain/mathOperation";
import { CalculateButton } from "@guitos/sections/CalculateButton/CalculateButton";
import type { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { Datetime } from "@shared/domain/datetime";

interface ItemFormProps {
  itemForm: BudgetItem;
  costPercentage: number;
  label: string;
  inputRef: RefObject<HTMLInputElement | null>;
  userOptions: UserPreferences;
  intlConfig: IntlConfig;
}

export function ItemFormGroup({
  itemForm,
  costPercentage,
  inputRef,
  label,
  userOptions,
  intlConfig,
}: ItemFormProps) {
  const [needsRerender, setNeedsRerender] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { budget, setBudget } = useBudget();
  const isExpense = label === "Expenses";
  const table = isExpense ? budget?.expenses : budget?.incomes;

  async function handleCalcHist(operation: MathOperation, changeValue: number) {
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
    await commandBus.dispatch(
      new PersistOperationsCommand({
        id: calcHistID,
        operations: [
          new ItemOperation(
            calcHistID,
            newItemForm.id.toString(),
            changeValue,
            operation,
            new Datetime(),
          ).toPrimitives(),
        ],
      }),
    );
  }

  function handleChange(
    operation: MathOperation | "name" | "value",
    value?: string,
    event?: React.ChangeEvent<HTMLInputElement>,
    changeValue?: number,
  ) {
    if (!budget) return;
    if (!itemForm) return;

    let saveInHistory = false;
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: immer complicates breaking this into multiple functions
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
            newItemForm.value = parseLocaleNumber(
              value,
              userOptions.locale.value,
            );
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
          BudgetCalculator.itemsTotal(draft.expenses.items),
          2,
        );
      } else {
        draft.incomes.total = roundBig(
          BudgetCalculator.itemsTotal(draft.incomes.items),
          2,
        );
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

    setBudget(newState(), saveInHistory);
  }

  async function handleRemove(toBeDeleted: BudgetItem) {
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
      newTable.total = roundBig(BudgetCalculator.itemsTotal(newTable.items), 2);
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

    const calcHistID = `${budget.id}-${label}-${toBeDeleted.id}`;
    await commandBus.dispatch(
      new RemoveOperationsCommand({
        id: calcHistID,
      }),
    );
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
            // biome-ignore lint/complexity/noUselessFragments: react types need it
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
            // biome-ignore lint/complexity/noUselessFragments: react types need it
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
          intlConfig={intlConfig}
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
