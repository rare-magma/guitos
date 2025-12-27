import { useBudget } from "@guitos/application/react/context/BudgetContext";
import { useErrorContext } from "@guitos/application/react/context/ErrorContext";
import { useLoadingContext } from "@guitos/application/react/context/LoadingContext";
import {
  type BudgetNotification,
  useNotificationContext,
} from "@guitos/application/react/context/NotificationContext";
import type { Budget } from "@guitos/domain/budget";
import { useDB } from "@guitos/hooks/useDB";
import { LandingPage } from "@guitos/sections/LandingPage/LandingPage";
import { Loading } from "@guitos/sections/Loading/Loading";
import { NavBar } from "@guitos/sections/NavBar/NavBar";
import { Notification } from "@guitos/sections/Notification/Notification";
import { StatCard } from "@guitos/sections/StatCard/StatCard";
import { produce } from "immer";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Col, Container, Row, ToastContainer } from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "wouter";
import { createBudgetNameList } from "../../application/react/utils";

const ChartsPage = lazy(() => import("../ChartsPage/ChartsPage"));
const TableCard = lazy(() => import("../TableCard/TableCard"));
const ErrorModal = lazy(() => import("../ErrorModal/ErrorModal"));

export function BudgetPage() {
  const [showGraphs, setShowGraphs] = useState(false);
  const { shouldReload, loadingFromDB, setLoadingFromDB } = useLoadingContext();
  const { notifications, setNotifications } = useNotificationContext();

  const {
    error,
    csvErrors,
    setCsvErrors,
    jsonErrors,
    setJsonErrors,
    showError,
    setShowError,
    handleError,
  } = useErrorContext();

  const {
    budget,
    budgetList,
    setBudgetNameList,
    undo,
    redo,
    canRedo,
    canUndo,
  } = useBudget();

  const { createBudget, cloneBudget, loadBudget, loadFromDb } = useDB();

  const params = useParams();
  const name = String(params.name);
  const showCards = !loadingFromDB && !showGraphs && budget?.id;
  const showLandingPage = Boolean(
    !loadingFromDB && !budget && budgetList && budgetList.length < 1,
  );

  const handleDismiss = useCallback(() => {
    setShowError(false);
    setCsvErrors([]);
    setJsonErrors([]);
  }, [setCsvErrors, setJsonErrors, setShowError]);

  const handleCloseNotification = useCallback(
    (notification: BudgetNotification) => {
      setNotifications(
        produce(notifications, (draft) => {
          const index = draft.findIndex((n) => n.id === notification.id);
          if (index !== -1) draft.splice(index, 1);
        }),
      );
    },
    [notifications, setNotifications],
  );

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: unstable deps
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

        setBudgetNameList(createBudgetNameList(budgetList));
        setLoadingFromDB(false);
      } else {
        loadFromDb();
      }
    } catch (e: unknown) {
      handleError(e);
      setLoadingFromDB(false);
    }
  }, [name, loadingFromDB]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: bootstrap is not semantic
    <Container
      fluid={true}
      style={{ zIndex: 1 }}
      key={`${budget?.id}-${shouldReload}`}
      role="main"
    >
      <ToastContainer
        className="p-2"
        position={"bottom-center"}
        style={{ zIndex: 100 }}
      >
        {notifications.map((notification) => {
          return (
            notification && (
              <Notification
                key={notification.id}
                notification={notification}
                handleClose={handleCloseNotification}
              />
            )
          );
        })}
      </ToastContainer>

      {!showGraphs && <NavBar />}
      <LandingPage
        loadingFromDB={loadingFromDB}
        showLandingPage={showLandingPage}
      />
      <ErrorModal
        error={error}
        showError={showError}
        setShowError={setShowError}
        jsonErrors={jsonErrors}
        setJsonErrors={setJsonErrors}
        csvErrors={csvErrors}
        setCsvErrors={setCsvErrors}
        handleDismiss={handleDismiss}
      />

      {showGraphs && (
        <Suspense fallback={<Loading />}>
          <ChartsPage onShowGraphs={() => setShowGraphs(false)} />
        </Suspense>
      )}

      {showCards && (
        <Container key={`${budget.id}-${shouldReload}-cards-container`}>
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
