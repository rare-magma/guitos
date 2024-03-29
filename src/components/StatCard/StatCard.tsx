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

import { produce } from "immer";
import {
  BsArrowReturnRight,
  BsGear,
  BsGraphUp,
  BsPercent,
} from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import {
  calcAutoGoal,
  calcAvailable,
  calcSaved,
  calcWithGoal,
  focusRef,
  parseLocaleNumber,
  roundBig,
} from "../../utils";
import "./StatCard.css";

interface StatCardProps {
  onShowGraphs: () => void;
}

export function StatCard({ onShowGraphs }: StatCardProps) {
  const { intlConfig } = useConfig();
  const { revenuePercentage, budget, setBudget } = useBudget();
  const stat = budget?.stats;
  const [autoGoal, setAutoGoal] = useState(false);

  const shouldCalculateAvailablePerc =
    revenuePercentage <= 100 && stat && stat.available > 0;

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
    if (budget && item) {
      setAutoGoal(false);
      const newState = produce((draft) => {
        draft.stats.goal = item.target.valueAsNumber;
        draft.stats.available = roundBig(calcAvailable(draft), 2);
        draft.stats.withGoal = calcWithGoal(draft);
        draft.stats.saved = calcSaved(draft);
      }, budget);
      setBudget(newState(), false);
    }
  }

  function handleReserveChange(value: string | undefined): void {
    if (budget && value) {
      const newState = produce((draft) => {
        draft.stats.reserves = parseLocaleNumber(value, intlConfig?.locale);
      }, budget);
      setBudget(newState(), false);
    }
  }

  function handleAutoGoal() {
    if (budget && stat) {
      const newState = produce((draft) => {
        draft.stats.goal = calcAutoGoal(draft);
        draft.stats.available = roundBig(calcAvailable(draft), 2);
        draft.stats.withGoal = calcWithGoal(draft);
        draft.stats.saved = calcSaved(draft);
      }, budget);
      setBudget(newState(), true);
    }
    setAutoGoal(true);
  }

  return (
    <Card
      className="stat-card"
      key={`stat-${intlConfig?.currency}-${budget?.expenses.total} + ${budget?.incomes.total}}`}
    >
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
                role="progressbar"
                aria-label="percentage of revenue spent"
                aria-valuetext={`${revenuePercentage}%`}
                min={0}
                max={100}
                now={revenuePercentage}
                label={`${revenuePercentage}%`}
                visuallyHidden
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
                onClick={() => onShowGraphs()}
              >
                <BsGraphUp aria-hidden />
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
            <InputGroup.Text aria-label="percentage of revenue available">
              {shouldCalculateAvailablePerc ? 100 - revenuePercentage : 0}
              <BsPercent aria-hidden />
            </InputGroup.Text>
          </OverlayTrigger>
        </InputGroup>
        <InputGroup className="mb-1" key={"withGoal"}>
          <InputGroup.Text>
            <BsArrowReturnRight aria-hidden />
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
              onClick={handleAutoGoal}
            >
              <BsGear aria-hidden />
            </Button>
          </OverlayTrigger>
          <Form.Control
            id="goal-input"
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
            <BsPercent aria-hidden />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"saved"}>
          <InputGroup.Text>
            <BsArrowReturnRight aria-hidden />
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
            key={"reserves-input"}
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
