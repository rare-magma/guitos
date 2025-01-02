import { immerable } from "immer";
import { Budget } from "./budget";
import { BudgetItem } from "./budgetItem";
import { Uuid } from "./uuid";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class BudgetMother {
  static testBudget() {
    return {
      [immerable]: true,
      id: Uuid.random().value as unknown as Uuid,
      name: "2023-03",
      expenses: {
        items: [{ id: 1, name: "expense1", value: 10 }],
        total: 10,
      },
      incomes: {
        items: [{ id: 2, name: "income1", value: 100 }],
        total: 100,
      },
      stats: {
        available: 90,
        withGoal: 80,
        saved: 10,
        goal: 10,
        reserves: 200,
      },
    };
  }

  static testBudgetClone() {
    return Budget.clone(BudgetMother.testBudget() as Budget);
  }

  static testBudget2() {
    return {
      ...Budget.create(),
      id: Uuid.random().value as unknown as Uuid,
      name: "2023-04",
      expenses: {
        items: [{ id: 1, name: "name", value: 50 }],
        total: 50,
      },
      incomes: {
        items: [{ id: 2, name: "name2", value: 200 }],
        total: 200,
      },
      stats: {
        available: 150,
        withGoal: 130,
        saved: 20,
        goal: 35,
        reserves: 30,
      },
    };
  }

  static testBigBudget() {
    return {
      ...Budget.create(),
      name: "2023-03",
      expenses: {
        items: [
          { id: 1, name: "name", value: 11378.64 },
          { id: 4, name: "name2", value: 11378.64 },
        ],
        total: 22757.28,
      },
      incomes: {
        items: [
          { id: 2, name: "name", value: 100.03 },
          { id: 3, name: "name2", value: 342783.83 },
        ],
        total: 342883.86,
      },
      stats: {
        available: 320126.58,
        withGoal: 148684.65,
        saved: 171441.93,
        goal: 50,
        reserves: 200,
      },
    };
  }

  static testBudgetCsv() {
    return {
      ...Budget.create(),
      name: "2023-03",
      expenses: {
        items: [
          new BudgetItem(0, "rent", 1000),
          new BudgetItem(1, "food", 200),
        ],
        total: 1200,
      },
      incomes: {
        items: [
          new BudgetItem(2, "salary", 2000),
          new BudgetItem(3, "sale", 100),
        ],
        total: 2100,
      },
      stats: {
        available: 900,
        withGoal: 690,
        saved: 210,
        goal: 10,
        reserves: 0,
      },
    };
  }

  static testBudgetList() {
    return [
      BudgetMother.testBudget(),
      BudgetMother.testBudget2(),
      BudgetMother.testBigBudget(),
    ];
  }

  static testBudgetNameList() {
    return [
      {
        id: BudgetMother.testBudget().id,
        item: "",
        name: BudgetMother.testBudget().name,
      },
      {
        id: BudgetMother.testBudget2().id,
        item: "",
        name: BudgetMother.testBudget2().name,
      },
    ];
  }

  static testJSONErrorBudget() {
    return `{
  id: "03123AAA5c2de4-00a4-403c-8f0e-f81339be9a4e",
  na2me: "2023-03",
  expens3es: {
    items: [{ id: "infinity", name: -1, value: "r" }],
    total: 10,
  },
  stats: {
    available: 0,
    withGoal: 0,
    saved: 0,
    goal: 10,
    reserves: 0,
  },
}`;
  }

  static testCsv() {
    return `type,name,value
expense,rent,1000.00
expense,food,200.00
income,salary,2000.00
income,sale,100
goal,goal,10
reserves,reserves,0
`;
  }

  static testCsvError() {
    return `type,name,value
expe2nse,rent,1000.00
expense,food,200.00,123,4
incomae,salary,2000.00
income,sale,100
goal,123,goal
goal,,goal,,,
reservaes,reserves,0
`;
  }
}
