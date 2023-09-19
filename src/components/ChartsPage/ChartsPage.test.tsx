import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ChartsPage from "./ChartsPage";

describe("ChartsPage", () => {
  const onShowGraphs = vi.fn();
  const comp = <ChartsPage onShowGraphs={onShowGraphs} />;

  beforeAll(() => {
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(800);
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    delete window.ResizeObserver;
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    render(comp);
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    vi.restoreAllMocks();
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });
  it("renders initial state", () => {
    expect(screen.getByLabelText("go back to budgets")).toBeInTheDocument();
    expect(screen.getByText("Revenue vs expenses")).toBeInTheDocument();
    expect(screen.getByText("Savings")).toBeInTheDocument();
    expect(screen.getByText("Reserves")).toBeInTheDocument();
    expect(screen.getByText("Available vs with goal")).toBeInTheDocument();
    expect(screen.getByText("Savings goal")).toBeInTheDocument();
  });

  it("triggers onShowGraphs when back button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("go back to budgets"));
    expect(onShowGraphs).toBeCalledTimes(1);
    onShowGraphs.mockClear();
  });

  it("triggers onShowGraphs when i shortcut is pressed", async () => {
    await userEvent.type(screen.getByText("Reserves"), "i");
    expect(onShowGraphs).toBeCalledTimes(1);
    onShowGraphs.mockClear();
  });
});
