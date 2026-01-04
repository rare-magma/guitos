import { BudgetCalculator } from "@guitos/application/react/budgetCalculator";
import { useLoadingContext } from "@guitos/application/react/context/LoadingContext";
import { useReactToEvents } from "@guitos/application/react/hooks/useReactToEvents";
import type { SearchOption } from "@guitos/application/react/sections/NavBar/NavBar";
import { FindBudgetQuery } from "@guitos/contexts/budget/application/readBudget/findBudgetQuery";
import type { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
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
  budget: Nullable<Primitives<Budget>>;
  setBudget: (
    value: Nullable<Primitives<Budget>>,
    saveInHistory: boolean,
  ) => void;
  budgetList: Nullable<Primitives<Budget[]>>;
  setBudgetList: (value: Primitives<Budget[]>) => void;
  budgetNameList: SearchOption[] | undefined;
  setBudgetNameList: (value: SearchOption[] | undefined) => void;
  revenuePercentage: number;
  past: Nullable<Primitives<Budget[]>>;
  future: Nullable<Primitives<Budget[]>>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BudgetContext = createContext<BudgetContextInterface>({
  budget: null,
  setBudget: (_value, _saveInHistory) => {
    _value;
    _saveInHistory;
  },
  budgetList: [],
  setBudgetList: (value) => value,
  budgetNameList: [],
  setBudgetNameList: (value) => value,
  revenuePercentage: 0,
  past: [],
  future: [],
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
  const [budgetList, setBudgetList] = useState<Nullable<Primitives<Budget[]>>>(
    [],
  );
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
  ] = useUndo<Nullable<Primitives<Budget>>>(null, {
    useCheckpoints: true,
  });

  const { present: budget, past: pastState, future: futureState } = budgetState;
  const past = pastState.filter((b) => b?.id === budget?.id);
  const future = futureState.filter((b) => b?.id === budget?.id);

  const revenuePercentage = budget
    ? BudgetCalculator.revenuePercentage(new Budget({ ...budget }))
    : 0;

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
        new FindBudgetQuery(budget.id),
      );
      if (!foundBudget) {
        return;
      }
      setBudget(foundBudget);
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
