import {
  BudgetCsvService,
  type CsvRow,
} from "@guitos/application/react/budgetCsvService";
import { useBudget } from "@guitos/application/react/context/BudgetContext";
import { useErrorContext } from "@guitos/application/react/context/ErrorContext";
import { useLoadingContext } from "@guitos/application/react/context/LoadingContext";
import { useNotificationContext } from "@guitos/application/react/context/NotificationContext";
import type {
  Filter,
  FilteredItem,
} from "@guitos/application/react/sections/ChartsPage/ChartsPage";
import type { SearchOption } from "@guitos/application/react/sections/NavBar/NavBar";
import { createBudgetNameList } from "@guitos/application/react/utils";
import { ImportBudgetCsvCommand } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommand";
import { FindAllBudgetsQuery } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsQuery";
import type { FindAllBudgetsResponse } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsResponse";
import { PersistLastOpenedBudgetCommand } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommand";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import type { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { LocalForageBudgetRepository } from "@guitos/contexts/budget/infrastructure/localForageBudgetRepository";
import type { Primitives } from "@shared/domain/primitives";
import { Uuid } from "@shared/domain/uuid";
import { commandBus, queryBus } from "@shared/infrastructure/buses";
import { produce } from "immer";
import Papa from "papaparse";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Option } from "react-bootstrap-typeahead/types/types";
import { useLocation, useParams } from "wouter";

const budgetRepository = new LocalForageBudgetRepository();

