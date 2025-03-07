import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import useUndo from "use-undo";
import { Budget } from "../domain/budget";
import type { SearchOption } from "../sections/NavBar/NavBar";
import { useGeneralContext } from "./GeneralContext";

export interface BudgetContextInterface {
  budget: Budget | undefined;
  setBudget: (value: Budget | undefined, saveInHistory: boolean) => void;
  budgetList: Budget[] | undefined;
  setBudgetList: (value: Budget[] | undefined) => void;
  budgetNameList: SearchOption[] | undefined;
  setBudgetNameList: (value: SearchOption[] | undefined) => void;
  revenuePercentage: number;
  past: (Budget | undefined)[];
  future: (Budget | undefined)[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BudgetContext = createContext<BudgetContextInterface>({
  budget: undefined,
  setBudget: (_value: Budget | undefined, _saveInHistory: boolean) => {
    _value;
    _saveInHistory;
  },
  budgetList: [],
  setBudgetList: (value: Budget[] | undefined) => value,
  budgetNameList: [],
  setBudgetNameList: (value: SearchOption[] | undefined) => value,
  revenuePercentage: 0,
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
  const [budgetNameList, setBudgetNameList] = useState<
    SearchOption[] | undefined
  >([]);
  const { setNeedReload } = useGeneralContext();

  const [
    budgetState,
    {
      set: setBudget,
      undo,
      redo,
      canUndo: undoPossible,
      canRedo: redoPossible,
    },
  ] = useUndo<Budget | undefined>(undefined, { useCheckpoints: true });

  const { present: budget, past: pastState, future: futureState } = budgetState;
  const past = pastState.filter((b) => b?.id === budget?.id);
  const future = futureState.filter((b) => b?.id === budget?.id);

  const revenuePercentage = Budget.revenuePercentage(budget);

  const canReallyUndo = undoPossible && past[past.length - 1] !== undefined;
  const canReallyRedo = redoPossible && future[0] !== undefined;

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
    <BudgetContext
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
        undo: handleUndo,
        redo: handleRedo,
        canUndo: canReallyUndo,
        canRedo: canReallyRedo,
      }}
    >
      {children}
    </BudgetContext>
  );
}

export { BudgetProvider, useBudget };
