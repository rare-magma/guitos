import { useNavigate } from "react-router-dom";
import { SearchOption } from "../components/NavBar/NavBar";
import { useBudget } from "../context/BudgetContext";
import Budget from "../guitos/domain/budget";

export function useMove() {
  const { budget, setBudget, budgetList } = useBudget();
  const navigate = useNavigate();

  function select(selectedBudget: SearchOption[] | undefined) {
    if (selectedBudget && budgetList) {
      const filteredList = budgetList.filter(
        (item: Budget) => item.id === selectedBudget[0].id,
      );
      console.log(
        "file: useMove.ts:13 ~ select ~ filteredList:",
        filteredList[0],
      );
      filteredList && setBudget(filteredList[0], false);

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
      localStorage.setItem("guitos_lastOpenedBudget", selectedBudget[0].name);
    }
  }

  function handleGo(step: number, limit: number) {
    const sortedList = budgetList?.sort((a, b) => a.name.localeCompare(b.name));
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
    const sortedList = budgetList?.sort((a, b) => a.name.localeCompare(b.name));
    if (budget) {
      const index = sortedList?.findIndex((b) => b.name.includes(budget.name));
      if (index !== position) {
        return true;
      }
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
