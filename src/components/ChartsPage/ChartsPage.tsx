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
import { budgetsDB } from "../../context/db";
import { focusRef, getNestedValues } from "../../utils";
import { Budget } from "../Budget/Budget";
import Chart from "../Chart/Chart";
import "./ChartsPage.css";

interface GraphProps {
  onShowGraphs: () => void;
}

interface Filter {
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

  const filterRef = useRef<TypeaheadRef>(null);

  const [options, setOptions] = useState<Option[]>([]);
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

  function handleShowGraphs() {
    onShowGraphs();
  }

  function getLabelKey(option: unknown): string {
    const label = option as FilteredItem;
    return `${label.item} (${label.name} ${label.type.toLowerCase()})`;
  }

  function handleSelect(option: Option[]) {
    const newFilter = option[0] as FilteredItem;
    setFilter({ value: filter.value, type: newFilter.type });

    const filteredIncomes = budgetList
      ?.map((b: Budget) => {
        return b.incomes.items
          .filter((i) =>
            i.value && strictFilter
              ? i.name === filter.value
              : i.name.toLowerCase().includes(filter.value.toLowerCase()),
          )
          .map((i) => {
            return {
              id: b.id,
              name: b.name,
              item: i.name,
              value: i.value,
              type: "Income",
            };
          })
          .filter((i) => i.type.includes(newFilter.type));
      })
      .flat();

    const filteredExpenses = budgetList
      ?.map((b: Budget) => {
        return b.expenses.items
          .filter((i) =>
            i.value && strictFilter
              ? i.name === filter.value
              : i.name.toLowerCase().includes(filter.value.toLowerCase()),
          )
          .map((i) => {
            return {
              id: b.id,
              name: b.name,
              item: i.name,
              value: i.value,
              type: "Expense",
            };
          })
          .filter((i) => i.type.includes(newFilter.type));
      })
      .flat();

    filteredIncomes &&
      filteredExpenses &&
      setFilteredData([...filteredIncomes, ...filteredExpenses]);

    if (filterRef.current) {
      filterRef.current.clear();
    }
  }

  function handleSearch(filter: Filter) {
    setFilter(filter);

    let options: FilteredItem[] = [];
    budgetsDB
      .iterate((budget: Budget) => {
        options = options.concat(
          budget.incomes.items.map((i) => {
            return {
              id: budget.id,
              name: budget.name,
              item: i.name,
              value: i.value,
              type: "Income",
            };
          }),
          budget.expenses.items.map((i) => {
            return {
              id: budget.id,
              name: budget.name,
              item: i.name,
              value: i.value,
              type: "Expense",
            };
          }),
        );
      })
      .then(() => {
        setOptions(
          options
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter((i) => i.value)
            .reverse(),
        );
      })
      .catch((e) => {
        throw new Error(e as string);
      });
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
                  onClick={handleShowGraphs}
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
                  filterBy={["name", "item", "type"]}
                  labelKey={getLabelKey}
                  ref={filterRef}
                  onChange={(option: Option[]) => {
                    handleSelect(option);
                  }}
                  options={options}
                  placeholder="Filter..."
                  isLoading={false}
                  onSearch={(q) => handleSearch({ value: q, type: "" })}
                />
                <ToggleButton
                  id="toggle-strict"
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
