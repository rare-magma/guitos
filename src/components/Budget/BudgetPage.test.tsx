import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  setBudgetListMock,
  setBudgetMock,
  testBudget,
  testBudgetList,
} from "../../setupTests";
import BudgetPage from "./BudgetPage";

describe("BudgetPage", () => {
  const comp = <BudgetPage />;

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
  });

  it("responds to new budget keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "a");
    expect(setBudgetMock).toHaveBeenCalledWith(testBudget);
  });

  it.skip("removes budget when clicking on delete budget button", async () => {
    const deleteButton = screen.getAllByRole("button", {
      name: "delete budget",
    });
    await userEvent.click(deleteButton[0]);
    await userEvent.click(
      screen.getByRole("button", { name: "confirm budget deletion" }),
    );
    expect(
      screen.queryByRole("button", { name: "delete budget" }),
    ).not.toBeInTheDocument();
  });

  it.skip("clones budget when clicking on clone budget button", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);

    const cloneButton = screen.getAllByRole("button", {
      name: "clone budget",
    });
    await userEvent.click(cloneButton[0]);
    expect(setBudgetListMock).toHaveBeenNthCalledWith(1, testBudgetList);
    expect(screen.getByText("2023-035c2de4-clone")).toBeInTheDocument();
  });

  it.skip("responds to clone budget keyboard shortcut", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);

    await userEvent.type(screen.getByTestId("header"), "c");
    expect(setBudgetListMock).toHaveBeenNthCalledWith(1, testBudgetList);
    expect(screen.getByText("2023-035c2de4-clone")).toBeInTheDocument();
  });

  it.skip("responds to changes", async () => {
    // revenue change
    await userEvent.type(screen.getAllByDisplayValue("$10")[4], "200");
    expect(screen.getAllByDisplayValue("$200")[1]).toBeInTheDocument();

    // expense change
    await act(async () => {
      await userEvent.type(screen.getAllByDisplayValue("$0")[1], "13");
    });

    expect(screen.getByDisplayValue("$13")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$187")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$167")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$20")).toBeInTheDocument();

    // stat change
    await userEvent.type(screen.getByLabelText("reserves"), "2");
    expect(screen.getByDisplayValue("$2")).toBeInTheDocument();

    // auto goal change
    await userEvent.click(
      screen.getByRole("button", { name: "calculate savings goal" }),
    );

    expect(screen.getByDisplayValue("93.5")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("$0")[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("$187")[0]).toBeInTheDocument();

    // rename change
    await userEvent.type(screen.getByLabelText("budget name"), "change");
    expect(screen.getByText("2023-035c2de4-clonechange")).toBeInTheDocument();

    // currency change
    await userEvent.type(screen.getByPlaceholderText("USD"), "CAD");
    await userEvent.click(screen.getByText("CAD"));

    expect(screen.getByDisplayValue("CA$200")).toBeInTheDocument();
  });
});
