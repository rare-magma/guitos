import { useEffect, useRef, useState } from "react";
import { Budget } from "./Budget";
import { useNavigate, useParams } from "react-router-dom";
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
  calcAvailable,
  calcSaved,
  calcWithGoal,
  convertCsvToBudget,
  createNewBudget,
} from "../utils";
import { Income } from "./Income";
import { Expense } from "./Expense";
import NavBar from "./NavBar";
import Papa, { ParseError } from "papaparse";
import localforage from "localforage";
import { Option } from "react-bootstrap-typeahead/types/types";
import { BsXLg } from "react-icons/bs";

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

  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [budgetNameList, setBudgetNameList] = useState<
    { id: string; name: string }[]
  >([]);

  const params = useParams();
  const name = String(params.name);
  const navigate = useNavigate();

  const calcBudgetListName = (list: Budget[]) => {
    setBudgetNameList(
      list
        .filter((b: Budget) => b && b.id !== undefined && b.name !== undefined)
        .map((b: Budget) => {
          return { id: b.id, name: b.name };
        })
    );
  };

  const handleIncomeChange = (item: Income) => {
    let newBudget: Budget;
    if (budget !== null) {
      newBudget = budget;
      newBudget.incomes = item;
      newBudget.stats.available = calcAvailable(newBudget);
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
      newBudget.stats.available = calcAvailable(newBudget);
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
      newBudget.stats.available = calcAvailable(newBudget);
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

  const handleRename = (newName?: string | null) => {
    let newBudget: Budget;
    if (budget !== null && newName) {
      newBudget = budget;
      newBudget.name = newName;
      setBudget({
        ...budget,
        name: newBudget.name,
      });
      save(budget);
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
    localforage
      .setItem(newBudget.id, newBudget)
      .then(() => {
        setBudget(newBudget);
        setBudgetList(newBudgetList);
        navigate("/" + newBudget.name);
        navigate(0);
      })
      .catch((e) => {
        setError(e.message);
        setShow(true);
      });
  };

  const handleClone = () => {
    if (budget !== null) {
      const newBudget = budget;
      newBudget.id = crypto.randomUUID();
      newBudget.name = budget.name + "-clone";
      let newBudgetList: Budget[] = [];
      if (budgetList !== null) {
        newBudgetList = budgetList.concat(newBudget);
      } else {
        newBudgetList = newBudgetList.concat(newBudget);
      }
      localforage
        .setItem(newBudget.id, newBudget)
        .then(() => {
          setBudget(newBudget);
          setBudgetList(newBudgetList);
          navigate("/" + newBudget.name);
          navigate(0);
        })
        .catch((e) => {
          setError(e.message);
          setShow(true);
        });
    }
  };

  const handleRemove = (toBeDeleted: string) => {
    localforage
      .removeItem(toBeDeleted)
      .then(() => {
        const newBudgetList = budgetList
          .filter((item: Budget) => item.id !== toBeDeleted)
          .sort((a, b) => a.name.localeCompare(b.name))
          .reverse();

        setBudgetList(newBudgetList);
        setBudget(newBudgetList[0]);
        if (newBudgetList.length >= 1) {
          navigate("/" + newBudgetList[0].name);
          navigate(0);
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
    navigate("/" + selectedBudget[0].name);
    navigate(0);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedFiles = e.target.files;
    const newBudgetList: string[] = [];
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
            newBudgetList.push(newBudget as unknown as string);
            localforage
              .setItem(newBudget.id, newBudget)
              .then(() => {
                setBudget(newBudget);
              })
              .catch((e) => {
                setError(e.message);
                setShow(true);
              });
          } else {
            try {
              const list = JSON.parse(reader.result as string);
              list.forEach((b: string) => {
                newBudgetList.push(b);
                localforage
                  .setItem((b as unknown as Budget).id, b)
                  .then(() => {
                    setBudget(b as unknown as Budget);
                  })
                  .catch((e) => {
                    setError(e.message);
                    setShow(true);
                  });
              });
            } catch (e) {
              setJsonError([{ errors: e.toString(), file: file.name }]);
              setShow(true);
              setLoading(false);
            }
          }
        }
      };
    }

    setBudgetList(newBudgetList as unknown as Budget[]);
    calcBudgetListName(newBudgetList as unknown as Budget[]);
    setLoading(false);
  };

  const handleDownload = () => {
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
    const newBudgetList = budgetList.map((data: Budget) => {
      if (budget.id === data.id) {
        return budget;
      } else {
        return data;
      }
    });
    localforage
      .setItem(budget.id, budget)
      .then(() => {
        setBudgetList(newBudgetList);
      })
      .catch((e) => {
        setError(e.message);
        setShow(true);
      });
  };

  useEffect(() => {
    setLoading(true);
    try {
      if (budgetList.length >= 1 && Array.isArray(budgetList)) {
        budgetList
          .filter((budget: Budget) => budget && budget.name === name)
          .forEach((data: Budget) => {
            setBudget(data);
            save(data);
          });
        calcBudgetListName(budgetList);
      } else {
        let list: Budget[] = [];
        localforage
          .iterate((value) => {
            list = list.concat(value as unknown as Budget);
          })
          .then(() => {
            setBudgetList(list);
            if (list.length >= 1 && Array.isArray(list)) {
              list
                .filter((budget: Budget) => budget && budget.name === name)
                .forEach((data: Budget) => {
                  setBudget(data);
                });
              calcBudgetListName(list);
            }
          })
          .catch((e) => {
            setError(e.message);
            setShow(true);
          });
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      setShow(true);
    } finally {
      setLoading(false);
    }
  }, [name, budget, loading]);

  return (
    <Container fluid>
      <NavBar
        selected={budget?.name || undefined}
        id={budget?.id || undefined}
        budgetNameList={budgetNameList}
        onRename={(e) => {
          handleRename(e);
        }}
        onClone={() => {
          handleClone();
        }}
        onDownload={() => {
          handleDownload();
        }}
        onNew={() => {
          handleNew();
        }}
        onUpload={(e) => {
          setLoading(true);
          handleUpload(e);
        }}
        onRemove={(e) => {
          handleRemove(e);
        }}
        onSelect={(e) => {
          handleSelect(e);
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
          dialogClassName="modal-90w mx-auto"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header>
            Errors found while importing:
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
          <Modal.Body>
            <Accordion flush>
              {jsonError.map((jsonError: JsonError) => (
                <Accordion.Item
                  key={jsonError.file + "-item"}
                  eventKey={jsonError.file}
                >
                  <Accordion.Header key={jsonError.file + "-header"}>
                    {jsonError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea code mx-1"
                    key={jsonError.file + "-body"}
                  >
                    <p className="code" key={"error-" + jsonError.file + "-"}>
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
          dialogClassName="modal-90w mx-auto"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header>
            Errors found while importing:
            <Button
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
          <Modal.Body>
            <Accordion flush>
              {csvError.map((csvError: CsvError) => (
                <Accordion.Item
                  key={csvError.file + "-item"}
                  eventKey={csvError.file}
                >
                  <Accordion.Header key={csvError.file + "-header"}>
                    {csvError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea code mx-1"
                    key={csvError.file + "-body"}
                  >
                    <p className="code" key={"error-" + csvError.file + "-"}>
                      {csvError.errors.map((error, j) => (
                        <>
                          Line {error.row}: {error.message}
                          <br />
                        </>
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
                  onChange={(e) => {
                    handleUpload(e);
                  }}
                  style={{ display: "none" }}
                />
              </Form.Group>
            </Stack>
          </Row>
        </Container>
      )}

      {!loading && budget && (
        <Container>
          <Row className="mt-3">
            <Col md="6">
              <div className="card-columns">
                <StatCard stat={budget.stats} onChange={handleStatChange} />

                <div className="mt-3" />

                <TableCard
                  items={budget.incomes}
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
