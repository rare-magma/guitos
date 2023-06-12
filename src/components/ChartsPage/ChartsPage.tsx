import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { Budget } from "../Budget/Budget";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { BsArrowLeft, BsPercent } from "react-icons/bs";
import { intlFormat, median, roundBig } from "../../utils";
import { NavBarItem } from "../NavBar/NavBarItem";
import { useHotkeys } from "react-hotkeys-hook";
import Big from "big.js";

interface GraphProps {
  budgetList: Budget[];
  intlConfig: CurrencyInputProps["intlConfig"];
  currency: string;
  onShowGraphs: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: [{ name: string; value: number; unit: string }];
  label?: string;
  name1?: string;
  name2?: string;
}

function ChartsPage({
  budgetList,
  currency,
  intlConfig,
  onShowGraphs,
}: GraphProps) {
  useHotkeys("i", () => onShowGraphs(), {
    preventDefault: true,
  });

  const tickFormatter = (value: number, index: number) => {
    return intlFormat(value, intlConfig?.currency as string);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
    name1,
    name2,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Container className="m-2">
          <Row>{label}</Row>
          {payload.length > 1 ? (
            <>
              <Row>
                <Col>{`${name1 || ""}:`}</Col>
                <Col className="text-right">
                  {`${intlFormat(
                    roundBig(Big(payload[0].value), 2),
                    intlConfig?.currency as string
                  )}`}
                </Col>
              </Row>
              <Row>
                <Col>{`${name2 || ""}:`}</Col>
                <Col className="text-right">
                  {intlFormat(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    roundBig(Big(payload[1].value), 2),
                    intlConfig?.currency as string
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <Row>
              <Col>{`${name1 || ""}:`}</Col>
              {name1 === "goal" ? (
                <Col className="text-right">{`${payload[0].value}%`}</Col>
              ) : (
                <Col className="text-right">
                  {`${intlFormat(
                    roundBig(Big(payload[0].value), 2),
                    intlConfig?.currency as string
                  )}`}
                </Col>
              )}
            </Row>
          )}
        </Container>
      );
    }

    return null;
  };

  const handleShowGraphs = () => {
    onShowGraphs();
  };

  return (
    <Container className="mb-3">
      <OverlayTrigger
        delay={250}
        placement="bottom"
        overlay={
          <Tooltip id={"tooltip-go-to-budgets"} style={{ position: "fixed" }}>
            go back to budgets
          </Tooltip>
        }
      >
        <Button
          className="me-1 mb-1 mt-3"
          aria-label={"go back to budgets"}
          variant={"Expenses-plus-button"}
          onClick={handleShowGraphs}
        >
          <BsArrowLeft />
        </Button>
      </OverlayTrigger>

      <Card className="stat-card mt-3">
        <Card.Header className="stat-card-header">
          Revenue vs expenses
        </Card.Header>
        <Card.Body>
          <ResponsiveContainer
            width="100%"
            aspect={window.innerWidth < window.innerHeight ? 1.6 : 3.4}
          >
            <AreaChart
              data={budgetList}
              margin={{
                top: 10,
                right: 0,
                left: 20,
                bottom: 0,
              }}
            >
              <XAxis stroke="var(--textcolor)" dataKey="name" minTickGap={10} />
              <YAxis stroke="var(--textcolor)" tickFormatter={tickFormatter} />
              <ReTooltip
                content={<CustomTooltip name1="revenue" name2="expenses" />}
                contentStyle={{ backgroundColor: "var(--bgcolor)" }}
                itemStyle={{ color: "var(--textcolor)" }}
              />
              <Area
                type="monotone"
                dataKey="incomes.total"
                stroke="var(--highlight)"
                fill="var(--highlight)"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="expenses.total"
                stroke="var(--orange)"
                fill="var(--orange)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card.Body>
        <Card.Footer className="stat-card-footer">
          <Row>
            <Col md={6}>
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>median revenue</InputGroup.Text>
                <CurrencyInput
                  disabled
                  className="text-right form-control"
                  aria-label={"reserves"}
                  name="reserves"
                  intlConfig={intlConfig}
                  defaultValue={median(
                    budgetList.map((b: Budget) => {
                      return b.incomes.total;
                    })
                  )}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>median expenses</InputGroup.Text>
                <CurrencyInput
                  disabled
                  className="text-right form-control"
                  aria-label={"reserves"}
                  name="reserves"
                  intlConfig={intlConfig}
                  defaultValue={median(
                    budgetList.map((b: Budget) => {
                      return b.expenses.total;
                    })
                  )}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
      <Row>
        <Col md="6">
          <Card className="stat-card mt-3">
            <Card.Header className="stat-card-header">Savings</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" aspect={1.6}>
                <AreaChart
                  data={budgetList}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 20,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    stroke="var(--textcolor)"
                    dataKey="name"
                    minTickGap={10}
                  />
                  <YAxis
                    stroke="var(--textcolor)"
                    tickFormatter={tickFormatter}
                  />
                  <ReTooltip
                    content={<CustomTooltip name1="saved" />}
                    contentStyle={{ backgroundColor: "var(--bgcolor)" }}
                    itemStyle={{ color: "var(--textcolor)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stats.saved"
                    stroke="var(--highlight)"
                    fill="var(--highlight)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
            <Card.Footer className="stat-card-footer">
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>median savings</InputGroup.Text>
                <CurrencyInput
                  disabled
                  className="text-right form-control"
                  aria-label={"reserves"}
                  name="reserves"
                  intlConfig={intlConfig}
                  defaultValue={median(
                    budgetList.map((b: Budget) => {
                      return b.stats.saved;
                    })
                  )}
                />
              </InputGroup>
            </Card.Footer>
          </Card>
        </Col>
        <Col md="6">
          <div className="mt-3" />
          <Card className="stat-card">
            <Card.Header className="stat-card-header">Reserves</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" aspect={1.6}>
                <AreaChart
                  data={budgetList}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 20,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    stroke="var(--textcolor)"
                    dataKey="name"
                    minTickGap={10}
                  />
                  <YAxis
                    stroke="var(--textcolor)"
                    tickFormatter={tickFormatter}
                  />
                  <ReTooltip
                    content={<CustomTooltip name1="reserves" />}
                    contentStyle={{ backgroundColor: "var(--bgcolor)" }}
                    itemStyle={{ color: "var(--textcolor)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stats.reserves"
                    stroke="var(--purple)"
                    fill="var(--purple)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
            <Card.Footer className="stat-card-footer">
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>median reserves</InputGroup.Text>
                <CurrencyInput
                  disabled
                  className="text-right form-control"
                  aria-label={"reserves"}
                  name="reserves"
                  intlConfig={intlConfig}
                  defaultValue={median(
                    budgetList.map((b: Budget) => {
                      return b.stats.reserves;
                    })
                  )}
                />
              </InputGroup>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Card className="stat-card mt-3">
            <Card.Header className="stat-card-header">
              Available vs with goal
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" aspect={1.6}>
                <AreaChart
                  data={budgetList}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 20,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    stroke="var(--textcolor)"
                    dataKey="name"
                    minTickGap={10}
                  />
                  <YAxis
                    stroke="var(--textcolor)"
                    tickFormatter={tickFormatter}
                  />
                  <ReTooltip
                    content={
                      <CustomTooltip name1="available" name2="with goal" />
                    }
                    contentStyle={{ backgroundColor: "var(--bgcolor)" }}
                    itemStyle={{ color: "var(--textcolor)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stats.available"
                    stroke="var(--highlight)"
                    fill="var(--highlight)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="stats.withGoal"
                    stroke="var(--yellow)"
                    fill="var(--orange)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
            <Card.Footer className="stat-card-footer">
              <Row>
                <Col lg={6}>
                  <InputGroup size="sm" className="mb-1">
                    <InputGroup.Text>median available</InputGroup.Text>
                    <CurrencyInput
                      disabled
                      className="text-right form-control"
                      aria-label={"reserves"}
                      name="reserves"
                      intlConfig={intlConfig}
                      defaultValue={median(
                        budgetList.map((b: Budget) => {
                          return b.stats.available;
                        })
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup size="sm" className="mb-1">
                    <InputGroup.Text>median with goal</InputGroup.Text>
                    <CurrencyInput
                      disabled
                      className="text-right form-control"
                      aria-label={"reserves"}
                      name="reserves"
                      intlConfig={intlConfig}
                      defaultValue={median(
                        budgetList.map((b: Budget) => {
                          return b.stats.withGoal;
                        })
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
        <Col md="6">
          <div className="mb-3" />
          <Card className="stat-card">
            <Card.Header className="stat-card-header">Savings goal</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" aspect={1.6}>
                <AreaChart
                  data={budgetList}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    stroke="var(--textcolor)"
                    dataKey="name"
                    minTickGap={10}
                  />
                  <YAxis stroke="var(--textcolor)" width={45} unit="%" />
                  <ReTooltip
                    content={<CustomTooltip name1="goal" />}
                    contentStyle={{ backgroundColor: "var(--bgcolor)" }}
                    itemStyle={{ color: "var(--textcolor)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stats.goal"
                    stroke="var(--cyan)"
                    fill="var(--cyan)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
            <Card.Footer className="stat-card-footer">
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>median goal</InputGroup.Text>
                <Form.Control
                  className="text-right"
                  aria-label={"median"}
                  defaultValue={median(
                    budgetList.map((b: Budget) => {
                      return b.stats.goal;
                    })
                  )}
                  type="number"
                  disabled
                />
                <InputGroup.Text>
                  <BsPercent />
                </InputGroup.Text>
              </InputGroup>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default ChartsPage;
