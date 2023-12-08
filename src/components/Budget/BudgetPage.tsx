import Papa from "papaparse";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Col, Container, Row, ToastContainer } from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router-dom";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { budgetsDB, optionsDB } from "../../context/db";
import {
  convertCsvToBudget,
  createBudgetNameList,
  createNewBudget,
  userLang,
} from "../../utils";
import { CsvError, ErrorModal, JsonError } from "../ErrorModal/ErrorModal";
import { LandingPage } from "../LandingPage/LandingPage";
import { Loading } from "../Loading/Loading";
import { NavBar, SearchOption } from "../NavBar/NavBar";
import { Notification } from "../Notification/Notification";
import { StatCard } from "../StatCard/StatCard";
import { TableCard } from "../TableCard/TableCard";
import { Budget } from "./Budget";
// import { useWhatChanged } from "@simbathesailor/use-what-changed";

const ChartsPage = lazy(() => import("../ChartsPage/ChartsPage"));

export function BudgetPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [showGraphs, setShowGraphs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<CsvError[]>([]);
  const [jsonError, setJsonError] = useState<JsonError[]>([]);
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState("");

  const [notifications, setNotifications] = useState<
    {
      show: boolean;
      id?: string;
      body?: string;
    }[]
  >([]);

  const {
    budget,
    setBudget,
    budgetList,
    setBudgetList,
    setBudgetNameList,
    needReload,
    past,
    future,
    undo,
    redo,
    canRedo,
    canUndo,
  } = useBudget();
  console.log("file: BudgetPage.tsx:57 ~ BudgetPage ~ budget:", budget);
  const params = useParams();
  const name = String(params.name);

  const showCards = !loading && !showGraphs && budget?.id;

  console.log("file: BudgetPage.tsx:55 ~ BudgetPage ~ future:", future);
  console.log("file: BudgetPage.tsx:55 ~ BudgetPage ~ past:", past);
  const { setIntlConfig, handleCurrency } = useConfig();

  useHotkeys("escape", (e) => !e.repeat && setNotifications([]), {
    preventDefault: true,
  });
  useHotkeys("a", (e) => !e.repeat && !showGraphs && handleNew(), {
    preventDefault: true,
  });
  useHotkeys("c", (e) => !e.repeat && !showGraphs && handleClone(), {
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

  function handleError(e: unknown) {
    if (e instanceof Error) setError(e.message);
    setShow(true);
  }

  function handleNew() {
    const newBudget = createNewBudget();

    let newBudgetList: Budget[] = [];
    newBudgetList = budgetList
      ? budgetList.concat(newBudget)
      : newBudgetList.concat(newBudget);

    setBudget(newBudget);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));

    setNotifications([
      ...notifications,
      {
        show: true,
        id: crypto.randomUUID(),
        body: `created "${newBudget.name}" budget`,
      },
    ]);
  }

  function handleClone() {
    if (budget) {
      const newBudget = {
        ...budget,
        id: crypto.randomUUID(),
        name: budget.name + "-clone",
      };

      let newBudgetList: Budget[] = [];
      newBudgetList = budgetList
        ? budgetList.concat(newBudget)
        : newBudgetList.concat(newBudget);

      setNotifications([
        ...notifications,
        {
          body: `cloned "${budget.name}" budget`,
          id: crypto.randomUUID(),
          show: true,
        },
      ]);
      setBudget(newBudget);
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    }
  }

  function handleRemove(toBeDeleted: string) {
    budgetList &&
      budgetsDB
        .removeItem(toBeDeleted)
        .then(() => {
          const newBudgetList = budgetList
            .filter((item: Budget) => item.id !== toBeDeleted)
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse();

          setBudgetList(newBudgetList);
          setBudgetNameList(
            createBudgetNameList(newBudgetList as unknown as Budget[]),
          );

          setNotifications([
            ...notifications,
            {
              body: `deleted "${budget?.name}" budget`,
              id: crypto.randomUUID(),
              show: true,
            },
          ]);

          if (newBudgetList.length >= 1) {
            setBudget(newBudgetList[0]);
            // reset(newBudgetList[0]);
          } else {
            setBudget(undefined);
            // reset(undefined);
          }
        })
        .catch((e: unknown) => {
          handleError(e);
        });
  }

  function handleSelect(selectedBudget: SearchOption[] | undefined) {
    if (selectedBudget && budgetList) {
      const filteredList = budgetList.filter(
        (item: Budget) => item.id === selectedBudget[0].id,
      );

      filteredList && setBudget(filteredList[0]);

      if (selectedBudget[0].item && selectedBudget[0].item.length > 0) {
        setFocus(selectedBudget[0].item);
      }
    }
  }

  useEffect(() => {
    const element = document.querySelector(`input[value="${focus}"]`);
    if (element !== null) {
      (element as HTMLElement).focus();
    }
  }, [focus]);

  function handleGo(step: number, limit: number) {
    const sortedList = budgetList?.sort((a, b) => a.name.localeCompare(b.name));
    if (budget) {
      const index = sortedList?.findIndex((b) => b.name.includes(budget.name));
      if (index !== limit && sortedList) {
        handleSelect([
          sortedList[(index ?? 0) + step] as unknown as SearchOption,
        ]);
      }
    }
  }

  function handleGoHome() {
    if (budget) {
      const name = new Date().toISOString();
      const index = budgetList?.findIndex((b) =>
        b.name.includes(name.slice(0, 7)),
      );
      const isSelectable = index !== -1 && budgetList && index;

      if (isSelectable) {
        handleSelect([budgetList[index] as unknown as SearchOption]);
      }
    }
  }

  function handleGoBack() {
    budgetList && handleGo(-1, 0);
  }

  function handleGoForward() {
    budgetList && handleGo(1, budgetList.length - 1);
  }

  function handleImportCsv(fileReader: FileReader, file: File) {
    const newBudgetList: Budget[] = [];
    const csvObject = Papa.parse(fileReader.result as string, {
      header: true,
      skipEmptyLines: "greedy",
    });

    const hasErrors = csvObject.errors.length > 0;

    if (hasErrors) {
      csvError.push({
        errors: csvObject.errors,
        file: file.name,
      });
      setCsvError(csvError);
      setShow(true);
      setLoading(false);

      return;
    }

    const newBudget = convertCsvToBudget(
      csvObject.data as string[],
      file.name.slice(0, -4),
    );
    newBudgetList.push(newBudget);
    // save(newBudget);
    // reset(newBudget);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  }

  function handleImportJSON(fileReader: FileReader, file: File) {
    const newBudgetList: Budget[] = [];
    try {
      const list = JSON.parse(fileReader.result as string) as Budget[];
      list.forEach((b: Budget) => {
        newBudgetList.push(b);
        // save(b);
      });
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    } catch (e) {
      setJsonError([{ errors: (e as string).toString(), file: file.name }]);
      setShow(true);
      setLoading(false);
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    const importedFiles = e.target.files;
    if (importedFiles === null) {
      return;
    }
    for (const file of importedFiles) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onloadend = () => {
        if (reader.result !== null) {
          if (file.type === "text/csv") {
            handleImportCsv(reader, file);
          } else {
            handleImportJSON(reader, file);
          }
        }
      };
    }
  }

  function loadFromDb() {
    let list: Budget[] = [];

    budgetsDB
      .iterate((value) => {
        list = list.concat(value as Budget);
      })
      .then(() => {
        setBudgetList(list);
        setBudgetNameList(createBudgetNameList(list));

        let newBudget: Budget;
        if (name.trim() !== "undefined") {
          newBudget = list.filter((b: Budget) => b && b.name === name)[0];
          setBudget(newBudget);
        } else {
          newBudget = list
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse()
            .filter((b: Budget) => b && b.id === list[0].id)[0];
          setBudget(newBudget);
        }

        loadCurrencyOption();
        setLoading(false);
      })
      .catch((e) => {
        handleError(e);
      });
  }

  function loadBudget(list: Budget[]) {
    list.forEach((data: Budget) => {
      budgetsDB
        .getItem(data.id)
        .then((b) => setBudget(b as Budget))
        .catch((e) => {
          handleError(e);
        });
    });
  }

  function loadCurrencyOption() {
    optionsDB
      .getItem("currencyCode")
      .then((c) => {
        if (c) {
          handleCurrency(c as string);
          setIntlConfig({ locale: userLang, currency: c as string });
        }
      })
      .catch((e) => {
        handleError(e);
      });
  }

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
        setLoading(false);
      } else {
        loadFromDb();
      }
    } catch (e: unknown) {
      handleError(e);
      setLoading(false);
    }
    console.log("file: BudgetPage.tsx:573 ~ BudgetPage ~ name:", name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, loading]);

  return (
    <Container fluid style={{ zIndex: 1 }} key={`${budget?.id}-${needReload}`}>
      <ToastContainer
        className="p-2"
        position={"bottom-center"}
        style={{ zIndex: 100 }}
      >
        {notifications.map((notification) => {
          return (
            notification && (
              <Notification
                notification={notification}
                onShow={() =>
                  setNotifications(
                    notifications.filter((n) => n.id !== notification.id),
                  )
                }
              />
            )
          );
        })}
      </ToastContainer>

      {!showGraphs && (
        <NavBar
          onClone={handleClone}
          onGoBack={handleGoBack}
          onGoHome={handleGoHome}
          onGoForward={handleGoForward}
          onNew={handleNew}
          onImport={(e) => handleImport(e)}
          onRemove={(e) => handleRemove(e)}
          onSelect={(e) => handleSelect(e)}
        />
      )}

      <LandingPage
        loading={loading}
        inputRef={inputRef}
        onNew={handleNew}
        onImport={(e) => handleImport(e)}
      />

      <ErrorModal
        error={error}
        show={show}
        jsonError={jsonError}
        csvError={csvError}
        onShow={setShow}
        onError={() => {
          setJsonError([]);
          setCsvError([]);
        }}
      />

      {showGraphs && (
        <Suspense fallback={<Loading />}>
          <ChartsPage onShowGraphs={() => setShowGraphs(false)} />
        </Suspense>
      )}

      {showCards && (
        <Container key={budget.id}>
          <Row className="mt-1">
            <Col md="6">
              <div className="card-columns">
                <StatCard
                  key={budget?.expenses.total + budget?.incomes.total}
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
          </Row>
        </Container>
      )}
    </Container>
  );
}
