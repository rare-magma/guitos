import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Budget } from "../components/Budget/Budget";
import { calcPercentage } from "../utils";

interface BudgetContextInterface {
  budget: Budget | undefined;
  setBudget: (value: Budget | undefined) => void;

  budgetList: Budget[] | undefined;
  setBudgetList: (value: Budget[] | undefined) => void;

  budgetNameList: { id: string; name: string }[] | undefined;
  setBudgetNameList: (
    value: { id: string; name: string }[] | undefined,
  ) => void;

  revenuePercentage: number;
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
  setBudgetNameList: (value: { id: string; name: string }[] | undefined) => {
    value;
  },

  revenuePercentage: 0,
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
  } = useContext(BudgetContext);

  return {
    budget,
    setBudget,
    budgetList,
    setBudgetList,
    budgetNameList,
    setBudgetNameList,
    revenuePercentage,
  };
}

function BudgetProvider({ children }: PropsWithChildren) {
  const [budget, setBudget] = useState<Budget>();
  const [budgetList, setBudgetList] = useState<Budget[] | undefined>([]);

  const revenuePercentage = calcPercentage(
    budget?.expenses.total ?? 0,
    budget?.incomes.total ?? 0,
  );

  const [budgetNameList, setBudgetNameList] = useState<
    { id: string; name: string }[] | undefined
  >([]);

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
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { BudgetProvider, useBudget };
