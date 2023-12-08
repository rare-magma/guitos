/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  past: (Budget | undefined)[];
  future: (Budget | undefined)[];
  undo: (
    setBudget: (value: Budget | undefined) => void,
    past: Budget[] | undefined,
  ) => void;
  redo: (
    setBudget: (value: Budget | undefined) => void,
    future: Budget[] | undefined,
  ) => void;
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
  past: [undefined],
  future: [undefined],
  undo: (
    setBudget: (value: Budget | undefined) => void,
    past: Budget[] | undefined,
  ) => {
    if (!past?.length) return;
    setBudget(past[past.length - 1]);
  },
  redo: (
    setBudget: (value: Budget | undefined) => void,
    future: Budget[] | undefined,
  ) => {
    if (!future?.length) return;
    setBudget(future[0]);
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

  const canUndo =
    undoPossible &&
    past[past.length - 1] !== undefined &&
    budget?.id === previousBudgetID;

  const canRedo =
    redoPossible && future[0] !== undefined && budget?.id === futureBudgetID;

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
