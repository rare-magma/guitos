import { useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  InputGroup,
  Nav,
  Navbar,
  OverlayTrigger,
  Row,
  ToggleButton,
  Tooltip,
} from "react-bootstrap";
import { AsyncTypeahead, TypeaheadRef } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import { BsArrowLeft } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { useDB } from "../../hooks/useDB";
import {
  focusRef,
  getLabelKeyFilteredItem,
  getNestedValues,
} from "../../utils";
import { Chart } from "../Chart/Chart";
import "./ChartsPage.css";

interface GraphProps {
  onShowGraphs: () => void;
}

export interface Filter {
  value: string;
  type: string;
}

export interface FilteredItem {
  id: string;
  name: string;
  item: string;
  value: number;
  type: string;
}

function ChartsPage({ onShowGraphs }: GraphProps) {
  const { budgetList } = useBudget();
  const { selectBudgetsWithFilter, searchBudgetsWithFilter, options } = useDB();

  const filterRef = useRef<TypeaheadRef>(null);

  const [filter, setFilter] = useState<Filter>({ value: "", type: "" });
  const [filteredData, setFilteredData] = useState<FilteredItem[]>([]);
  const [strictFilter, setStrictFilter] = useState(false);

  const showFilterChart =
    filter.value.length > 0 && filter.type && filteredData.length > 0;
  const filterChartStroke = filter.type === "Expense" ? "yellow" : "highlight";
  const filterChartFill = filter.type === "Expense" ? "orange" : "highlight";

  const incomeValues = getNestedValues(budgetList, "incomes", "total");
  const expenseValues = getNestedValues(budgetList, "expenses", "total");
  const savedValue = getNestedValues(budgetList, "stats", "saved");
  const reservesValue = getNestedValues(budgetList, "stats", "reserves");
  const availableValue = getNestedValues(budgetList, "stats", "available");
  const withGoalValue = getNestedValues(budgetList, "stats", "withGoal");
  const goalValue = getNestedValues(budgetList, "stats", "goal");

  useHotkeys("i", (e) => !e.repeat && onShowGraphs(), {
    preventDefault: true,
  });

  useHotkeys(
    ["/", "f"],
    (e) =>
      !e.repeat &&
      focusRef(
        filterRef as unknown as React.MutableRefObject<HTMLInputElement>,
      ),
    { preventDefault: true },
  );

  function handleSelect(option: Option[]) {
    const newFilter = option[0] as FilteredItem;
    setFilter({ value: filter.value, type: newFilter.type });

    const { filteredIncomes, filteredExpenses } = selectBudgetsWithFilter(
      option,
      filter,
      strictFilter,
    );

    if (filteredIncomes && filteredExpenses) {
      setFilteredData([...filteredIncomes, ...filteredExpenses]);
    }

    if (filterRef.current) {
      filterRef.current.clear();
    }
  }

  function handleSearch(filter: Filter) {
    setFilter(filter);
    searchBudgetsWithFilter();
  }

  return (
    <Container className="mb-3">
      <Navbar className="pb-0" data-testid="charts-header">
        <Container fluid className="flex-row p-0">
          <Nav className="flex-row flex-grow-1 justify-content-between">
            <Nav className="me-2 my-2">
              <OverlayTrigger
                delay={250}
                placement="bottom"
                overlay={
                  <Tooltip
                    id={"tooltip-go-to-budgets"}
                    style={{ position: "fixed" }}
                  >
                    go back to budgets
                  </Tooltip>
                }
              >
                <Button
                  aria-label={"go back to budgets"}
                  variant={"go-button"}
                  onClick={onShowGraphs}
                >
                  <BsArrowLeft aria-hidden />
                </Button>
              </OverlayTrigger>
            </Nav>

            <Nav className="ms-2 my-2">
              <InputGroup size="sm">
                <AsyncTypeahead
                  id="search-budget-list"
                  className="filter-search"
                  inputProps={{
                    "aria-label": "filter charts by",
                  }}
                  filterBy={["name", "item", "type"]}
                  labelKey={getLabelKeyFilteredItem}
                  ref={filterRef}
                  onChange={(option: Option[]) => handleSelect(option)}
                  options={options}
                  placeholder="Filter..."
                  isLoading={false}
                  onSearch={(q) => handleSearch({ value: q, type: "" })}
                />
                <ToggleButton
                  id="toggle-strict"
                  aria-label="toggle strict match during search"
                  className="p-2 filter-search"
                  type="checkbox"
                  variant="outline-info"
                  value={1}
                  tabIndex={-1}
                  checked={strictFilter}
                  onChange={() => setStrictFilter(!strictFilter)}
                >
                  strict match
                </ToggleButton>
              </InputGroup>
            </Nav>
          </Nav>
        </Container>
      </Navbar>

      {showFilterChart && (
        <Chart
          key={filter.value}
          header={`${filter.type}s filtered by: ${filter.value}`}
          filteredData={filteredData}
          legendValues1={filteredData.map((i) => i.value)}
          areaDataKey1={"value"}
          areaStroke1={filterChartStroke}
          areaFill1={filterChartFill}
          legend1={"median value"}
        />
      )}

      <Chart
        header={"Revenue vs expenses"}
        tooltipKey1={"revenue"}
        tooltipKey2={"expenses"}
        legendValues1={incomeValues}
        areaDataKey1={"incomes.total"}
        legendValues2={expenseValues}
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
            legendValues1={savedValue}
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
            legendValues1={reservesValue}
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
            legendValues1={availableValue}
            areaDataKey1={"stats.available"}
            legendValues2={withGoalValue}
            areaDataKey2={"stats.withGoal"}
            areaStroke1={"highlight"}
            areaFill1={"highlight"}
            areaStroke2={"yellow"}
            areaFill2={"orange"}
            legend1={"median available"}
            legend2={"median with goal"}
          />
        </Col>
        <Col md="6" className="d-flex">
          <Chart
            header={"Savings goal"}
            tooltipKey1={"goal"}
            legendValues1={goalValue}
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
