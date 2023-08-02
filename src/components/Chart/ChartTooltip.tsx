import Big from "big.js";
import { Container, Row, Col } from "react-bootstrap";
import { intlFormat, roundBig } from "../../utils";
import { CurrencyInputProps } from "react-currency-input-field";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; unit: string }[];
  label?: string;
  intlConfig: CurrencyInputProps["intlConfig"];
  key1?: string;
  key2?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  intlConfig,
  key1,
  key2,
}: ChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <Container className="m-2">
        <Row>{label}</Row>
        {payload.length > 1 ? (
          <>
            <Row className="me-1">
              <Col>{`${key1 || ""}:`}</Col>
              <Col className="text-end fixed-width-font">
                {`${intlFormat(
                  roundBig(Big(payload[0].value), 2),
                  intlConfig?.currency as string,
                )}`}
              </Col>
            </Row>
            <Row className="me-1 flex-md-nowrap">
              <Col>{`${key2 || ""}:`}</Col>
              <Col className="text-end fixed-width-font col-md-auto">
                {intlFormat(
                  roundBig(Big(payload[1].value), 2),
                  intlConfig?.currency as string,
                )}
              </Col>
            </Row>
          </>
        ) : (
          <Row className="me-1">
            <Col>{`${key1 || ""}:`}</Col>
            {key1 === "goal" ? (
              <Col className="text-end fixed-width-font">{`${payload[0].value}%`}</Col>
            ) : (
              <Col className="text-end fixed-width-font">
                {`${intlFormat(
                  roundBig(Big(payload[0].value), 2),
                  intlConfig?.currency as string,
                )}`}
              </Col>
            )}
          </Row>
        )}
      </Container>
    );
  }

  return null;
}

export default ChartTooltip;
