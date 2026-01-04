import { BudgetCalculator } from "@guitos/application/react/budgetCalculator";
import { useLoadingContext } from "@guitos/application/react/context/LoadingContext";
import { useReactToEvents } from "@guitos/application/react/hooks/useReactToEvents";
import type { SearchOption } from "@guitos/application/react/sections/NavBar/NavBar";
import { FindBudgetQuery } from "@guitos/contexts/budget/application/readBudget/findBudgetQuery";
import type { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import { Uuid } from "@shared/domain/uuid";
import { queryBus } from "@shared/infrastructure/buses";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import useUndo from "use-undo";

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
  const { setShouldReload } = useLoadingContext();

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

  const revenuePercentage = BudgetCalculator.revenuePercentage(budget);

  const canReallyUndo = undoPossible && past[past.length - 1] !== undefined;
  const canReallyRedo = redoPossible && future[0] !== undefined;

  const budgetChanged = useReactToEvents([BudgetChangedDomainEvent.eventName]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: react to event
  useEffect(() => {
    async function readBudget() {
      if (!budget) {
        return;
      }
      const { budget: foundBudget } = await queryBus.ask<FindBudgetResponse>(
        new FindBudgetQuery(budget.id.value),
      );
      if (!foundBudget) {
        return;
      }
      setBudget(
        new Budget({
          id: new Uuid(foundBudget?.id).value,
          name: foundBudget?.name,
          expenses: foundBudget?.expenses,
          incomes: foundBudget?.incomes,
          stats: foundBudget?.stats,
        }),
      );
    }

    readBudget();
  }, [budgetChanged]);

  function handleUndo() {
    if (canReallyUndo) {
      setShouldReload(true);
      undo();
      setShouldReload(false);
    }
  }

  function handleRedo() {
    if (canReallyRedo) {
      setShouldReload(true);
      redo();
      setShouldReload(false);
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