export function useDB() {
  const [options, setOptions] = useState<Option[]>([]);
  const params = useParams();
  const name = String(params.name);
  const [_, navigate] = useLocation();

  const navigateCallback = useCallback(
    (to: string | URL) => navigate(to),
    [navigate],
  );

  const { setShouldReload, setLoadingFromDB } = useLoadingContext();
  const { notifications, setNotifications } = useNotificationContext();
  const { setShowError, handleError, csvErrors, setCsvErrors, setJsonErrors } =
    useErrorContext();

  const {
    budget,
    setBudget,
    budgetList,
    setBudgetList,
    budgetNameList,
    setBudgetNameList,
  } = useBudget();

  const previousBudget = useRef<string | undefined>(budget?.name);

  function createBudget() {
    const newBudget = Budget.create();

    let newBudgetList: Budget[] = [];
    newBudgetList = budgetList
      ? budgetList.concat(newBudget)
      : newBudgetList.concat(newBudget);

    budgetRepository.save(newBudget.id, newBudget.toPrimitives()).then(() => {
      setBudget(newBudget.toPrimitives(), true);
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));

      setNotifications(
        produce(notifications, (draft) => {
          draft.push({
            show: true,
            id: Uuid.random().toString(),
            body: `created "${newBudget.name}" budget`,
          });
        }),
      );
    });
  }

  function cloneBudget() {
    if (!budget) {
      return;
    }

    const newBudget = Budget.clone(budget);
    let newBudgetList: Budget[] = [];
    newBudgetList = budgetList
      ? budgetList.concat(newBudget)
      : newBudgetList.concat(newBudget);

    setNotifications(
      produce(notifications, (draft) => {
        draft.push({
          show: true,
          id: Uuid.random().toString(),
          body: `cloned "${newBudget.name}" budget`,
        });
      }),
    );
    budgetRepository.save(newBudget.id, newBudget.toPrimitives()).then(() => {
      setBudget(newBudget.toPrimitives(), true);
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    });
  }

  function deleteBudget(toBeDeleted: string) {
    if (!budgetList) return;
    budgetRepository
      .delete(new Uuid(toBeDeleted))
      .then(() => {
        const newBudgetList = budgetList
          .filter((item: Primitives<Budget>) => item.id !== toBeDeleted)
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .toReversed();

        setBudgetList(newBudgetList);
        setBudgetNameList(createBudgetNameList(newBudgetList));

        setNotifications(
          produce(notifications, (draft) => {
            draft.push({
              show: true,
              showUndo: true,
              id: Uuid.random().value,
              body: `deleted "${budget?.name}" budget`,
            });
          }),
        );
        if (newBudgetList.length >= 1) {
          setBudget(newBudgetList[0], true);
        } else {
          setBudget(null, true);
          localStorage.setItem("guitos_lastOpenedBudget", "");
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

    const newBudget = BudgetCsvService.fromCsv(
      csvObject.data as CsvRow[],
      file.name.slice(0, -4),
    );
    newBudgetList.push(newBudget);
    budgetRepository.save(newBudget.id, newBudget.toPrimitives()).then(() => {
      setBudgetList(newBudgetList);
      setBudgetNameList(createBudgetNameList(newBudgetList));
    });
  }

  function importJSON(fileReader: FileReader, file: File) {
    try {
      const list = JSON.parse(fileReader.result as string) as Primitives<
        Budget[]
      >;
      for (const b of list) {
        budgetRepository.save(new Uuid(b.id), new Budget(b).toPrimitives());
      }
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
      reader.onloadend = async () => {
        if (!reader.result) {
          return;
        }
        if (file.type === "text/csv") {
          await commandBus.dispatch(
            new ImportBudgetCsvCommand({
              budgetName: file.name,
              csv: reader.result.toString(),
            }),
          );
        } else {
          importJSON(reader, file);
        }
      };
    }
  }

  async function loadFromDb() {
    const { budgets: list } = await queryBus.ask<FindAllBudgetsResponse>(
      new FindAllBudgetsQuery(),
    );
    setBudgetList(list);
    setBudgetNameList(createBudgetNameList(list));

    let newBudget: Budget;
    if (name.trim() !== "undefined") {
      newBudget = list.filter((b: Budget) => b && b.name === name)[0];
    }

    // load latest if budget name is not found
    if (newBudget === undefined) {
      newBudget = list.filter((b: Budget) => b && b.id === list[0].id)[0];
    }

    setBudget(newBudget, false);
    setLoadingFromDB(false);
  }

  function loadBudget(list: Budget[]) {
    for (const data of list) {
      budgetRepository
        .find(data.id)
        .then((b: Primitives<Budget>) => {
          setBudget(b, false);
        })
        .catch((e) => {
          handleError(e);
        });
    }
  }

  function searchBudgets() {
    let options: SearchOption[] = [];

    budgetRepository
      .findAll()
      .then((list) => {
        for (const budget of list) {
          options = options.concat(
            budget.incomes.items.map((i: BudgetItem) => {
              return {
                id: budget.id,
                item: i.name,
                name: budget.name,
              };
            }),
            budget.expenses.items.map((i: BudgetItem) => {
              return {
                id: budget.id,
                item: i.name,
                name: budget.name,
              };
            }),
          );
        }
      })
      .then(() => {
        if (budgetNameList) {
          options = options.concat(budgetNameList);
        }
        setOptions(
          options
            .toSorted((a, b) => a.name?.localeCompare(b.name))
            .toReversed(),
        );
      })
      .catch((e) => {
        throw new Error(e as string);
      });
  }

  function searchBudgetsWithFilter() {
    let options: FilteredItem[] = [];
    budgetRepository
      .findAll()
      .then((list) => {
        for (const budget of list) {
          options = options.concat(
            budget.incomes.items.map((i: BudgetItem) => {
              return {
                id: budget.id,
                name: budget.name,
                item: i.name,
                amount: i.amount,
                type: "Incomes",
              };
            }),
            budget.expenses.items.map((i: BudgetItem) => {
              return {
                id: budget.id,
                name: budget.name,
                item: i.name,
                amount: i.amount,
                type: "Expenses",
              };
            }),
          );
        }
      })
      .then(() => {
        setOptions(
          options
            .toSorted((a, b) => a.name?.localeCompare(b.name))
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter((i) => i.value)
            .toReversed(),
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
    const filteredIncomes = budgetList?.flatMap((b: Budget) => {
      return b.incomes.items
        .filter((i: BudgetItem) =>
          i.amount && strictFilter
            ? i.name === filter.value
            : i.name.toLowerCase().includes(filter.value.toLowerCase()),
        )
        .map((i: BudgetItem) => {
          return {
            id: b.id,
            name: b.name,
            item: i.name,
            value: i.amount,
            type: "Incomes",
          };
        })
        .filter((i: FilteredItem) => i.type.includes(newFilter.type));
    });

    const filteredExpenses = budgetList?.flatMap((b: Budget) => {
      return b.expenses.items
        .filter((i: BudgetItem) =>
          i.amount && strictFilter
            ? i.name === filter.value
            : i.name.toLowerCase().includes(filter.value.toLowerCase()),
        )
        .map((i: BudgetItem) => {
          return {
            id: b.id,
            name: b.name,
            item: i.name,
            value: i.amount,
            type: "Expenses",
          };
        })
        .filter((i: FilteredItem) => i.type.includes(newFilter.type));
    });

    return { filteredIncomes, filteredExpenses };
  }

  function renameBudget(event: React.ChangeEvent<HTMLInputElement>) {
    if (budget && event.target.value) {
      const newState = produce((draft) => {
        draft.name = event.target.value;
      }, budget);

      budgetRepository.save(budget.id, budget.toPrimitives()).then(() => {
        setBudget(newState(), false);
      });
    }
  }

  const saveBudget = useCallback(
    (budget: Budget | undefined) => {
      if (!budget) return;
      budgetRepository.save(budget.id, budget.toPrimitives()).then(() => {
        budgetRepository.findAll().then((list) => {
          setBudgetList(list);
          setBudgetNameList(createBudgetNameList(list));
          setShouldReload(true);
        });
      });
    },
    [setBudgetList, setBudgetNameList, setShouldReload],
  );

  useEffect(() => {
    async function handle() {
      if (budget && budget.name !== previousBudget.current) {
        navigateCallback(`/${budget.name}`);
        await commandBus.dispatch(
          new PersistLastOpenedBudgetCommand({ budgetName: budget.name }),
        );
        previousBudget.current = budget.name;
      }
    }
    handle();
  }, [budget, navigateCallback]);

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
    loadBudget,
    loadFromDb,
    options,
  };
}
