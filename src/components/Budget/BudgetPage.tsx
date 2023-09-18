import { useEffect, useRef, useState } from "react";
import { Budget } from "./Budget";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  budgetToCsv,
  calcAutoGoal,
  calcAvailable,
  calcSaved,
  calcWithGoal,
  convertCsvToBudget,
  createBudgetNameList,
  createNewBudget,
  roundBig,
  userLang,
} from "../../utils";
import Papa from "papaparse";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import ErrorModal, { CsvError, JsonError } from "../ErrorModal/ErrorModal";
import LandingPage from "../LandingPage/LandingPage";
import NavBar from "../NavBar/NavBar";
import { Stat } from "../StatCard/Stat";
import StatCard from "../StatCard/StatCard";
import { Expense } from "../TableCard/Expense";
import { Income } from "../TableCard/Income";
import TableCard from "../TableCard/TableCard";
import ChartsPage from "../ChartsPage/ChartsPage";
import { budgetsDB, optionsDB } from "../../context/db";
import { useConfig } from "../../context/ConfigContext";
import { useBudget } from "../../context/BudgetContext";
// import { useWhatChanged } from "@simbathesailor/use-what-changed";

function BudgetPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [showGraphs, setShowGraphs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<CsvError[]>([]);
  const [jsonError, setJsonError] = useState<JsonError[]>([]);
  const [show, setShow] = useState(false);

  const { budget, setBudget, budgetList, setBudgetList, setBudgetNameList } =
    useBudget();
  const params = useParams();
  const name = String(params.name);

  const { setIntlConfig, handleCurrency } = useConfig();

  useHotkeys("s", (e) => !e.repeat && handleExportJSON(), {
    preventDefault: true,
  });
  useHotkeys("d", (e) => !e.repeat && handleExportCSV(), {
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

  function handleError(e: unknown) {
    if (e instanceof Error) setError(e.message);
    setShow(true);
  }

  function handleIncomeChange(item: Income) {
    let newBudget: Budget | undefined;
    if (budget) {
      newBudget = budget;
      newBudget.incomes = item;
      newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        incomes: {
          ...budget.incomes,
          items: item.items,
          total: item.total,
        },
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
        },
      });
    }
  }

  function handleExpenseChange(item: Expense) {
    let newBudget: Budget;
    if (budget) {
      newBudget = budget;
      newBudget.expenses = item;
      newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        expenses: {
          ...budget.expenses,
          items: item.items,
          total: item.total,
        },
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
        },
      });
    }
  }

  function handleStatChange(item: Stat | undefined) {
    let newBudget: Budget;
    if (budget && item) {
      newBudget = budget;
      newBudget.stats = item;
      newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
          goal: item.goal,
          reserves: item.reserves,
        },
      });
    }
  }

  function handleAutoGoal(item: Stat | undefined) {
    let newBudget: Budget;
    if (budget && item) {
      newBudget = budget;
      newBudget.stats = item;
      newBudget.stats.goal = calcAutoGoal(budget);
      newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
      newBudget.stats.withGoal = calcWithGoal(newBudget);
      newBudget.stats.saved = calcSaved(newBudget);

      setBudget({
        ...budget,
        stats: {
          ...budget.stats,
          available: newBudget.stats.available,
          withGoal: newBudget.stats.withGoal,
          saved: newBudget.stats.saved,
          goal: newBudget.stats.goal,
          reserves: newBudget.stats.reserves,
        },
      });
    }
  }

  function handleRename(newName?: string | null) {
    let newBudget: Budget;
    if (budget && newName) {
      newBudget = {
        ...budget,
        name: newName,
      };
      setBudget(newBudget);
    }
  }

  function handleNew() {
    const newBudget = createNewBudget();

    let newBudgetList: Budget[] = [];
    if (budgetList) {
      newBudgetList = budgetList.concat(newBudget);
    } else {
      newBudgetList = newBudgetList.concat(newBudget);
    }

    setBudget(newBudget);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  }

  function handleClone() {
    if (budget) {
      const newBudget = {
        ...budget,
        id: crypto.randomUUID(),
        name: budget.name + "-clone",
      };

      let newBudgetList: Budget[] = [];
      if (budgetList) {
        newBudgetList = budgetList.concat(newBudget);
      } else {
        newBudgetList = newBudgetList.concat(newBudget);
      }

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
          if (newBudgetList.length >= 1) {
            setBudget(newBudgetList[0]);
          } else {
            setBudget(undefined);
          }
        })
        .catch((e: unknown) => {
          handleError(e);
        });
  }

  function handleSelect(o: Option[] | undefined) {
    if (o) {
      const selectedBudget = o as unknown as Budget[];
      const filteredList =
        selectedBudget &&
        budgetList?.filter((item: Budget) => item.id === selectedBudget[0].id);
      filteredList && setBudget(filteredList[0]);
    }
  }

  function handleGo(step: number, limit: number) {
    const sortedList = budgetList?.sort((a, b) => a.name.localeCompare(b.name));
    if (budget) {
      const index = sortedList?.findIndex((b) => b.name.includes(budget.name));
      if (index !== limit && sortedList) {
        handleSelect([sortedList[(index ?? 0) + step] as unknown as Option[]]);
      }
    }
  }

  function handleGoHome() {
    if (budget) {
      const name = new Date().toISOString();
      const index = budgetList?.findIndex((b) =>
        b.name.includes(name.slice(0, 7)),
      );
      if (index !== -1 && budgetList && index) {
        handleSelect([budgetList[index] as unknown as Option[]]);
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
    if (csvObject.errors.length > 0) {
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
    save(newBudget);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  }

  function handleImportJSON(fileReader: FileReader, file: File) {
    const newBudgetList: Budget[] = [];
    try {
      const list = JSON.parse(fileReader.result as string) as Budget[];
      list.forEach((b: Budget) => {
        newBudgetList.push(b);
        save(b);
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

  function handleExport(t: string) {
    if (t === "csv") handleExportCSV();
    if (t === "json") handleExportJSON();
  }

  function handleExportJSON() {
    if (budget) {
      let filename = new Date().toISOString();
      filename = `guitos-${filename.slice(0, -5)}.json`;
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(budgetList)]),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    }
  }

  function handleExportCSV() {
    if (budget) {
      const filename = `${budget.name}.csv`;

      const url = window.URL.createObjectURL(new Blob([budgetToCsv(budget)]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    }
  }

  function save(budget: Budget) {
    let list: Budget[] = [];
    budgetsDB
      .setItem(budget.id, budget)
      .then(() => {
        budgetsDB
          .iterate((value) => {
            list = list.concat(value as Budget);
          })
          .then(() => {
            setBudgetList(list);
            setBudgetNameList(createBudgetNameList(list));
          })
          .catch((e: unknown) => {
            handleError(e);
          });
      })
      .catch((e: unknown) => {
        handleError(e);
      });
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

        if (name.trim() !== "undefined") {
          setBudget(list.filter((b: Budget) => b && b.name === name)[0]);
        } else {
          setBudget(
            list
              .sort((a, b) => a.name.localeCompare(b.name))
              .reverse()
              .filter((b: Budget) => b && b.id === list[0].id)[0],
          );
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
    budget && save(budget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget]);

  useEffect(() => {
    try {
      if (budgetList && budgetList.length >= 1 && Array.isArray(budgetList)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, loading]);

  return (
    <Container fluid>
      {!showGraphs && (
        <NavBar
          onRename={(e) => {
            handleRename(e);
          }}
          onClone={() => {
            handleClone();
          }}
          onExport={(t) => {
            handleExport(t);
          }}
          onGoBack={() => {
            handleGoBack();
          }}
          onGoHome={() => {
            handleGoHome();
          }}
          onGoForward={() => {
            handleGoForward();
          }}
          onNew={() => {
            handleNew();
          }}
          onImport={(e) => {
            handleImport(e);
          }}
          onRemove={(e) => {
            handleRemove(e);
          }}
          onSelect={(e) => {
            handleSelect(e);
          }}
        />
      )}

      <LandingPage
        loading={loading}
        inputRef={inputRef}
        onNew={handleNew}
        onImport={(e) => {
          handleImport(e);
        }}
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

      {showGraphs && <ChartsPage onShowGraphs={() => setShowGraphs(false)} />}

      {!loading && !showGraphs && budget?.id && (
        <Container key={budget.id}>
          <Row className="mt-1">
            <Col md="6">
              <div className="card-columns">
                <StatCard
                  key={budget?.expenses.total + budget?.incomes.total}
                  onChange={handleStatChange}
                  onAutoGoal={handleAutoGoal}
                  onShowGraphs={() => setShowGraphs(true)}
                />

                <div className="mt-3" />

                <TableCard
                  items={budget.incomes}
                  header="Revenue"
                  onChange={handleIncomeChange}
                />
                <div className="mt-3" />
              </div>
            </Col>

            <Col md="6" className="mb-3">
              <TableCard
                items={budget.expenses}
                header="Expenses"
                onChange={handleExpenseChange}
              />
            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
}

export default BudgetPage;
