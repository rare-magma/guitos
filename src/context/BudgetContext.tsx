import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useUndoable from "use-undoable";
import { Budget } from "../components/Budget/Budget";
import { SearchOption } from "../components/NavBar/NavBar";
import { calcPercentage, createBudgetNameList } from "../utils";
import { budgetsDB } from "./db";

interface BudgetContextInterface {
  budget: Budget | undefined;
  setBudget: (value: Budget | undefined) => void;
  budgetList: Budget[] | undefined;
  setBudgetList: (value: Budget[] | undefined) => void;
  budgetNameList: SearchOption[] | undefined;
  setBudgetNameList: (value: SearchOption[] | undefined) => void;
  revenuePercentage: number;
  needReload: boolean;
  past: (Budget | undefined)[];
  future: (Budget | undefined)[];
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetInitialState: (value: Budget) => void;
}

const BudgetContext = createContext<BudgetContextInterface>({
  budget: undefined,
  setBudget: (value: Budget | undefined) => {
    value;
  },
  budgetList: [],
  setBudgetList: (value: Budget[] | undefined) => {
    value;
  },
  budgetNameList: [],
  setBudgetNameList: (value: SearchOption[] | undefined) => {
    value;
  },
  revenuePercentage: 0,
  needReload: true,
  past: [undefined],
  future: [undefined],
  undo: () => {
    // undo
  },
  redo: () => {
    // redo
  },
  reset: () => {
    // reset
  },
  canUndo: false,
  canRedo: false,
  resetInitialState: (value: Budget) => {
    value;
  },
});

function useBudget() {
  const {
    budget,
    setBudget,
    budgetList,
    setBudgetList,
    budgetNameList,
    setBudgetNameList,
    revenuePercentage,
    needReload,
    past,
    future,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    resetInitialState,
  } = useContext(BudgetContext);

  return {
    budget,
    setBudget,
    budgetList,
    setBudgetList,
    budgetNameList,
    setBudgetNameList,
    revenuePercentage,
    needReload,
    past,
    future,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    resetInitialState,
  };
}

function BudgetProvider({ children }: PropsWithChildren) {
  const [budgetList, setBudgetList] = useState<Budget[] | undefined>([]);
  const [needReload, setNeedReload] = useState(true);
  const [
    budget,
    setBudget,
    {
      past,
      future,
      undo,
      redo,
      reset,
      resetInitialState,
      canUndo: undoPossible,
      canRedo: redoPossible,
    },
  ] = useUndoable<Budget | undefined>(undefined);

  const revenuePercentage = calcPercentage(
    budget?.expenses.total ?? 0,
    budget?.incomes.total ?? 0,
  );

  const [budgetNameList, setBudgetNameList] = useState<
    SearchOption[] | undefined
  >([]);
  const previousBudgetID = past[past.length - 1]?.id;
  const futureBudgetID = future[0]?.id;

  const canReallyUndo =
    undoPossible &&
    past[past.length - 1] !== undefined &&
    budget?.id === previousBudgetID;

  const canReallyRedo =
    redoPossible && future[0] !== undefined && budget?.id === futureBudgetID;

  function save(budget: Budget | undefined) {
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

  function handleUndo() {
    setNeedReload(true);
    undo();
    setNeedReload(false);
  }

  function handleRedo() {
    setNeedReload(true);
    redo();
    setNeedReload(false);
  }

  useEffect(() => {
    save(budget);
  }, [budget]);

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setBudget,
        budgetList,
        setBudgetList,
        budgetNameList,
        setBudgetNameList,
        revenuePercentage,
        past,
        future,
        needReload,
        undo: handleUndo,
        redo: handleRedo,
        reset,
        canUndo: canReallyUndo,
        canRedo: canReallyRedo,
        resetInitialState,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { BudgetProvider, useBudget };
