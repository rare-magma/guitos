import { PropsWithChildren, createContext, useContext, useState } from "react";
import useUndoable from "use-undoable";
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
  state: Budget | undefined;
  setState: (value: Budget | undefined) => void;
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
  setState: (value: Budget | undefined) => {
    value;
  },
  state: undefined,
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
    state,
    setState,
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
    state,
    setState,
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
  const [budget, setBudget] = useState<Budget>();
  const [budgetList, setBudgetList] = useState<Budget[] | undefined>([]);
  const [
    state,
    setState,
    {
      past,
      future,
      undo,
      redo,
      reset,
      canUndo: undoPossible,
      canRedo: redoPossible,
      resetInitialState,
    },
  ] = useUndoable<Budget | undefined>(undefined);

  const revenuePercentage = calcPercentage(
    budget?.expenses.total ?? 0,
    budget?.incomes.total ?? 0,
  );

  const [budgetNameList, setBudgetNameList] = useState<
    SearchOption[] | undefined
  >([]);

  const canUndo = undoPossible && past[past.length - 1] !== undefined;
  const canRedo = redoPossible && future[0] !== undefined;

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
        state,
        setState,
        past,
        future,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
        resetInitialState,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { BudgetProvider, useBudget };
