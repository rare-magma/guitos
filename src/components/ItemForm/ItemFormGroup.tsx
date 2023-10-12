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
import { useConfig } from "../../context/ConfigContext";
import { calc, parseLocaleNumber } from "../../utils";
import CalculateButton from "../CalculateButton/CalculateButton";
import { ItemForm } from "./ItemForm";
import "./ItemFormGroup.css";

interface ItemFormProps {
  itemForm: ItemForm;
  costPercentage: number;
  label: string;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (itemForm: ItemForm) => void;
  onRemove: (itemForm: ItemForm) => void;
}

function ItemFormGroup({
  itemForm: initialItemForm,
  costPercentage,
  inputRef,
  label,
  onRemove,
  onChange,
}: ItemFormProps) {
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [changed, setChanged] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { intlConfig } = useConfig();

  function handleRemove(item: ItemForm) {
    onRemove(item);
  }

  function handleChange(
    operation: string,
    value?: string,
    event?: React.ChangeEvent<HTMLInputElement>,
    changeValue?: number,
  ) {
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
  }

  return (
    <InputGroup size="sm" className="mb-1" key={`${itemForm.id}-group`}>
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
          id={`${label}-${itemForm.id}-name`}
          aria-label={`item ${itemForm.id} name`}
          key={`${itemForm.id}-name`}
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
        <CurrencyInput
          id={`${label}-${itemForm.id}-value`}
          key={`${itemForm.id}"-value-${changed}`}
          className="text-end form-control straight-corners fixed-width-font"
          aria-label={`item ${itemForm.id} value`}
          name="item-value"
          intlConfig={intlConfig}
          defaultValue={itemForm.value}
          allowNegativeValue={false}
          maxLength={14}
          ref={valueRef}
          onFocus={() => {
            valueRef.current?.setSelectionRange(0, 25);
          }}
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
        key="top"
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
                  key={`${itemForm.id}-delete-confirmation-button`}
                  variant="delete"
                  type="button"
                  size="sm"
                  ref={deleteButtonRef}
                  onClick={() => {
                    handleRemove(itemForm);
                  }}
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
          key={`${itemForm.id}-button`}
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

export default ItemFormGroup;
