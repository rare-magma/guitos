import { Stat } from "./Stat";
import {
  Card,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useState } from "react";
import {
  currencyCode,
  numberInputOnWheelPreventChange,
  userLang,
} from "../utils";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { BsPercent } from "react-icons/bs";

interface StatCardProps {
  stat: Stat;
  onChange: (stat: Stat) => void;
}

function StatCard({ stat: initialStat, onChange }: StatCardProps) {
  const [stat, setStat] = useState(initialStat);
  const [intlConfig] = useState<CurrencyInputProps["intlConfig"]>({
    locale: userLang,
    currency: currencyCode,
  });

  const handleInputChange = (item: React.ChangeEvent<HTMLInputElement>) => {
    let updatedStat: Stat;
    if (stat !== null) {
      updatedStat = stat;
      updatedStat.goal = item.target.valueAsNumber;
      setStat(updatedStat);
      onChange(updatedStat);
    }
  };

  function handleReserveChange(value: string | undefined): void {
    let updatedStat: Stat;
    if (stat !== null) {
      updatedStat = stat;
      updatedStat.reserves = Number(value);
      setStat(updatedStat);
      onChange(updatedStat);
    }
  }

  return (
    <Card className="stat-card">
      <Card.Header className="stat-card-header">Statistics</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={"stats"}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-available`}>= revenue - expenses</Tooltip>
            }
          >
            <InputGroup.Text>available</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="available"
            key={stat.available}
            className="text-right form-control"
            aria-label={"available"}
            name="available"
            intlConfig={intlConfig}
            disabled={true}
            defaultValue={stat.available}
          />
        </InputGroup>
        <InputGroup className="mb-1" key={"withGoal"}>
          <InputGroup.Text>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-return-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"
              />
            </svg>
          </InputGroup.Text>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-available`}>
                = available - savings estimate
              </Tooltip>
            }
          >
            <InputGroup.Text>with goal</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="with-goal"
            key={stat.withGoal}
            className="text-right form-control"
            aria-label={"with-goal"}
            name="with-goal"
            intlConfig={intlConfig}
            disabled={true}
            defaultValue={stat.withGoal}
          />
        </InputGroup>
        <InputGroup className="mb-1" key={"goal"}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-available`}>
                % of revenue that should go into savings
              </Tooltip>
            }
          >
            <InputGroup.Text>savings goal %</InputGroup.Text>
          </OverlayTrigger>
          <Form.Control
            className="text-right"
            aria-label={"goal"}
            key={"goal"}
            defaultValue={stat.goal}
            onChange={handleInputChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            onInput={(e) => {
              e.target.value = Number(
                Math.max(0, e.target.value).toString().slice(0, 2)
              );
            }}
          />
          <InputGroup.Text>
            <BsPercent />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"saved"}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-available`}>
                = savings goal * available / 100
              </Tooltip>
            }
          >
            <InputGroup.Text>savings estimate</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="saved"
            key={stat.saved}
            className="text-right form-control"
            aria-label={"saved"}
            name="saved"
            intlConfig={intlConfig}
            disabled={true}
            defaultValue={stat.saved}
          />
        </InputGroup>
        <InputGroup className="mb-1" key={"reserves"}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-available`}>emergency fund/cash</Tooltip>
            }
          >
            <InputGroup.Text>reserves</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="reserves"
            className="text-right form-control"
            aria-label={"reserves"}
            name="reserves"
            intlConfig={intlConfig}
            defaultValue={stat.reserves}
            maxLength={20}
            allowNegativeValue={false}
            onValueChange={(value) => handleReserveChange(value)}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
