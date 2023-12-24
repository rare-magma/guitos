import { useEffect, useRef, useState } from "react";
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
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { useDB } from "../../hooks/useDB";
import { ItemForm } from "../ItemForm/ItemForm";
import "./CalculateButton.css";

interface CalculateButtonProps {
  itemForm: ItemForm;
  label: string;
  onCalculate: (changeValue: number, operation: ItemOperation) => void;
}

export type ItemOperation =
  | "name"
  | "value"
  | "add"
  | "subtract"
  | "multiply"
  | "divide";

export interface CalculationHistoryItem {
  id: string;
  itemForm: ItemForm;
  changeValue: number | undefined;
  operation: ItemOperation;
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

  function getHistory() {
    getCalcHist(calcHistID)
      .then((h) => setHistory(h))
      .catch((e: unknown) => {
        throw e;
      });
  }

  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHistory]);

  return (
    <>
      <OverlayTrigger
        trigger="click"
        key={`${itemForm.id}-${label}-calculate-button-overlay-trigger`}
        placement="top"
        rootClose={true}
        overlay={
          <Popover id={`popover-calculate-button`}>
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
                  disabled={history.length > 0 ? false : true}
                  type="button"
                  onClick={handleHistory}
                >
                  <BsClockHistory aria-hidden />
                </Button>
                <Dropdown>
                  <Dropdown.Toggle
                    aria-label={"select type of operation on item value"}
                    aria-haspopup="true"
                    variant="outline-secondary"
                    id="dropdown-operation"
                  >
                    {operation === "add" && <CgMathPlus aria-hidden />}
                    {operation === "subtract" && <BsDashLg aria-hidden />}
                    {operation === "multiply" && <BsXLg aria-hidden />}
                    {operation === "divide" && <CgMathDivide aria-hidden />}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      aria-label="addition"
                      onClick={() => setOperation("add")}
                    >
                      <CgMathPlus aria-hidden />
                    </Dropdown.Item>
                    <Dropdown.Item
                      aria-label="subtraction"
                      onClick={() => setOperation("subtract")}
                    >
                      <BsDashLg aria-hidden />
                    </Dropdown.Item>
                    <Dropdown.Item
                      aria-label="multiplication"
                      onClick={() => setOperation("multiply")}
                    >
                      <BsXLg aria-hidden />
                    </Dropdown.Item>
                    <Dropdown.Item
                      aria-label="division"
                      onClick={() => setOperation("divide")}
                    >
                      <CgMathDivide aria-hidden />
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
                    setChangeValue(isNaN(Number(value)) ? 0 : Number(value))
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
                  <BsCheckLg aria-hidden />
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
                            <CgMathPlus aria-hidden />
                          )}
                          {item.operation === "subtract" && (
                            <BsDashLg aria-hidden />
                          )}
                          {item.operation === "multiply" && (
                            <BsXLg aria-hidden />
                          )}
                          {item.operation === "divide" && (
                            <CgMathDivide aria-hidden />
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
                    .reverse()}
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
          }}
        >
          <BsPlusSlashMinus aria-hidden />
        </Button>
      </OverlayTrigger>
    </>
  );
}
