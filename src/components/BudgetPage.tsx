import { useEffect, useState } from "react";
import { Budget } from "./Budget";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
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

function BudgetPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);

  const [budgetList, setBudgetList] = useState<Budget[]>([]);

  let budgetNameList: ({ id: string; name: string } | undefined)[] = [];
  if (budgetList.length >= 1 && Array.isArray(budgetList)) {
    budgetNameList = budgetList
      .filter((b: Budget) => b && b.id !== undefined && b.name !== undefined)
      .map((b: Budget) => {
        return { id: b.id, name: b.name };
      });
  }

  const [csvError, setCsvError] = useState<ParseError[] | undefined>([]);
  const [csvErrorFiles, setCsvErrorFiles] = useState<string[] | undefined>([]);
  const [show, setShow] = useState(false);
  const params = useParams();
  const name = String(params.name);
  const navigate = useNavigate();

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
              setCsvError(csvError?.concat(csvObject.errors));
              setCsvErrorFiles(csvErrorFiles?.concat(file.name));
              setShow(true);
            }

            newBudget = convertCsvToBudget(
              csvObject.data as string[],
              file.name.slice(0, -4)
            );
            newBudgetList.push(newBudget as unknown as string);
            localforage
              .setItem(newBudget.id, newBudget)
              .then(() => {
                setBudgetList(newBudgetList as unknown as Budget[]);
                setBudget(budgetList[-1]);
              })
              .catch((e) => {
                setError(e.message);
                setShow(true);
              });
          } else {
            const list = JSON.parse(reader.result as string);
            list.forEach((b: string) => {
              localforage
                .setItem((b as unknown as Budget).id, b)
                .then(() => {
                  setBudgetList(budgetList.concat(newBudget));
                  setBudget(budgetList[0]);
                })
                .catch((e) => {
                  setError(e.message);
                  setShow(true);
                });
            });
          }
        }
      };
    }
    setLoading(false);
  };

  const handleDownload = () => {
    let filename = new Date().toISOString();
    filename = `guitos-${filename}.json`;
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
    <Container fluid className="vh-100">
      <Row className="flex-column h-100 g-0">
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
          <Container fluid className="flex-grow-1">
            <Row className="h-100 flex-grow-1 justify-content-center align-content-center">
              <Spinner animation="border" role="status"></Spinner>
            </Row>
          </Container>
        )}

        {error && show && (
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{error}</Alert.Heading>
          </Alert>
        )}

        {csvError &&
          show &&
          csvErrorFiles &&
          csvErrorFiles.map((file) => (
            <Alert
              key={file}
              variant="danger"
              onClose={() => setShow(false)}
              dismissible
            >
              <Alert.Heading>
                Errors found while importing {file}:
              </Alert.Heading>
              {csvError.map((error) => (
                <>
                  <p>
                    On line {error.row}: {error.message}
                  </p>
                </>
              ))}
            </Alert>
          ))}

        {!loading && budget && (
          <div className="mt-3">
            <Container>
              <Row>
                <Col md="6">
                  <div className="card-columns">
                    <StatCard stat={budget.stats} onChange={handleStatChange} />

                    <div className="mt-3" />

                    <TableCard
                      items={budget.incomes}
                      header="Revenue"
                      onChange={handleIncomeChange}
                    />
                    <div className="mt-3" />
                  </div>
                </Col>

                <Col md="6">
                  <TableCard
                    items={budget.expenses}
                    header="Expenses"
                    onChange={handleExpenseChange}
                  />
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default BudgetPage;
