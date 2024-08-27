import { produce } from "immer";
import Papa from "papaparse";
import React, { useCallback, useEffect, useState } from "react";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useParams } from "react-router-dom";
import { Filter, FilteredItem } from "../components/ChartsPage/ChartsPage";
import { SearchOption } from "../components/NavBar/NavBar";
import { useBudget } from "../context/BudgetContext";
import { useConfig } from "../context/ConfigContext";
import { useGeneralContext } from "../context/GeneralContext";
import { convertCsvToBudget, createBudgetNameList, userLang } from "../utils";
import Budget from "../guitos/domain/budget";
import { localForageCalcHistRepository } from "../guitos/infrastructure/localForageCalcHistRepository";
import Uuid from "../guitos/domain/uuid";
import { localForageOptionsRepository } from "../guitos/infrastructure/localForageOptionsRepository";
import CalculationHistoryItem from "../guitos/domain/calculationHistoryItem";
import { localForageBudgetRepository } from "../guitos/infrastructure/localForageBudgetRepository";

const budgetRepository = new localForageBudgetRepository();
const optionsRepository = new localForageOptionsRepository();
const calcHistRepository = new localForageCalcHistRepository();

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
    const newBudget = Budget.create();

    let newBudgetList: Budget[] = [];
    newBudgetList = budgetList
      ? budgetList.concat(newBudget)
      : newBudgetList.concat(newBudget);

    budgetRepository.update(newBudget.id, newBudget);
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
        id: Uuid.random(),
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
      budgetRepository.update(newBudget.id, newBudget);
      setBudget(newBudget, true);
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    }
  }

  function deleteBudget(toBeDeleted: Uuid) {
    budgetList &&
      budgetRepository
        .delete(toBeDeleted)
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
    budgetRepository.update(newBudget.id, newBudget);
    setBudgetList(newBudgetList);
    setBudgetNameList(createBudgetNameList(newBudgetList));
  }

  function importJSON(fileReader: FileReader, file: File) {
    try {
      const list = JSON.parse(fileReader.result as string) as Budget[];
      list.forEach((b: Budget) => {
        budgetRepository.update(b.id, b);
      });
      setBudgetList(list);
      setBudgetNameList(createBudgetNameList(list));
      setBudget(list[0], false);
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
    budgetRepository
      .getAll()
      .then((list) => {
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
      budgetRepository
        .get(data.id)
        .then((b: Budget) => {
          setBudget(b, false);
        })
        .catch((e) => {
          handleError(e);
        });
    });
  }

  function loadCurrencyOption() {
    optionsRepository
      .getCurrencyCode()
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

    budgetRepository
      .getAll()
      .then((list) =>
        list.forEach((budget) => {
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
        }),
      )
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
    budgetRepository
      .getAll()
      .then((list) =>
        list.forEach((budget) => {
          options = options.concat(
            budget.incomes.items.map((i) => {
              return {
                id: budget.id,
                name: budget.name,
                item: i.name,
                value: i.value,
                type: "Incomes",
              };
            }),
            budget.expenses.items.map((i) => {
              return {
                id: budget.id,
                name: budget.name,
                item: i.name,
                value: i.value,
                type: "Expenses",
              };
            }),
          );
        }),
      )
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
              type: "Incomes",
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
              type: "Expenses",
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

      // budgetRepository.update(budget.id, budget).then(() => {
      setBudget(newState(), false);
      // });
    }
  }

  const getCalcHist = useCallback(
    async (id: string): Promise<CalculationHistoryItem[] | null> => {
      return calcHistRepository.get(id);
    },
    [],
  );

  async function saveCalcHist(id: string, item: CalculationHistoryItem) {
    const calcHist = await getCalcHist(id);
    const newCalcHist = calcHist ? [...calcHist, item] : [item];
    calcHistRepository.update(id, newCalcHist).catch((e: unknown) => {
      throw e;
    });
  }

  async function deleteCalcHist(id: string) {
    return await calcHistRepository.delete(id);
  }

  const saveBudget = useCallback(
    (budget: Budget | undefined) => {
      if (!budget) return;
      budgetRepository.update(budget.id, budget).then(() => {
        budgetRepository.getAll().then((list) => {
          setBudgetList(list);
          setBudgetNameList(createBudgetNameList(list));
          setNeedReload(true);
        });
      });
    },
    [setBudgetList, setBudgetNameList, setNeedReload],
  );

  useEffect(() => void saveBudget(budget), [budget, saveBudget]);

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
