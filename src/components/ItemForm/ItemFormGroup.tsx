import { produce } from "immer";
import { RefObject, useRef, useState } from "react";
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
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { useDB } from "../../hooks/useDB";
import {
  calc,
  calcAvailable,
  calcSaved,
  calcTotal,
  calcWithGoal,
  parseLocaleNumber,
  roundBig,
} from "../../utils";
import {
  CalculateButton,
  ItemOperation,
} from "../CalculateButton/CalculateButton";
import { Expense } from "../TableCard/Expense";
import { Income } from "../TableCard/Income";
import { ItemForm } from "./ItemForm";
import "./ItemFormGroup.css";

interface ItemFormProps {
  itemForm: ItemForm;
  costPercentage: number;
  label: string;
  inputRef: RefObject<HTMLInputElement>;
}

export function ItemFormGroup({
  itemForm,
  costPercentage,
  inputRef,
  label,
}: ItemFormProps) {
  const [needsRerender, setNeedsRerender] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { budget, setBudget } = useBudget();
  const { deleteCalcHist, saveCalcHist } = useDB();
  const { intlConfig } = useConfig();
  const isExpense = label === "Expenses";
  const table = isExpense ? budget?.expenses : budget?.incomes;

  function handleCalcHist(
    operation: ItemOperation,
    changeValue: number | undefined,
  ) {
    if (!budget) return;
    const newItemForm = isExpense
      ? budget.expenses.items.find((item) => item.id === itemForm.id)
      : budget.incomes.items.find((item) => item.id === itemForm.id);
    if (!newItemForm) return;
    const calcHistID = `${budget.id}-${label}-${newItemForm.id}`;
    saveCalcHist(calcHistID, {
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
    const newState = produce((draft) => {
      const newItemForm = isExpense
        ? draft.expenses.items.find((item) => item.id === itemForm.id)
        : draft.incomes.items.find((item) => item.id === itemForm.id);
      if (!newItemForm) return;

      switch (operation) {
        case "name":
          if (event) newItemForm.name = event.target.value;
          break;
        case "value":
          if (value) {
            newItemForm.value = parseLocaleNumber(value, intlConfig?.locale);
          }
          break;
        default:
          if (changeValue) {
            newItemForm.value = calc(itemForm.value, changeValue, operation);
            saveInHistory = true;
          }
          setNeedsRerender(!needsRerender);
          handleCalcHist(operation, changeValue);
          break;
      }

      isExpense
        ? (draft.expenses.total = roundBig(calcTotal(draft.expenses.items), 2))
        : (draft.incomes.total = roundBig(calcTotal(draft.incomes.items), 2));
      draft.stats.available = roundBig(calcAvailable(draft), 2);
      draft.stats.withGoal = calcWithGoal(draft);
      draft.stats.saved = calcSaved(draft);
    }, budget);

    setBudget(newState(), saveInHistory);
  }

  function handleRemove(toBeDeleted: ItemForm) {
    if (!table?.items) return;
    if (!budget) return;

    const newTable = isExpense ? ({} as Expense) : ({} as Income);
    const newState = produce((draft) => {
      isExpense ? (draft.expenses = newTable) : (draft.incomes = newTable);
      newTable.items = table.items.filter((item) => item.id !== toBeDeleted.id);
      newTable.total = roundBig(calcTotal(newTable.items), 2);
      draft.stats.available = roundBig(calcAvailable(draft), 2);
      draft.stats.withGoal = calcWithGoal(draft);
      draft.stats.saved = calcSaved(draft);
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
          <Popover id={`popover-delete-button`}>
            <Popover.Body>
              <OverlayTrigger
                delay={250}
                placement="top"
                overlay={
                  <Tooltip
                    id={`tooltip-delete-itemformgroup`}
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
                  <BsXLg aria-hidden />
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
          <BsXLg aria-hidden />
        </Button>
      </OverlayTrigger>
    </InputGroup>
  );
}
