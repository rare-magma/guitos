import { useBudget } from "@guitos/context/BudgetContext";
import { useConfig } from "@guitos/context/ConfigContext";
import type { BudgetItem } from "@guitos/domain/budgetItem";
import type {
  CalculationHistoryItem,
  ItemOperation,
} from "@guitos/domain/calculationHistoryItem";
import { useDB } from "@guitos/hooks/useDB";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  InputGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import {
  BsCheckLg,
  BsClockHistory,
  BsDashLg,
  BsPlusSlashMinus,
  BsXLg,
} from "react-icons/bs";
import { CgMathDivide, CgMathPlus } from "react-icons/cg";
import "./CalculateButton.css";

interface CalculateButtonProps {
  itemForm: BudgetItem;
  label: string;
  onCalculate: (changeValue: number, operation: ItemOperation) => void;
}

export function CalculateButton({
  itemForm,
  label,
  onCalculate,
}: CalculateButtonProps) {
  const [operation, setOperation] = useState<ItemOperation>("add");
  const [changeValue, setChangeValue] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const opButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { intlConfig } = useConfig();
  const { getCalcHist } = useDB();
  const { budget } = useBudget();
  const calcHistID = `${budget?.id}-${label}-${itemForm.id}`;

  function handleKeyPress(e: { key: string }) {
    if (e.key === "Enter") {
      handleCalculate();
      if (changeValue > 0) {
        opButtonRef?.current?.click();
      }
      setChangeValue(0);
    }
  }

  function handleCalculate() {
    if (changeValue > 0) {
      onCalculate(changeValue, operation);
      setShowHistory(false);
      getHistory();
    }
  }

  function handleHistory() {
    getHistory();
    setShowHistory(!showHistory);
  }

  const getHistory = useCallback(() => {
    getCalcHist(calcHistID)
      .then((h) => h && setHistory(h))
      .catch((e: unknown) => {
        throw e;
      });
  }, [calcHistID, getCalcHist]);

  useEffect(() => void getHistory(), [getHistory]);

  return (
    <OverlayTrigger
      trigger="click"
      key={`${itemForm.id}-${label}-calculate-button-overlay-trigger`}
      placement="top"
      rootClose={true}
      overlay={
        <Popover id={"popover-calculate-button"}>
          <Popover.Body>
            <InputGroup
              size="sm"
              className="mb-1"
              key={`${itemForm.id}-${label}-operation-group`}
            >
              <Button
                id={`item-${itemForm.id}-operation-history-button`}
                key={`${itemForm.id}-${label}-operation-history-button`}
                aria-label={"open operation history"}
                variant="outline-secondary"
                disabled={!(history.length > 0)}
                type="button"
                onClick={handleHistory}
              >
                <BsClockHistory aria-hidden={true} />
              </Button>
              <Dropdown>
                <Dropdown.Toggle
                  aria-label={"select type of operation on item value"}
                  aria-haspopup="true"
                  variant="outline-secondary"
                  id={useId()}
                >
                  {operation === "add" && <CgMathPlus aria-hidden={true} />}
                  {operation === "subtract" && <BsDashLg aria-hidden={true} />}
                  {operation === "multiply" && <BsXLg aria-hidden={true} />}
                  {operation === "divide" && (
                    <CgMathDivide aria-hidden={true} />
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    aria-label="addition"
                    onClick={() => setOperation("add")}
                  >
                    <CgMathPlus aria-hidden={true} />
                  </Dropdown.Item>
                  <Dropdown.Item
                    aria-label="subtraction"
                    onClick={() => setOperation("subtract")}
                  >
                    <BsDashLg aria-hidden={true} />
                  </Dropdown.Item>
                  <Dropdown.Item
                    aria-label="multiplication"
                    onClick={() => setOperation("multiply")}
                  >
                    <BsXLg aria-hidden={true} />
                  </Dropdown.Item>
                  <Dropdown.Item
                    aria-label="division"
                    onClick={() => setOperation("divide")}
                  >
                    <CgMathDivide aria-hidden={true} />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <CurrencyInput
                id={`${label}-${itemForm.id}-operation-value`}
                key={`item-${itemForm.id}-${label}-operation-value`}
                className="text-end form-control straight-corners fixed-width-font"
                aria-label={`${operation}`}
                name="item-operate-value"
                intlConfig={intlConfig}
                defaultValue={0}
                allowNegativeValue={false}
                maxLength={14}
                onKeyUp={handleKeyPress}
                ref={inputRef}
                onValueChange={(value) =>
                  setChangeValue(
                    Number.isNaN(Number(value)) ? 0 : Number(value),
                  )
                }
              />
              <Button
                id={`item-${itemForm.id}-trigger-operation-button`}
                key={`${itemForm.id}-${label}-trigger-operation-button`}
                aria-label={"apply change to item value"}
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  handleCalculate();
                  opButtonRef?.current?.click();
                }}
              >
                <BsCheckLg aria-hidden={true} />
              </Button>
            </InputGroup>
            {showHistory && (
              <div style={{ maxHeight: "30vh", overflow: "auto" }}>
                {history
                  .filter((i) => i.operation !== "value")
                  .map((item, index) => (
                    <InputGroup
                      size="sm"
                      className="mb-1"
                      key={`${item.id}-history-group-${index}`}
                    >
                      <CurrencyInput
                        id={`${label}-${itemForm.id}-${index}-history-value`}
                        key={`item-${itemForm.id}-${index}-${label}-history-value`}
                        className="text-end form-control straight-corners fixed-width-font"
                        aria-label={"item history value"}
                        name="item-history-value"
                        intlConfig={intlConfig}
                        defaultValue={item.itemForm.value}
                        disabled={true}
                      />
                      <InputGroup.Text>
                        {item.operation === "add" && (
                          <CgMathPlus aria-hidden={true} />
                        )}
                        {item.operation === "subtract" && (
                          <BsDashLg aria-hidden={true} />
                        )}
                        {item.operation === "multiply" && (
                          <BsXLg aria-hidden={true} />
                        )}
                        {item.operation === "divide" && (
                          <CgMathDivide aria-hidden={true} />
                        )}
                      </InputGroup.Text>
                      <CurrencyInput
                        id={`${label}-${itemForm.id}-${index}-history-changeValue`}
                        key={`item-${itemForm.id}-${index}-${label}-history-changeValue`}
                        className="text-end form-control straight-corners fixed-width-font"
                        aria-label={"item history change value"}
                        name="item-history-change-value"
                        intlConfig={intlConfig}
                        defaultValue={item.changeValue}
                        disabled={true}
                      />
                    </InputGroup>
                  ))
                  .toReversed()}
              </div>
            )}
          </Popover.Body>
        </Popover>
      }
    >
      <Button
        id={`${label}-${itemForm.id}-operate-button`}
        key={`${itemForm.id}-${label}-operate-button`}
        aria-label={"select operation type to item value"}
        aria-haspopup="dialog"
        variant="outline-secondary"
        type="button"
        ref={opButtonRef}
        onClick={() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
          getHistory();
        }}
      >
        <BsPlusSlashMinus aria-hidden={true} />
      </Button>
    </OverlayTrigger>
  );
}
