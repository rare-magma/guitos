import { produce } from "immer";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useParams } from "react-router-dom";
import { Budget } from "../components/Budget/Budget";
import { CalculationHistoryItem } from "../components/CalculateButton/CalculateButton";
import { Filter, FilteredItem } from "../components/ChartsPage/ChartsPage";
import { SearchOption } from "../components/NavBar/NavBar";
import { useBudget } from "../context/BudgetContext";
import { useConfig } from "../context/ConfigContext";
import { useGeneralContext } from "../context/GeneralContext";
import { budgetsDB, calcHistDB, optionsDB } from "../db";
import {
  convertCsvToBudget,
  createBudgetNameList,
  createNewBudget,
  userLang,
} from "../utils";

export function useDB() {
  const [options, setOptions] = useState<Option[]>([]);
  const { setIntlConfig, handleCurrency } = useConfig();
  const params = useParams();
  const name = String(params.name);
  const {
    setShowError,
    handleError,
    csvErrors,
    setCsvErrors,
    setJsonErrors,
    setNeedReload,
    setLoadingFromDB,
    notifications,
    setNotifications,
  } = useGeneralContext();

  const {
    budget,
    setBudget,
    budgetList,
    setBudgetList,
    budgetNameList,
    setBudgetNameList,
  } = useBudget();

  function createBudget() {
    const newBudget = createNewBudget();

    let newBudgetList: Budget[] = [];
    newBudgetList = budgetList
      ? budgetList.concat(newBudget)
      : newBudgetList.concat(newBudget);

    setBudget(newBudget, true);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));

    setNotifications(
      produce(notifications, (draft) => {
        draft.push({
          show: true,
          id: crypto.randomUUID(),
          body: `created "${newBudget.name}" budget`,
        });
      }),
    );
  }

  function cloneBudget() {
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

      setNotifications(
        produce(notifications, (draft) => {
          draft.push({
            show: true,
            id: crypto.randomUUID(),
            body: `cloned "${newBudget.name}" budget`,
          });
        }),
      );
      setBudget(newBudget, true);
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    }
  }

  function deleteBudget(toBeDeleted: string) {
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

          setNotifications(
            produce(notifications, (draft) => {
              draft.push({
                show: true,
                showUndo: true,
                id: crypto.randomUUID(),
                body: `deleted "${budget?.name}" budget`,
              });
            }),
          );
          if (newBudgetList.length >= 1) {
            setBudget(newBudgetList[0], true);
          } else {
            setBudget(undefined, true);
          }
        })
        .catch((e: unknown) => {
          handleError(e);
        });
  }

  function importCSV(fileReader: FileReader, file: File) {
    const newBudgetList: Budget[] = [];
    const csvObject = Papa.parse(fileReader.result as string, {
      header: true,
      skipEmptyLines: "greedy",
    });

    const hasErrors = csvObject.errors.length > 0;

    if (hasErrors) {
      csvErrors.push({
        errors: csvObject.errors,
        file: file.name,
      });
      setCsvErrors(csvErrors);
      setShowError(true);
      setLoadingFromDB(false);

      return;
    }

    const newBudget = convertCsvToBudget(
      csvObject.data as string[],
      file.name.slice(0, -4),
    );
    newBudgetList.push(newBudget);
    budgetsDB.setItem(newBudget.id, newBudget).catch((e) => {
      throw e;
    });
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  }

  function importJSON(fileReader: FileReader, file: File) {
    const newBudgetList: Budget[] = [];
    try {
      const list = JSON.parse(fileReader.result as string) as Budget[];
      list.forEach((b: Budget) => {
        newBudgetList.push(b);
        budgetsDB.setItem(b.id, b).catch((e) => {
          throw e;
        });
      });
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    } catch (e) {
      setJsonErrors([{ errors: (e as string).toString(), file: file.name }]);
      setShowError(true);
      setLoadingFromDB(false);
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    setLoadingFromDB(true);
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
            importCSV(reader, file);
          } else {
            importJSON(reader, file);
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
          setBudget(newBudget, false);
        } else {
          newBudget = list
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse()
            .filter((b: Budget) => b && b.id === list[0].id)[0];
          setBudget(newBudget, false);
        }

        loadCurrencyOption();
        setLoadingFromDB(false);
      })
      .catch((e) => {
        handleError(e);
      });
  }

  function loadBudget(list: Budget[]) {
    list.forEach((data: Budget) => {
      budgetsDB
        .getItem(data.id)
        .then((b) => {
          setBudget(b as Budget, false);
        })
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

  function searchBudgets() {
    let options: SearchOption[] = [];

    budgetsDB
      .iterate((budget: Budget) => {
        options = options.concat(
          budget.incomes.items.map((i) => {
            return {
              id: budget.id,
              item: i.name,
              name: budget.name,
            };
          }),
          budget.expenses.items.map((i) => {
            return {
              id: budget.id,
              item: i.name,
              name: budget.name,
            };
          }),
        );
      })
      .then(() => {
        if (budgetNameList) {
          options = options.concat(budgetNameList);
        }
        setOptions(
          options.sort((a, b) => a.name.localeCompare(b.name)).reverse(),
        );
      })
      .catch((e) => {
        throw new Error(e as string);
      });
  }

  function searchBudgetsWithFilter() {
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

  function selectBudgetsWithFilter(
    option: Option[],
    filter: Filter,
    strictFilter: boolean,
  ) {
    const newFilter = option[0] as FilteredItem;
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

    return { filteredIncomes, filteredExpenses };
  }
  function renameBudget(event: React.ChangeEvent<HTMLInputElement>) {
    if (budget && event.target.value) {
      const newState = produce((draft) => {
        draft.name = event.target.value;
      }, budget);
      setBudget(newState(), false);
    }
  }

  async function getCalcHist(id: string): Promise<CalculationHistoryItem[]> {
    let item;
    await calcHistDB
      .getItem(id)
      .then((i) => {
        item = i;
      })
      .catch((e: unknown) => {
        throw e;
      });
    return item ?? [];
  }

  async function saveCalcHist(id: string, item: CalculationHistoryItem) {
    const calcHist = await getCalcHist(id);
    const newCalcHist = [...calcHist, item];
    calcHistDB.setItem(id, newCalcHist).catch((e: unknown) => {
      throw e;
    });
  }

  async function deleteCalcHist(id: string) {
    await calcHistDB.removeItem(id).catch((e: unknown) => {
      throw e;
    });
  }

  function saveBudget(budget: Budget | undefined) {
    if (!budget) return;
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
            setNeedReload(true);
          })
          .catch((e: unknown) => {
            throw e;
          });
      })
      .catch((e: unknown) => {
        throw e;
      });
  }

  useEffect(() => {
    saveBudget(budget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget]);

  return {
    createBudget,
    cloneBudget,
    handleImport,
    deleteBudget,
    renameBudget,
    searchBudgets,
    searchBudgetsWithFilter,
    selectBudgetsWithFilter,
    saveBudget,
    loadCurrencyOption,
    loadBudget,
    loadFromDb,
    options,
    getCalcHist,
    saveCalcHist,
    deleteCalcHist,
  };
}
