import "bootstrap/dist/css/bootstrap.min.css";
import BudgetTabs from "./components/BudgetTabs";
import BudgetsPage from "./components/BudgetsPage";
import GNavBar from "./components/GNavBar";

export default function App() {
  return (
    <>
      <GNavBar />
      <BudgetsPage />
      <BudgetTabs />
    </>
  );
}
