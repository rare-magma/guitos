import { Stat } from "./Stat";
import {
  Button,
  Card,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useRef, useState } from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { BsGear, BsPercent } from "react-icons/bs";
import { useHotkeys } from "react-hotkeys-hook";
import { focusRef, numberInputOnWheelPreventChange } from "../../utils";

interface StatCardProps {
  stat: Stat;
  intlConfig: CurrencyInputProps["intlConfig"];
  onChange: (stat: Stat) => void;
  onAutoGoal: (stat: Stat) => void;
}

function StatCard({
  stat: initialStat,
  intlConfig,
  onChange,
  onAutoGoal,
}: StatCardProps) {
  const [stat, setStat] = useState(initialStat);
  const [autoGoal, setAutoGoal] = useState(false);

  const goalRef = useRef<HTMLInputElement>();
  const reservesRef = useRef<HTMLInputElement>();

  useHotkeys("g", () => focusRef(goalRef), { preventDefault: true });
  useHotkeys("e", () => focusRef(reservesRef), { preventDefault: true });

  const handleInputChange = (item: React.ChangeEvent<HTMLInputElement>) => {
    let updatedStat: Stat;
    if (stat !== null) {
      updatedStat = stat;
      updatedStat.goal = item.target.valueAsNumber;
      setStat(updatedStat);
      setAutoGoal(false);
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

  const handleAutoGoal = () => {
    onAutoGoal(stat);
    setAutoGoal(true);
  };

  return (
    <Card className="stat-card" key={"stat-" + intlConfig?.currency}>
      <Card.Header className="stat-card-header">Statistics</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={"stats"}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                = revenue - expenses
              </Tooltip>
            }
          >
            <InputGroup.Text>available</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="available"
            key={stat.available + "-available"}
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
              <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                = available - savings estimate
              </Tooltip>
            }
          >
            <InputGroup.Text>with goal</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="with-goal"
            key={stat.withGoal + "-withGoal"}
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
              <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                % of revenue that should go into savings
              </Tooltip>
            }
          >
            <InputGroup.Text>savings goal</InputGroup.Text>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-auto-goal`} style={{ position: "fixed" }}>
                estimate savings goal
              </Tooltip>
            }
          >
            <Button
              aria-label="calculate savings goal"
              variant="outline-primary"
              className="input-group-text auto-goal"
              style={{ color: "var(--textcolor)" }}
              onClick={() => {
                handleAutoGoal();
              }}
            >
              <BsGear />
            </Button>
          </OverlayTrigger>
          <Form.Control
            data-testid="goal-input"
            className="text-right"
            aria-label={"goal"}
            key={"auto-goal-" + autoGoal}
            defaultValue={stat.goal}
            onChange={handleInputChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            ref={goalRef}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.valueAsNumber = Number(
                Math.max(0, Number(e.target.value)).toString().slice(0, 2)
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
              <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                = savings goal * available / 100
              </Tooltip>
            }
          >
            <InputGroup.Text>savings estimate</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="saved"
            key={stat.saved + "-saved"}
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
              <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                emergency fund/cash
              </Tooltip>
            }
          >
            <InputGroup.Text>reserves</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
            id="reserves"
            key={stat.reserves + "-reserves"}
            className="text-right form-control"
            aria-label={"reserves"}
            name="reserves"
            intlConfig={intlConfig}
            defaultValue={stat.reserves}
            maxLength={14}
            allowNegativeValue={false}
            ref={reservesRef}
            onValueChange={(value) => handleReserveChange(value)}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
