import { useEffect, useRef, useState } from "react";
import { Budget } from "./Budget";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Stack,
  Form,
  Accordion,
  Modal,
} from "react-bootstrap";
import TableCard from "./TableCard";
import { Stat } from "./Stat";
import StatCard from "./StatCard";
import {
  calcAutoGoal,
  calcAvailable,
  calcSaved,
  calcWithGoal,
  convertCsvToBudget,
  createBudgetNameList,
  createNewBudget,
  initialCurrencyCode,
  roundBig,
  userLang,
} from "../utils";
import { Income } from "./Income";
import { Expense } from "./Expense";
import NavBar from "./NavBar";
import Papa, { ParseError } from "papaparse";
import { Option } from "react-bootstrap-typeahead/types/types";
import { BsXLg } from "react-icons/bs";
import { useHotkeys } from "react-hotkeys-hook";
import { budgetsDB, optionsDB } from "../App";
import { CurrencyInputProps } from "react-currency-input-field";
// import { useWhatChanged } from "@simbathesailor/use-what-changed";

type CsvError = {
  errors: ParseError[];
  file: string;
};

type JsonError = {
  errors: string;
  file: string;
};

function BudgetPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<CsvError[]>([]);
  const [jsonError, setJsonError] = useState<JsonError[]>([]);
  const [show, setShow] = useState(false);

  const [currency, setCurrency] = useState<string>(initialCurrencyCode);
  const [intlConfig, setIntlConfig] = useState<
    CurrencyInputProps["intlConfig"]
  >({
    locale: userLang,
    currency: currency,
  });

  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [budgetNameList, setBudgetNameList] = useState<
    { id: string; name: string }[]
  >([]);

  const params = useParams();
  const name = String(params.name);

  useHotkeys("s", () => handleExport(), { preventDefault: true });
  useHotkeys("a", () => handleNew(), { preventDefault: true });
  useHotkeys("c", () => handleClone(), { preventDefault: true });
  useHotkeys("pageup", () => handleGoForward(), { preventDefault: true });
  useHotkeys("pagedown", () => handleGoBack(), { preventDefault: true });

  const handleIncomeChange = (item: Income) => {
    let newBudget: Budget;
    if (budget !== null) {
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
  };

  const handleExpenseChange = (item: Expense) => {
    let newBudget: Budget;
    if (budget !== null) {
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
  };

  const handleStatChange = (item: Stat) => {
    let newBudget: Budget;
    if (budget !== null) {
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
  };

  const handleAutoGoal = (item: Stat) => {
    let newBudget: Budget;
    if (budget !== null) {
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
  };

  const handleRename = (newName?: string | null) => {
    let newBudget: Budget;
    if (budget !== null && newName) {
      newBudget = {
        ...budget,
        name: newName,
      };
      setBudget(newBudget);
    }
  };

  const handleNew = () => {
    const newBudget = createNewBudget();

    let newBudgetList: Budget[] = [];
    if (budgetList !== null) {
      newBudgetList = budgetList.concat(newBudget);
    } else {
      newBudgetList = newBudgetList.concat(newBudget);
    }

    setBudget(newBudget);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  };

  const handleClone = () => {
    if (budget !== null) {
      const newBudget = {
        ...budget,
        id: crypto.randomUUID(),
        name: budget.name + "-clone",
      };

      let newBudgetList: Budget[] = [];
      if (budgetList !== null) {
        newBudgetList = budgetList.concat(newBudget);
      } else {
        newBudgetList = newBudgetList.concat(newBudget);
      }

      setBudget(newBudget);
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    }
  };

  const handleRemove = (toBeDeleted: string) => {
    budgetsDB
      .removeItem(toBeDeleted)
      .then(() => {
        const newBudgetList = budgetList
          .filter((item: Budget) => item.id !== toBeDeleted)
          .sort((a, b) => a.name.localeCompare(b.name))
          .reverse();

        setBudgetList(newBudgetList);
        setBudgetNameList(
          createBudgetNameList(newBudgetList as unknown as Budget[])
        );
        if (newBudgetList.length >= 1) {
          setBudget(newBudgetList[0]);
        } else {
          setBudget(null);
        }
      })
      .catch((e) => {
        setError(e.message);
        setShow(true);
      });
  };

  const handleSelect = (budget: Option[]) => {
    const selectedBudget = budget as unknown as Budget[];
    const filteredList = budgetList.filter(
      (item: Budget) => item.id === selectedBudget[0].id
    );
    setBudget(filteredList[0]);
  };

  const handleGo = (step: number, limit: number) => {
    const sortedList = budgetList.sort((a, b) => a.name.localeCompare(b.name));
    if (budget) {
      const index = sortedList.findIndex((b) => b.name.includes(budget.name));
      if (index !== limit) {
        handleSelect([sortedList[index + step] as unknown as Option[]]);
      }
    }
  };

  const handleGoBack = () => {
    handleGo(-1, 0);
  };

  const handleGoForward = () => {
    handleGo(1, budgetList.length - 1);
  };

  const handleSetCurrency = (c: string) => {
    optionsDB.setItem("currencyCode", c).catch((e) => {
      setError(e.message);
    });
    setCurrency(c);
    setIntlConfig({ locale: userLang, currency: c as string });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const importedFiles = e.target.files;
    const newBudgetList: Budget[] = [];
    if (importedFiles === null) {
      return;
    }

    for (let i = 0; i < importedFiles.length; i++) {
      let newBudget: Budget;
      const file = importedFiles[i];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onloadend = () => {
        if (reader.result !== null) {
          if (file.type === "text/csv") {
            const csvObject = Papa.parse(reader.result as string, {
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

            newBudget = convertCsvToBudget(
              csvObject.data as string[],
              file.name.slice(0, -4)
            );
            newBudgetList.push(newBudget);
            save(newBudget);
          } else {
            try {
              const list = JSON.parse(reader.result as string);
              list.forEach((b: Budget) => {
                newBudgetList.push(b);
                save(b);
              });
            } catch (e) {
              setJsonError([
                { errors: (e as string).toString(), file: file.name },
              ]);
              setShow(true);
              setLoading(false);
            }
          }
        }
      };
    }

    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  };

  const handleExport = () => {
    let filename = new Date().toISOString();
    filename = `guitos-${filename.slice(0, -5)}.json`;
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(budgetList)])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  const save = (budget: Budget) => {
    let list: Budget[] = [];
    budgetsDB
      .setItem(budget.id, budget)
      .then(() => {
        budgetsDB
          .iterate((value) => {
            list = list.concat(value as unknown as Budget);
          })
          .then(() => {
            setBudgetList(list);
            setBudgetNameList(createBudgetNameList(list));
          })
          .catch((e) => {
            setError(e.message);
            setShow(true);
          });
      })
      .catch((e) => {
        setError(e.message);
        setShow(true);
      });
  };

  const loadFromDb = () => {
    let list: Budget[] = [];

    budgetsDB
      .iterate((value) => {
        list = list.concat(value as unknown as Budget);
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
              .filter((b: Budget) => b && b.id === list[0].id)[0]
          );
        }

        optionsDB
          .getItem("currencyCode")
          .then((c) => {
            if (c) {
              setCurrency(c as string);
              setIntlConfig({ locale: userLang, currency: c as string });
            }
          })
          .catch((e) => {
            setError(e.message);
          });

        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setShow(true);
      });
  };

  // useWhatChanged([budget, name]);

  useEffect(() => {
    if (budget) {
      save(budget);
    }
  }, [budget]);

  useEffect(() => {
    try {
      if (budgetList.length >= 1 && Array.isArray(budgetList)) {
        if (name.trim() !== "undefined") {
          budgetList
            .filter((b: Budget) => b && b.name === name)
            .forEach((data: Budget) => {
              budgetsDB
                .getItem(data.id)
                .then((b) => setBudget(b as unknown as Budget))
                .catch((e) => {
                  setError(e.message);
                  setShow(true);
                });
            });
        } else {
          budgetList.slice(0).forEach((data: Budget) => {
            budgetsDB
              .getItem(data.id)
              .then((b) => {
                setBudget(b as unknown as Budget);
              })
              .catch((e) => {
                setError(e.message);
                setShow(true);
              });
          });
        }

        optionsDB
          .getItem("currencyCode")
          .then((c) => {
            if (c) {
              setCurrency(c as string);
              setIntlConfig({ locale: userLang, currency: c as string });
            }
          })
          .catch((e) => {
            setError(e.message);
          });

        setBudgetNameList(createBudgetNameList(budgetList));
        setLoading(false);
      } else {
        loadFromDb();
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      setShow(true);
      setLoading(false);
    }
  }, [name, loading]);

  return (
    <Container fluid>
      <NavBar
        selected={budget?.name || undefined}
        id={budget?.id || undefined}
        budgetNameList={budgetNameList}
        currency={currency || initialCurrencyCode}
        onRename={(e) => {
          handleRename(e);
        }}
        onClone={() => {
          handleClone();
        }}
        onExport={() => {
          handleExport();
        }}
        onGoBack={() => {
          handleGoBack();
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
        onSetCurrency={(e) => {
          handleSetCurrency(e);
        }}
      />

      {loading && (
        <Container
          fluid
          className="position-absolute top-50 start-50 translate-middle"
        >
          <Row className="justify-content-center">
            <Spinner animation="border" role="status" />
          </Row>
        </Container>
      )}

      {error && show && (
        <Modal
          data-testid="error-modal"
          dialogClassName="modal-90w mx-auto"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header>
            Error:
            <Button
              className="align-self-end"
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={() => {
                setShow(false);
                setJsonError([]);
              }}
            >
              <BsXLg />
            </Button>
          </Modal.Header>
          <Modal.Body className="textarea mx-1">
            <p className="code">{error}</p>
          </Modal.Body>
        </Modal>
      )}

      {jsonError && jsonError.length > 0 && show && (
        <Modal
          key="json-error-modal"
          data-testid="json-error-modal"
          dialogClassName="modal-90w mx-auto"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header key="json-error-modal-header">
            Errors found while importing:
            <Button
              data-testid="json-error-close"
              className="align-self-end"
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={() => {
                setShow(false);
                setJsonError([]);
              }}
            >
              <BsXLg />
            </Button>
          </Modal.Header>
          <Modal.Body key="json-error-modal-body">
            <Accordion key="json-error-modal-accordion" flush>
              {jsonError.map((jsonError: JsonError, i: number) => (
                <Accordion.Item
                  key={jsonError.file + "-item-" + i}
                  eventKey={jsonError.file}
                >
                  <Accordion.Header key={jsonError.file + "-header-" + i}>
                    {jsonError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea code mx-1"
                    key={jsonError.file + "-body-" + i}
                  >
                    <p className="code" key={jsonError.file + "-error-" + i}>
                      <>
                        {jsonError.errors}
                        <br />
                      </>
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Modal.Body>
        </Modal>
      )}

      {csvError && csvError.length > 0 && show && (
        <Modal
          key="csv-error-modal"
          data-testid="csv-error-modal"
          dialogClassName="modal-90w mx-auto"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header key="csv-error-modal-header">
            Errors found while importing:
            <Button
              data-testid="csv-error-close"
              className="align-self-end"
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={() => {
                setShow(false);
                setCsvError([]);
              }}
            >
              <BsXLg />
            </Button>
          </Modal.Header>
          <Modal.Body key="csv-error-modal-body">
            <Accordion key="csv-error-modal-accordion" flush>
              {csvError.map((csvError: CsvError, i: number) => (
                <Accordion.Item
                  key={csvError.file + "-item-" + i}
                  eventKey={csvError.file}
                >
                  <Accordion.Header key={csvError.file + "-header-" + i}>
                    {csvError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea code mx-1"
                    key={csvError.file + "-body-" + i}
                  >
                    <p className="code" key={csvError.file + "-csv-error-" + i}>
                      {csvError.errors.map((error) => (
                        <span key={error.row}>
                          Line {error.row}: {error.message}
                          <br />
                        </span>
                      ))}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Modal.Body>
        </Modal>
      )}

      {!loading && !budget && budgetList.length < 1 && (
        <Container className="position-absolute top-50 start-50 translate-middle">
          <Row className="justify-content-center align-content-center">
            <Stack gap={3}>
              <Button
                className="w-25 align-self-center"
                aria-label="new budget"
                variant="outline-success"
                onClick={handleNew}
              >
                new
              </Button>
              <Form.Group className="w-25 align-self-center" controlId="import">
                <Button
                  className="w-100"
                  aria-label="import budget"
                  variant="outline-primary"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  import
                </Button>
                <Form.Control
                  type="file"
                  multiple
                  ref={inputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleImport(e);
                  }}
                  style={{ display: "none" }}
                />
              </Form.Group>
            </Stack>
          </Row>
        </Container>
      )}

      {!loading && budget && (
        <Container key={budget.id}>
          <Row className="mt-3">
            <Col md="6">
              <div className="card-columns">
                <StatCard
                  key={"stats-" + budget.expenses.total + budget.incomes.total}
                  stat={budget.stats}
                  intlConfig={intlConfig}
                  onChange={handleStatChange}
                  onAutoGoal={handleAutoGoal}
                />

                <div className="mt-3" />

                <TableCard
                  items={budget.incomes}
                  intlConfig={intlConfig}
                  revenueTotal={budget.incomes.total}
                  header="Revenue"
                  onChange={handleIncomeChange}
                />
                <div className="mt-3" />
              </div>
            </Col>

            <Col md="6" className="mb-3">
              <TableCard
                items={budget.expenses}
                intlConfig={intlConfig}
                revenueTotal={budget.incomes.total}
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
