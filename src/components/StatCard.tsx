import { Stat } from "./Stat";
import { Card, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { numberInputOnWheelPreventChange } from "../utils";
import { BsCurrencyEuro, BsPercent } from "react-icons/bs";

interface StatCardProps {
  stat: Stat;
  onChange: (stat: Stat) => void;
}

function StatCard({ stat: initialStat, onChange }: StatCardProps) {
  const [stat, setStat] = useState(initialStat);

  const handleChange = (item: React.ChangeEvent<HTMLInputElement>) => {
    let updatedStat: Stat;
    if (stat !== null) {
      updatedStat = stat;
      if (item.target.ariaLabel === "reserves") {
        updatedStat.reserves = item.target.valueAsNumber;
      } else {
        updatedStat.goal = item.target.valueAsNumber;
      }
      setStat(updatedStat);
      onChange(updatedStat);
    }
  };

  return (
    <Card className="stat-card">
      <Card.Header className="stat-card-header">Statistics</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={"stats"}>
          <InputGroup.Text>available</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"available"}
            key={"available"}
            value={stat.available}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>
            <BsCurrencyEuro />
          </InputGroup.Text>
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
          <InputGroup.Text>with goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"withGoal"}
            key={"withGoal"}
            value={stat.withGoal}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>
            <BsCurrencyEuro />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"goal"}>
          <InputGroup.Text>savings goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"goal"}
            key={"goal"}
            defaultValue={stat.goal}
            onChange={handleChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            maxLength={2}
            max={100}
          />
          <InputGroup.Text>
            <BsPercent />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"saved"}>
          <InputGroup.Text>savings estimate</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"saved"}
            key={"saved"}
            value={stat.saved}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>
            <BsCurrencyEuro />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"reserves"}>
          <InputGroup.Text>reserves</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"reserves"}
            key={"reserves"}
            value={stat.reserves}
            onChange={handleChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            maxLength={2}
            max={100}
          />
          <InputGroup.Text>
            <BsCurrencyEuro />
          </InputGroup.Text>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
