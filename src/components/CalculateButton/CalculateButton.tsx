import {
  Button,
  Dropdown,
  InputGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { BsDashLg, BsXLg, BsCheckLg, BsPlusSlashMinus } from "react-icons/bs";
import { CgMathPlus, CgMathDivide } from "react-icons/cg";
import { ItemForm } from "../ItemForm/ItemForm";
import { useState } from "react";

interface CalculateButtonProps {
  itemForm: ItemForm;
  intlConfig: CurrencyInputProps["intlConfig"];
  onCalculate: (changeValue: number, operation: string) => void;
  onShow: () => void;
}

function CalculateButton({
  itemForm,
  intlConfig,
  onCalculate,
  onShow,
}: CalculateButtonProps) {
  const [operation, setOperation] = useState("add");
  const [changeValue, setChangeValue] = useState(0);

  const handleCalculate = (itemForm: ItemForm) => {
    if (changeValue > 0) {
      onCalculate(changeValue, operation);
    }
    onShow();
  };

  const handleShow = () => {
    onShow();
  };

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
                key={itemForm.id + "-operation-group"}
              >
                <Dropdown>
                  <Dropdown.Toggle
                    aria-label={"select type of operation on item value"}
                    aria-haspopup="true"
                    variant="outline-secondary"
                    id="dropdown-operation"
                  >
                    {operation === "add" && <CgMathPlus />}
                    {operation === "sub" && <BsDashLg />}
                    {operation === "mul" && <BsXLg />}
                    {operation === "div" && <CgMathDivide />}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      aria-label="add to item value"
                      onClick={() => setOperation("add")}
                    >
                      <CgMathPlus />
                    </Dropdown.Item>
                    <Dropdown.Item
                      aria-label="subtract to item value"
                      onClick={() => setOperation("sub")}
                    >
                      <BsDashLg />
                    </Dropdown.Item>
                    <Dropdown.Item
                      aria-label="multiply item value"
                      onClick={() => setOperation("mul")}
                    >
                      <BsXLg />
                    </Dropdown.Item>
                    <Dropdown.Item
                      aria-label="divide item value"
                      onClick={() => setOperation("div")}
                    >
                      <CgMathDivide />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <CurrencyInput
                  id={"item-" + itemForm.id + "-operation-value"}
                  key={itemForm.id + "operation-value"}
                  className="text-right form-control straight-corners"
                  aria-label={"change item value amount"}
                  name="item-operate-value"
                  autoFocus
                  intlConfig={intlConfig}
                  defaultValue={0}
                  allowNegativeValue={false}
                  maxLength={14}
                  onValueChange={(value) =>
                    setChangeValue(isNaN(Number(value)) ? 0 : Number(value))
                  }
                />
                <Button
                  id={"item-" + itemForm.id + "-trigger-operation-button"}
                  key={itemForm.id + "-trigger-operation-button"}
                  aria-label={"accept change item value amount"}
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    handleCalculate(itemForm);
                  }}
                >
                  <BsCheckLg />
                </Button>
              </InputGroup>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          id={"item-" + itemForm.id + "operate-button"}
          key={itemForm.id + "-operate-button"}
          aria-label={"select operations to change item value amount"}
          aria-haspopup="dialog"
          variant="outline-secondary"
          type="button"
          onClick={() => {
            handleShow();
          }}
        >
          <BsPlusSlashMinus />
        </Button>
      </OverlayTrigger>
    </>
  );
}

export default CalculateButton;
