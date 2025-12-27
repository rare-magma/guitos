import { useBudget } from "@guitos/application/react/context/BudgetContext";
import type { SearchOption } from "@guitos/application/react/sections/NavBar/NavBar";
import { PersistLastOpenedBudgetCommand } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommand";
import type { Budget } from "@guitos/contexts/budget/domain/budget";
import { commandBus } from "@shared/infrastructure/buses";
import { useLocation } from "wouter";

export function useMove() {
  const { budget, setBudget, budgetList } = useBudget();
  const [_, navigate] = useLocation();

  async function select(selectedBudget: SearchOption[] | undefined) {
    if (selectedBudget && budgetList) {
      const filteredList = budgetList.filter(
        (item: Budget) => item.id === selectedBudget[0].id,
      );
      filteredList[0] && setBudget(filteredList[0], false);

      setTimeout(() => {
        if (selectedBudget[0].item && selectedBudget[0].item.length > 0) {
          const element = document.querySelector(
            `input[value="${selectedBudget[0].item}"]:not([class="rbt-input-hint"]):not([role="combobox"])`,
          );
          if (element !== null) {
            (element as HTMLElement).focus();
          }
        }
      }, 100);

      navigate(`/${selectedBudget[0].name}`);
      await commandBus.dispatch(
        new PersistLastOpenedBudgetCommand({
          budgetName: selectedBudget[0].name,
        }),
      );
    }
  }

  function handleGo(step: number, limit: number) {
    const sortedList = budgetList?.toSorted((a, b) =>
      a.name.localeCompare(b.name),
    );
    if (budget) {
      const index = sortedList?.findIndex((b) => b.name.includes(budget.name));
      if (index !== limit && sortedList) {
        select([sortedList[(index ?? 0) + step] as unknown as SearchOption]);
      }
    }
  }

  function goHome() {
    if (budget) {
      const name = new Date().toISOString();
      const index = budgetList?.findIndex((b) =>
        b.name.includes(name.slice(0, 7)),
      );
      const isSelectable = index !== undefined && index !== -1 && budgetList;

      if (isSelectable) {
        select([budgetList[index] as unknown as SearchOption]);
      }
    }
  }

  function goBack() {
    budgetList && handleGo(-1, 0);
  }

  function goForward() {
    budgetList && handleGo(1, budgetList.length - 1);
  }

  function checkCanGo(position: number): boolean {
    const sortedList = budgetList?.toSorted((a, b) =>
      a.name.localeCompare(b.name),
    );
    if (!budget) {
      return false;
    }
    const index = sortedList?.findIndex((b) => b.name.includes(budget.name));
    if (index !== position) {
      return true;
    }
    return false;
  }

  const canGoBack = checkCanGo(0);
  const canGoForward = budgetList && checkCanGo(budgetList?.length - 1);

  return {
    select,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    goHome,
  };
}
