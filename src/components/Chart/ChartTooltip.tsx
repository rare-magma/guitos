import Big from "big.js";
import { Container, Row, Col } from "react-bootstrap";
import { intlFormat, roundBig } from "../../utils";
import { useConfig } from "../../context/ConfigContext";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; unit: string }[];
  label?: string;
  key1?: string;
  key2?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  key1,
  key2,
}: ChartTooltipProps) {
  const { intlConfig } = useConfig();

  if (active && payload?.length && intlConfig?.currency) {
    return (
      <Container className="m-2">
        <Row>{label}</Row>
        {payload.length > 1 ? (
          <>
            <Row className="me-1">
              <Col>{`${key1 ?? ""}:`}</Col>
              <Col className="text-end fixed-width-font">
                {`${intlFormat(
                  roundBig(Big(payload[0].value), 2),
                  intlConfig.currency,
                )}`}
              </Col>
            </Row>
            <Row className="me-1 flex-md-nowrap">
              <Col>{`${key2 ?? ""}:`}</Col>
              <Col className="text-end fixed-width-font col-md-auto">
                {intlFormat(
                  roundBig(Big(payload[1].value), 2),
                  intlConfig.currency,
                )}
              </Col>
            </Row>
          </>
        ) : (
          <Row className="me-1">
            <Col>{`${key1 ?? ""}:`}</Col>
            {key1 === "goal" ? (
              <Col className="text-end fixed-width-font">{`${payload[0].value}%`}</Col>
            ) : (
              <Col className="text-end fixed-width-font">
                {`${intlFormat(
                  roundBig(Big(payload[0].value), 2),
                  intlConfig.currency,
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
