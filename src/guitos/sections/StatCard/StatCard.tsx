import { produce } from "immer";
import type React from "react";
import { useEffect, useRef, useState } from "react";
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
import {
  BsArrowReturnRight,
  BsGear,
  BsGraphUp,
  BsPercent,
} from "react-icons/bs";
import "./StatCard.css";
import { BudgetCalculator } from "@guitos/application/react/budgetCalculator";
import { useBudget } from "@guitos/application/react/context/BudgetContext";
import { useConfig } from "@guitos/application/react/context/ConfigContext";
import type { Budget } from "@guitos/contexts/budget/domain/budget";
import {
  focusRef,
  parseLocaleNumber,
  roundBig,
} from "../../application/react/utils";

interface StatCardProps {
  onShowGraphs: () => void;
}

export function StatCard({ onShowGraphs }: StatCardProps) {
  const { userOptions, intlConfig } = useConfig();
  const { revenuePercentage, budget, setBudget } = useBudget();
  const stat = budget?.stats;
  const [autoGoal, setAutoGoal] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const shouldCalculateAvailablePerc =
    revenuePercentage <= 100 && stat && stat.available > 0;

  const goalRef = useRef<HTMLInputElement>(null);
  const reservesRef = useRef<HTMLInputElement>(null);

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
        draft.stats.available = roundBig(
          BudgetCalculator.available(draft as Budget),
          2,
        );
        draft.stats.withGoal = BudgetCalculator.availableWithGoal(
          draft as Budget,
        );
        draft.stats.saved = BudgetCalculator.saved(draft as Budget);
      }, budget);
      setBudget(newState(), false);
    }
  }

  function handleReserveChange(value: string | undefined): void {
    if (budget && value) {
      const newState = produce((draft) => {
        draft.stats.reserves = parseLocaleNumber(
          value,
          userOptions?.locale.value,
        );
      }, budget);
      setBudget(newState(), false);
    }
  }

  function handleAutoGoal() {
    if (budget && stat) {
      const newState = produce((draft) => {
        draft.stats.goal = BudgetCalculator.automaticGoal(draft as Budget);
        draft.stats.available = roundBig(
          BudgetCalculator.available(draft as Budget),
          2,
        );
        draft.stats.withGoal = BudgetCalculator.availableWithGoal(
          draft as Budget,
        );
        draft.stats.saved = BudgetCalculator.saved(draft as Budget);
      }, budget);
      setBudget(newState(), true);
    }
    setAutoGoal(true);
  }

  // workaround for https://github.com/react-bootstrap/react-bootstrap/pull/6739
  useEffect(() => {
    const innerBar = progressBarRef.current?.querySelector(".progress-bar");
    if (innerBar) {
      innerBar.setAttribute("aria-label", "percentage of revenue spent");
    }
  }, []);

  return (
    <Card
      className="stat-card"
      key={`stat-${userOptions?.currency}-${budget?.expenses.total} + ${budget?.incomes.total}}`}
    >
      <Card.Header className="stat-card-header py-0">
        <Row className="mb-1">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip
                id={"tooltip-value-statistics-bar"}
                style={{ position: "fixed" }}
              >
                {revenuePercentage}% of revenue spent
              </Tooltip>
            }
          >
            <Col className="align-self-center">
              Statistics
              <ProgressBar
                ref={progressBarRef}
                role="progressbar"
                aria-label="percentage of revenue spent"
                aria-valuetext={`${revenuePercentage}%`}
                min={0}
                max={100}
                now={revenuePercentage}
                visuallyHidden={true}
              />
            </Col>
          </OverlayTrigger>
          <Col xs="auto" className="text-end">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={"tooltip-graphs"} style={{ position: "fixed" }}>
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
                <BsGraphUp aria-hidden={true} />
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
              <Tooltip id={"tooltip-available"} style={{ position: "fixed" }}>
                = revenue - expenses
              </Tooltip>
            }
          >
            <InputGroup.Text>available</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
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
                id={"tooltip-value-available-perc"}
                style={{ position: "fixed" }}
              >
                % of revenue available
              </Tooltip>
            }
          >
            <InputGroup.Text aria-label="percentage of revenue available">
              {shouldCalculateAvailablePerc ? 100 - revenuePercentage : 0}
              <BsPercent aria-hidden={true} />
            </InputGroup.Text>
          </OverlayTrigger>
        </InputGroup>
        <InputGroup className="mb-1" key={"withGoal"}>
          <InputGroup.Text>
            <BsArrowReturnRight aria-hidden={true} />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={"tooltip-available"} style={{ position: "fixed" }}>
                  available with goal = available - savings estimate
                </Tooltip>
              }
            >
              <div style={{ marginLeft: ".5rem" }}>with goal</div>
            </OverlayTrigger>
          </InputGroup.Text>
          <CurrencyInput
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
              <Tooltip id={"tooltip-available"} style={{ position: "fixed" }}>
                % of revenue that should go into savings
              </Tooltip>
            }
          >
            <InputGroup.Text>savings goal</InputGroup.Text>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={"tooltip-auto-goal"} style={{ position: "fixed" }}>
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
              <BsGear aria-hidden={true} />
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
            <BsPercent aria-hidden={true} />
          </InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"saved"}>
          <InputGroup.Text>
            <BsArrowReturnRight aria-hidden={true} />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={"tooltip-available"} style={{ position: "fixed" }}>
                  savings estimate = savings goal * available / 100
                </Tooltip>
              }
            >
              <div style={{ marginLeft: ".5rem" }}>estimate</div>
            </OverlayTrigger>
          </InputGroup.Text>
          <CurrencyInput
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
              <Tooltip id={"tooltip-available"} style={{ position: "fixed" }}>
                emergency fund/cash
              </Tooltip>
            }
          >
            <InputGroup.Text>reserves</InputGroup.Text>
          </OverlayTrigger>
          <CurrencyInput
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
