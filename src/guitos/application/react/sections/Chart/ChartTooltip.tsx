import { useConfig } from "@guitos/application/react/context/ConfigContext";
import { intlFormat, roundBig } from "@guitos/application/react/utils";
import Big from "big.js";
import { Col, Container, Row } from "react-bootstrap";

interface ChartTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    payload?: {
      id: string;
      item: string;
      name: string;
      type: string;
      value: number;
    };
    value: number;
    unit: string;
  }[];
  label?: string;
  key1?: string | undefined;
  key2?: string | undefined;
}

export function ChartTooltip({
  active,
  payload,
  label,
  key1,
  key2,
}: ChartTooltipProps) {
  const { userOptions } = useConfig();
  const showTooltip = active && payload?.length;
  const filteredItemName = payload?.length && payload[0].payload?.item;
  const showMultipleLegends = showTooltip && payload.length > 1;

  const item1Value =
    showTooltip && intlFormat(roundBig(Big(payload[0].value), 2), userOptions);
  const item2Value =
    showMultipleLegends &&
    intlFormat(roundBig(Big(payload[1].value), 2), userOptions);

  return showTooltip ? (
    <Container className="m-2">
      <Row>{label}</Row>
      {showMultipleLegends ? (
        <>
          <Row className="me-1">
            <Col>{`${key1 ?? ""}:`}</Col>
            <Col className="text-end fixed-width-font">{item1Value}</Col>
          </Row>
          <Row className="me-1 flex-md-nowrap">
            <Col>{`${key2 ?? ""}:`}</Col>
            <Col className="text-end fixed-width-font col-md-auto">
              {item2Value}
            </Col>
          </Row>
        </>
      ) : (
        <Row className="me-1">
          <Col>{`${key1 ?? filteredItemName}:`}</Col>
          {key1 === "goal" ? (
            <Col className="text-end fixed-width-font">{`${payload[0].value}%`}</Col>
          ) : (
            <Col className="text-end fixed-width-font">{item1Value}</Col>
          )}
        </Row>
      )}
    </Container>
  ) : null;
}
