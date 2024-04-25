import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  generalContextSpy,
  testCsvErrorGeneralContext,
  testErrorGeneralContext,
  testJsonErrorGeneralContext,
} from "../../setupTests";
import { ErrorModal } from "./ErrorModal";

describe("ErrorModal", () => {
  const comp = <ErrorModal />;

  beforeEach(() => {
    generalContextSpy.mockReturnValue(testJsonErrorGeneralContext);
  });

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(
      screen.getAllByText("Errors found while importing:")[0],
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "SyntaxError: Expected ',' or '}' after property value in JSON at position 209",
      ),
    ).toBeInTheDocument();
  });

  it("closes error when clicking the button", async () => {
    generalContextSpy.mockClear();
    generalContextSpy.mockReturnValue(testErrorGeneralContext);
    render(comp);
    expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId("error-modal-dismiss"));
    });
  });

  it("closes json error when clicking the button", async () => {
    render(comp);
    expect(screen.getByTestId("json-error-close")).toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId("json-error-close"));
    });
  });

  it("closes json error modal when clicking the button", async () => {
    render(comp);
    expect(screen.getByTestId("json-error-modal")).toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId("json-error-modal"));
    });
  });

  it("closes csv error when clicking the button", async () => {
    generalContextSpy.mockReturnValue(testCsvErrorGeneralContext);
    render(comp);

    expect(screen.getByTestId("csv-error-close")).toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId("csv-error-close"));
    });
  });

  it("closes csv error modal when clicking the button", async () => {
    generalContextSpy.mockReturnValue(testCsvErrorGeneralContext);
    render(comp);

    expect(screen.getByTestId("csv-error-modal")).toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId("csv-error-modal"));
    });
  });
});
