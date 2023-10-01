import {
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { BsArrowLeft } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { Budget } from "../Budget/Budget";
import Chart from "../Chart/Chart";

interface GraphProps {
  onShowGraphs: () => void;
}

function ChartsPage({ onShowGraphs }: GraphProps) {
  const { budgetList } = useBudget();

  useHotkeys("i", (e) => !e.repeat && onShowGraphs(), {
    preventDefault: true,
  });

  function handleShowGraphs() {
    onShowGraphs();
  }

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
          variant={"go-button"}
          onClick={handleShowGraphs}
        >
          <BsArrowLeft />
        </Button>
      </OverlayTrigger>

      <Chart
        header={"Revenue vs expenses"}
        tooltipKey1={"revenue"}
        tooltipKey2={"expenses"}
        legendValues1={
          budgetList?.map((b: Budget) => {
            return b.incomes.total;
          }) ?? []
        }
        areaDataKey1={"incomes.total"}
        legendValues2={
          budgetList?.map((b: Budget) => {
            return b.expenses.total;
          }) ?? []
        }
        areaDataKey2={"expenses.total"}
        areaStroke1={"highlight"}
        areaFill1={"highlight"}
        areaStroke2={"yellow"}
        areaFill2={"orange"}
        legend1={"median revenue"}
        legend2={"median expenses"}
      />

      <Row>
        <Col md="6">
          <Chart
            header={"Savings"}
            tooltipKey1={"saved"}
            legendValues1={
              budgetList?.map((b: Budget) => {
                return b.stats.saved;
              }) ?? []
            }
            areaDataKey1={"stats.saved"}
            areaStroke1={"highlight"}
            areaFill1={"highlight"}
            legend1={"median savings"}
          />
        </Col>
        <Col md="6">
          <div className="mt-3" />
          <Chart
            header={"Reserves"}
            tooltipKey1={"reserves"}
            legendValues1={
              budgetList?.map((b: Budget) => {
                return b.stats.reserves;
              }) ?? []
            }
            areaDataKey1={"stats.reserves"}
            areaStroke1={"purple"}
            areaFill1={"purple"}
            legend1={"median reserves"}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Chart
            header={"Available vs with goal"}
            tooltipKey1={"available"}
            tooltipKey2={"with goal"}
            legendValues1={
              budgetList?.map((b: Budget) => {
                return b.stats.available;
              }) ?? []
            }
            areaDataKey1={"stats.available"}
            legendValues2={
              budgetList?.map((b: Budget) => {
                return b.stats.withGoal;
              }) ?? []
            }
            areaDataKey2={"stats.withGoal"}
            areaStroke1={"highlight"}
            areaFill1={"highlight"}
            areaStroke2={"yellow"}
            areaFill2={"orange"}
            legend1={"median available"}
            legend2={"median with goal"}
          />
        </Col>
        <Col md="6">
          <div className="mb-3" />
          <Chart
            header={"Savings goal"}
            tooltipKey1={"goal"}
            legendValues1={
              budgetList?.map((b: Budget) => {
                return b.stats.goal;
              }) ?? []
            }
            areaDataKey1={"stats.goal"}
            areaStroke1={"cyan"}
            areaFill1={"cyan"}
            legend1={"median goal"}
            unit="%"
          />
        </Col>
      </Row>
    </Container>
  );
}
export default ChartsPage;
