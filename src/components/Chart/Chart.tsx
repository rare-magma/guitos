import { Card, Row, Col, InputGroup, Form } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import {
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import { intlFormat, median } from "../../utils";
import ChartTooltip from "./ChartTooltip";
import { BsPercent } from "react-icons/bs";
import useDynamicYAxisWidth from "./DynamicYAxis";
import { useConfig } from "../../context/ConfigContext";
import { useBudget } from "../../context/BudgetContext";

interface ChartProps {
  header: string;
  tooltipKey1: string;
  tooltipKey2?: string;
  areaDataKey1: string;
  areaDataKey2?: string;
  areaStroke1: string;
  areaFill1: string;
  areaStroke2?: string;
  areaFill2?: string;
  legend1: string;
  legendValues1: number[];
  legend2?: string;
  legendValues2?: number[];
  unit?: string;
}

function Chart({
  header,
  tooltipKey1,
  tooltipKey2,
  areaDataKey1,
  areaDataKey2,
  areaStroke1,
  areaStroke2,
  areaFill1,
  areaFill2,
  legend1,
  legend2,
  legendValues1,
  legendValues2,
  unit,
}: ChartProps) {
  const { budgetList } = useBudget();
  const { intlConfig } = useConfig();

  const { yAxisWidth, setChartRef } = useDynamicYAxisWidth({
    yAxisWidthModifier: (x) => x + 10,
  });

  function tickFormatter(value: number) {
    return (
      (intlConfig?.currency && intlFormat(value, intlConfig.currency)) ?? ""
    );
  }

  return (
    <Card className="stat-card mt-3">
      <Card.Header className="stat-card-header">{header}</Card.Header>
      <Card.Body>
        <ResponsiveContainer
          width="100%"
          aspect={window.innerWidth < window.innerHeight ? 1.6 : 3.4}
        >
          <AreaChart
            data={budgetList?.sort((a, b) => a.name.localeCompare(b.name))}
            ref={setChartRef}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
            }}
          >
            <XAxis
              stroke="var(--textcolor)"
              dataKey="name"
              minTickGap={10}
              tick={{ transform: "translate(0, 10)" }}
            />
            {unit ? (
              <YAxis
                stroke="var(--textcolor)"
                style={{ fontFamily: "ui-monospace, monospace" }}
                width={yAxisWidth}
                unit={unit}
              />
            ) : (
              <YAxis
                stroke="var(--textcolor)"
                style={{ fontFamily: "ui-monospace, monospace" }}
                width={yAxisWidth}
                tickFormatter={tickFormatter}
              />
            )}
            <Tooltip
              content={<ChartTooltip key1={tooltipKey1} key2={tooltipKey2} />}
              contentStyle={{ backgroundColor: "var(--bgcolor)" }}
              itemStyle={{ color: "var(--textcolor)" }}
            />
            <Area
              type="monotone"
              dataKey={areaDataKey1}
              stroke={`var(--${areaStroke1})`}
              fill={`var(--${areaFill1})`}
              isAnimationActive={false}
            />
            {areaDataKey2 && areaStroke2 && areaFill2 && (
              <Area
                type="monotone"
                dataKey={areaDataKey2}
                stroke={`var(--${areaStroke2})`}
                fill={`var(--${areaFill2})`}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
      <Card.Footer className="stat-card-footer">
        <Row>
          {tooltipKey1 === "goal" && (
            <InputGroup size="sm" className="mb-1">
              <InputGroup.Text>{legend1}</InputGroup.Text>
              <Form.Control
                className="text-end fixed-width-font"
                aria-label={"median"}
                defaultValue={legendValues1 && median(legendValues1)}
                type="number"
                disabled
              />
              <InputGroup.Text>
                <BsPercent />
              </InputGroup.Text>
            </InputGroup>
          )}
          {tooltipKey1 !== "goal" && !legendValues2 && (
            <InputGroup size="sm" className="mb-1">
              <InputGroup.Text>{legend1}</InputGroup.Text>
              <CurrencyInput
                disabled
                className="text-end form-control fixed-width-font"
                aria-label={legend1}
                intlConfig={intlConfig}
                defaultValue={legendValues1 && median(legendValues1)}
              />
            </InputGroup>
          )}
          {tooltipKey1 !== "goal" && legendValues2 && (
            <Col lg={6}>
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>{legend1}</InputGroup.Text>
                <CurrencyInput
                  disabled
                  className="text-end form-control fixed-width-font"
                  aria-label={legend1}
                  intlConfig={intlConfig}
                  defaultValue={legendValues1 && median(legendValues1)}
                />
              </InputGroup>
            </Col>
          )}
          {legendValues2 && (
            <Col>
              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text>{legend2}</InputGroup.Text>
                <CurrencyInput
                  disabled
                  className="text-end form-control fixed-width-font"
                  aria-label={legend2}
                  intlConfig={intlConfig}
                  defaultValue={median(legendValues2)}
                />
              </InputGroup>
            </Col>
          )}
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default Chart;
