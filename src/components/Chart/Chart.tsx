import { Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import { BsPercent } from "react-icons/bs";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { intlFormat, median } from "../../utils";
import { FilteredItem } from "../ChartsPage/ChartsPage";
import "./Chart.css";
import { ChartTooltip } from "./ChartTooltip";
import { useDynamicYAxisWidth } from "./DynamicYAxis";

interface ChartProps {
  header: string;
  tooltipKey1?: string;
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
  filteredData?: FilteredItem[];
}

const horizonalRatio = 3.4;
const verticalRatio = 1.6;

export function Chart({
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
  filteredData,
}: ChartProps) {
  const { budgetList } = useBudget();
  const { intlConfig } = useConfig();

  const showSecondArea = areaDataKey2 && areaStroke2 && areaFill2;
  const isGoalChart = tooltipKey1 === "goal";
  const isVerticalScreen = window.innerWidth < window.innerHeight;
  const chartData =
    filteredData ?? budgetList?.sort((a, b) => a.name.localeCompare(b.name));

  const { yAxisWidth, setChartRef } = useDynamicYAxisWidth({
    yAxisWidthModifier: (x) => x + 10,
  });

  function medianLabelGroup(legend: string, values: number[]) {
    return (
      <InputGroup size="sm" className="mb-1">
        <InputGroup.Text>{legend}</InputGroup.Text>
        <CurrencyInput
          disabled
          className="text-end form-control fixed-width-font"
          aria-label={legend}
          intlConfig={intlConfig}
          defaultValue={median(values)}
        />
      </InputGroup>
    );
  }

  function tickFormatter(value: number) {
    return (
      (intlConfig?.currency && intlFormat(value, intlConfig.currency)) ?? ""
    );
  }

  return (
    <Card className="stat-card mt-3 d-flex flex-grow-1">
      <Card.Header className="stat-card-header">{header}</Card.Header>
      <Card.Body>
        <ResponsiveContainer
          width="100%"
          aspect={isVerticalScreen ? verticalRatio : horizonalRatio}
        >
          <AreaChart
            data={chartData}
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
              allowEscapeViewBox={{ x: false, y: false }}
              position={{ y: 0 }}
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
            {showSecondArea && (
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
          {isGoalChart && (
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
                <BsPercent aria-hidden />
              </InputGroup.Text>
            </InputGroup>
          )}
          {!isGoalChart &&
            !legendValues2 &&
            medianLabelGroup(legend1, legendValues1)}
          {!isGoalChart && legendValues2 && (
            <Col lg={6}>{medianLabelGroup(legend1, legendValues1)}</Col>
          )}
          {legend2 && legendValues2 && (
            <Col>{medianLabelGroup(legend2, legendValues2)}</Col>
          )}
        </Row>
      </Card.Footer>
    </Card>
  );
}
