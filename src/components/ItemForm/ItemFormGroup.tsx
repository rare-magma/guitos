import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { ItemForm } from "./ItemForm";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { calc, parseLocaleNumber } from "../../utils";
import CalculateButton from "../CalculateButton/CalculateButton";

interface ItemFormProps {
  itemForm: ItemForm;
  costPercentage: number;
  intlConfig: CurrencyInputProps["intlConfig"];
  onChange: (itemForm: ItemForm) => void;
  onRemove: (itemForm: ItemForm) => void;
}

function ItemFormGroup({
  itemForm: initialItemForm,
  costPercentage,
  intlConfig,
  onRemove,
  onChange,
}: ItemFormProps) {
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [showOverlay, setShowOverlay] = useState(false);
  const [changed, setChanged] = useState(false);
  const handleRemove = (item: ItemForm) => {
    onRemove(item);
  };

  const handleChange = (
    operation: string,
    value?: string,
    event?: React.ChangeEvent<HTMLInputElement>,
    changeValue?: number
  ) => {
    let newItemForm: ItemForm;
    if (itemForm !== null) {
      newItemForm = itemForm;

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
          }
          setChanged(!changed);
          break;
      }
      setItemForm(newItemForm);
      onChange(newItemForm);
    }
  };

  function handleShow(): void {
    setShowOverlay(!showOverlay);
  }

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === "Escape") {
        setShowOverlay(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <InputGroup size="sm" className="mb-1" key={itemForm.id + "-group"}>
      <OverlayTrigger
        delay={250}
        placement="top"
        overlay={
          costPercentage > 0 ? (
            <Tooltip
              id={`tooltip-value-${itemForm.id}`}
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
          id={"item-" + itemForm.id + "-name"}
          aria-label={"item-name"}
          key={itemForm.id + "-name"}
          autoFocus
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
              id={`tooltip-value-${itemForm.id}`}
              style={{ position: "fixed" }}
            >
              {costPercentage}% of revenue
            </Tooltip>
          ) : (
            <></>
          )
        }
      >
        <Col xs="4">
          <CurrencyInput
            id={"item-" + itemForm.id + "-value"}
            key={itemForm.id + "-value-" + changed}
            className="text-right form-control straight-corners"
            aria-label={"item-value"}
            name="item-value"
            intlConfig={intlConfig}
            defaultValue={itemForm.value}
            allowNegativeValue={false}
            maxLength={14}
            onValueChange={(value) => handleChange("value", value)}
          />
        </Col>
      </OverlayTrigger>
      <CalculateButton
        show={showOverlay}
        itemForm={itemForm}
        intlConfig={intlConfig}
        onCalculate={(changeValue, operation) =>
          handleChange(operation, "", undefined, changeValue)
        }
        onShow={handleShow}
      />
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
          id={"item-" + itemForm.id + "-button"}
          aria-label="delete item"
          key={itemForm.id + "button"}
          variant="delete"
          type="button"
          onClick={() => {
            handleRemove(itemForm);
          }}
        >
          <BsXLg />
        </Button>
      </OverlayTrigger>
    </InputGroup>
  );
}

export default ItemFormGroup;
