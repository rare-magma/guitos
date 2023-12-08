import { PropsWithChildren, createContext, useContext, useState } from "react";
import useUndo from "use-undo";
import { Budget } from "../components/Budget/Budget";
import { SearchOption } from "../components/NavBar/NavBar";
import { calcPercentage } from "../utils";

interface BudgetContextInterface {
  budget: Budget | undefined;
  setBudget: (value: Budget | undefined) => void;
  budgetList: Budget[] | undefined;
  setBudgetList: (value: Budget[] | undefined) => void;
  budgetNameList: SearchOption[] | undefined;
  setBudgetNameList: (value: SearchOption[] | undefined) => void;
  revenuePercentage: number;
  needReload: boolean;
  setNeedReload: (value: boolean) => void;
  past: (Budget | undefined)[];
  future: (Budget | undefined)[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
  setNeedReload: (value: boolean) => {
    value;
  },
  past: [undefined],
  future: [undefined],
  undo: () => {
    // undo
  },
  redo: () => {
    // redo
  },
  canUndo: false,
  canRedo: false,
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
    setNeedReload,
    past,
    future,
    undo,
    redo,
    canUndo,
    canRedo,
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
    setNeedReload,
    past,
    future,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

function BudgetProvider({ children }: PropsWithChildren) {
  const [budgetList, setBudgetList] = useState<Budget[] | undefined>([]);
  const [needReload, setNeedReload] = useState(true);
  const [
    budgetState,
    {
      set: setBudget,
      undo,
      redo,
      canUndo: undoPossible,
      canRedo: redoPossible,
    },
  ] = useUndo<Budget | undefined>(undefined);
  const { present: budget, past, future } = budgetState;

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

  function handleUndo() {
    if (canReallyUndo) {
      setNeedReload(true);
      undo();
      setNeedReload(false);
    }
  }

  function handleRedo() {
    if (canReallyRedo) {
      setNeedReload(true);
      redo();
      setNeedReload(false);
    }
  }

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
        setNeedReload,
        undo: handleUndo,
        redo: handleRedo,
        canUndo: canReallyUndo,
        canRedo: canReallyRedo,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { BudgetProvider, useBudget };
