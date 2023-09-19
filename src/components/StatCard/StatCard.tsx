import { useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  ProgressBar,
  Row,
  Tooltip,
} from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import { useHotkeys } from "react-hotkeys-hook";
import { BsGear, BsGraphUp, BsPercent } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { focusRef, parseLocaleNumber } from "../../utils";
import { Stat } from "./Stat";

interface StatCardProps {
  onChange: (stat: Stat | undefined) => void;
  onAutoGoal: (stat: Stat | undefined) => void;
  onShowGraphs: () => void;
}

function StatCard({ onChange, onAutoGoal, onShowGraphs }: StatCardProps) {
  const { intlConfig } = useConfig();
  const { revenuePercentage, budget } = useBudget();

  const [stat, setStat] = useState(budget?.stats);
  const [autoGoal, setAutoGoal] = useState(false);

  const goalRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const reservesRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  useHotkeys("g", (e) => !e.repeat && focusRef(goalRef), {
    preventDefault: true,
  });
  useHotkeys("e", (e) => !e.repeat && focusRef(reservesRef), {
    preventDefault: true,
  });

  function handleInputChange(item: React.ChangeEvent<HTMLInputElement>) {
    let updatedStat: Stat;
    if (stat) {
      updatedStat = stat;
      updatedStat.goal = item.target.valueAsNumber;
      setStat(updatedStat);
      setAutoGoal(false);
      onChange(updatedStat);
    }
  }

  function handleReserveChange(value: string | undefined): void {
    let updatedStat: Stat;
    if (stat && value) {
      updatedStat = stat;
      updatedStat.reserves = parseLocaleNumber(value, intlConfig?.locale);
      setStat(updatedStat);
      onChange(updatedStat);
    }
  }

  function handleAutoGoal() {
    onAutoGoal(stat);
    setAutoGoal(true);
  }

  function handleShowGraphs() {
    onShowGraphs();
  }

  return (
    <Card className="stat-card" key={`stat-${intlConfig?.currency}`}>
      <Card.Header className="stat-card-header py-0">
        <Row className="mb-1">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip
                id={`tooltip-value-statistics-bar`}
                style={{ position: "fixed" }}
              >
                {revenuePercentage}% of revenue spent
              </Tooltip>
            }
          >
            <Col className="align-self-center">
              Statistics
              <ProgressBar
                min={0}
                max={100}
                now={revenuePercentage}
                label={`${revenuePercentage}%`}
                visuallyHidden
                style={{ height: "3px" }}
              />
            </Col>
          </OverlayTrigger>
          <Col xs="auto" className="text-end">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-graphs`} style={{ position: "fixed" }}>
                  open charts view
                </Tooltip>
              }
            >
              <Button
                aria-label="open charts view"
                className="my-1"
                size="sm"
                variant="outline-primary"
                style={{ color: "var(--textcolor)" }}
                onClick={() => {
                  handleShowGraphs();
                }}
              >
                <BsGraphUp />
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Card.Header>
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
            key={`${stat?.available}-available`}
            className="text-end form-control fixed-width-font"
            aria-label={"available"}
            name="available"
            intlConfig={intlConfig}
            disabled={true}
            defaultValue={stat?.available}
          />
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip
                id={`tooltip-value-available-perc`}
                style={{ position: "fixed" }}
              >
                % of revenue available
              </Tooltip>
            }
          >
            <InputGroup.Text>
              {revenuePercentage <= 100 && stat && stat.available > 0
                ? 100 - revenuePercentage
                : 0}

              <BsPercent />
            </InputGroup.Text>
          </OverlayTrigger>
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
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                  available with goal = available - savings estimate
                </Tooltip>
              }
            >
              <div style={{ marginLeft: ".5rem" }}>with goal</div>
            </OverlayTrigger>
          </InputGroup.Text>
          <CurrencyInput
            id="with-goal"
            key={`${stat?.withGoal}-withGoal`}
            className="text-end form-control fixed-width-font"
            aria-label={"with-goal"}
            name="with-goal"
            intlConfig={intlConfig}
            disabled={true}
            defaultValue={stat?.withGoal}
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
            className="text-end fixed-width-font"
            aria-label={"goal"}
            key={`auto-goal-${autoGoal}`}
            defaultValue={stat?.goal}
            onChange={handleInputChange}
            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
            type="number"
            ref={goalRef}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.valueAsNumber = Number(
                Math.max(0, Number(e.target.value)).toString().slice(0, 2),
              );
            }}
          />
          <InputGroup.Text>
            <BsPercent />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"saved"}>
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
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-available`} style={{ position: "fixed" }}>
                  savings estimate = savings goal * available / 100
                </Tooltip>
              }
            >
              <div style={{ marginLeft: ".5rem" }}>estimate</div>
            </OverlayTrigger>
          </InputGroup.Text>
          <CurrencyInput
            id="saved"
            key={`${stat?.saved}-saved`}
            className="text-end form-control fixed-width-font"
            aria-label={"saved"}
            name="saved"
            intlConfig={intlConfig}
            disabled={true}
            defaultValue={stat?.saved}
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
            key={"reserves"}
            className="text-end form-control fixed-width-font"
            aria-label={"reserves"}
            name="reserves"
            intlConfig={intlConfig}
            defaultValue={stat?.reserves}
            maxLength={14}
            allowNegativeValue={false}
            ref={reservesRef}
            onFocus={() => {
              reservesRef.current?.setSelectionRange(0, 25);
            }}
            onValueChange={(value) => handleReserveChange(value)}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
