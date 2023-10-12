import { useRef, useState } from "react";
import {
  Button,
  Dropdown,
  InputGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import { BsCheckLg, BsDashLg, BsPlusSlashMinus, BsXLg } from "react-icons/bs";
import { CgMathDivide, CgMathPlus } from "react-icons/cg";
import { useConfig } from "../../context/ConfigContext";
import { ItemForm } from "../ItemForm/ItemForm";
import "./CalculateButton.css";

interface CalculateButtonProps {
  itemForm: ItemForm;
  label: string;
  onCalculate: (changeValue: number, operation: string) => void;
}

function CalculateButton({
  itemForm,
  label,
  onCalculate,
}: CalculateButtonProps) {
  const [operation, setOperation] = useState("add");
  const [changeValue, setChangeValue] = useState(0);
  const opButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { intlConfig } = useConfig();

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
    }
  }

  return (
    <>
      <OverlayTrigger
        trigger="click"
        key="top"
        placement="top"
        rootClose={true}
        overlay={
          <Popover id={`popover-calculate-button`}>
            <Popover.Body>
              <InputGroup
                size="sm"
                className="mb-1"
                key={`${itemForm.id}-operation-group`}
              >
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
                  key={`item-${itemForm.id}-operation-value`}
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
                  key={`${itemForm.id}-trigger-operation-button`}
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
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          id={`${label}-${itemForm.id}-operate-button`}
          key={`${itemForm.id}-operate-button`}
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

export default CalculateButton;
