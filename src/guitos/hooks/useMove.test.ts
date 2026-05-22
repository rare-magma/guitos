import { BudgetMother } from "@guitos/domain/budget.mother";
import { useDB } from "@guitos/hooks/useDB";
import { useMove } from "@guitos/hooks/useMove";
import type { SearchOption } from "@guitos/sections/NavBar/NavBar";
import { Uuid } from "@shared/domain/uuid";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation } from "wouter";
import { budgetContextSpy, testBudgetContext } from "../../setupTests";

vi.mock("@guitos/hooks/useDB", () => ({
  useDB: vi.fn(),
}));

vi.mock("wouter", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("wouter")>();
  return {
    ...originalModule,
    useLocation: vi.fn(),
  };
});

describe("useMove", () => {
  const persistBudgetMock = vi.fn();
  const setBudgetMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    persistBudgetMock.mockResolvedValue(undefined);
    persistBudgetMock.mockClear();
    setBudgetMock.mockClear();
    navigateMock.mockClear();
    localStorage.clear();

    vi.mocked(useDB).mockReturnValue({
      persistBudget: persistBudgetMock,
    } as unknown as ReturnType<typeof useDB>);

    vi.mocked(useLocation).mockReturnValue(["", navigateMock]);
  });

  it("saves the current budget before switching budgets", async () => {
    const currentBudget = {
      ...BudgetMother.testBudget(),
      id: new Uuid("11111111-1111-4111-8111-111111111111"),
    };
    const nextBudget = {
      ...BudgetMother.testBudget2(),
      id: new Uuid("22222222-2222-4222-8222-222222222222"),
    };

    budgetContextSpy.mockReturnValue({
      ...testBudgetContext,
      budget: currentBudget,
      budgetList: [currentBudget, nextBudget],
      setBudget: setBudgetMock,
    });

    const { result } = renderHook(() => useMove());
    const selectedBudget = [
      {
        id: nextBudget.id,
        item: "",
        name: nextBudget.name,
      },
    ] as SearchOption[];

    await act(async () => {
      await result.current.select(selectedBudget);
    });

    expect(persistBudgetMock).toHaveBeenCalledWith(currentBudget);
    expect(setBudgetMock).toHaveBeenCalledWith(nextBudget, false);
    expect(persistBudgetMock.mock.invocationCallOrder[0]).toBeLessThan(
      setBudgetMock.mock.invocationCallOrder[0],
    );
    expect(navigateMock).toHaveBeenCalledWith(`/${nextBudget.name}`);
  });
});
