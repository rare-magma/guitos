import { Suspense, lazy, useEffect, useState } from "react";
import { Col, Container, Row, ToastContainer } from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router-dom";
import { useBudget } from "../../context/BudgetContext";
import { useGeneralContext } from "../../context/GeneralContext";
import { useDB } from "../../hooks/useDB";
import { createBudgetNameList } from "../../utils";
import { ErrorModal } from "../ErrorModal/ErrorModal";
import { LandingPage } from "../LandingPage/LandingPage";
import { Loading } from "../Loading/Loading";
import { NavBar } from "../NavBar/NavBar";
import { Notification } from "../Notification/Notification";
import { StatCard } from "../StatCard/StatCard";
import { Budget } from "./Budget";
// import { useWhatChanged } from "@simbathesailor/use-what-changed";

const ChartsPage = lazy(() => import("../ChartsPage/ChartsPage"));
const TableCard = lazy(() => import("../TableCard/TableCard"));

export function BudgetPage() {
  const [showGraphs, setShowGraphs] = useState(false);
  const {
    handleError,
    needReload,
    loadingFromDB,
    setLoadingFromDB,
    notifications,
    setNotifications,
  } = useGeneralContext();

  const {
    budget,
    budgetList,
    setBudgetNameList,
    undo,
    redo,
    canRedo,
    canUndo,
  } = useBudget();

  const {
    createBudget,
    cloneBudget,
    loadCurrencyOption,
    loadBudget,
    loadFromDb,
  } = useDB();

  const params = useParams();
  const name = String(params.name);
  const showCards = !loadingFromDB && !showGraphs && budget?.id;

  useHotkeys("escape", (e) => !e.repeat && setNotifications([]), {
    preventDefault: true,
  });
  useHotkeys("a", (e) => !e.repeat && !showGraphs && createBudget(), {
    preventDefault: true,
  });
  useHotkeys("c", (e) => !e.repeat && !showGraphs && cloneBudget(), {
    preventDefault: true,
  });
  useHotkeys(
    "i",
    (e) => !e.repeat && !showGraphs && budget && setShowGraphs(true),
    {
      preventDefault: true,
    },
  );
  useHotkeys("u", (e) => !e.repeat && canUndo && undo(), {
    preventDefault: true,
  });
  useHotkeys("r", (e) => !e.repeat && canRedo && redo(), {
    preventDefault: true,
  });

  // useWhatChanged([budget, name]);

  useEffect(() => {
    try {
      const shouldLoadBudgetsFromList =
        budgetList && budgetList.length >= 1 && Array.isArray(budgetList);

      if (shouldLoadBudgetsFromList) {
        if (name.trim() !== "undefined") {
          loadBudget(budgetList.filter((b: Budget) => b && b.name === name));
        } else {
          loadBudget(budgetList.slice(0));
        }

        loadCurrencyOption();
        setBudgetNameList(createBudgetNameList(budgetList));
        setLoadingFromDB(false);
      } else {
        loadFromDb();
      }
    } catch (e: unknown) {
      handleError(e);
      setLoadingFromDB(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, loadingFromDB]);

  return (
    <Container fluid style={{ zIndex: 1 }} key={`${budget?.id}-${needReload}`}>
      <ToastContainer
        className="p-2"
        position={"bottom-center"}
        style={{ zIndex: 100 }}
      >
        {notifications.map((notification, i) => {
          return (
            notification && <Notification key={i} notification={notification} />
          );
        })}
      </ToastContainer>

      {!showGraphs && <NavBar />}
      <LandingPage />
      <ErrorModal />

      {showGraphs && (
        <Suspense fallback={<Loading />}>
          <ChartsPage onShowGraphs={() => setShowGraphs(false)} />
        </Suspense>
      )}

      {showCards && (
        <Container key={`${budget.id}-${needReload}-cards-container`}>
          <Row className="mt-1">
            <Suspense fallback={<Loading />}>
              <Col md="6">
                <div className="card-columns">
                  <StatCard
                    key={`${budget?.expenses.total} + ${budget?.incomes.total}-${budget.id}-stat-card`}
                    onShowGraphs={() => setShowGraphs(true)}
                  />

                  <div className="mt-3" />

                  <TableCard header="Revenue" />
                  <div className="mt-3" />
                </div>
              </Col>

              <Col md="6" className="mb-3">
                <TableCard header="Expenses" />
              </Col>
            </Suspense>
          </Row>
        </Container>
      )}
    </Container>
  );
}
