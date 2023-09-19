import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ErrorModal from "./ErrorModal";

describe("ErrorModal", () => {
  const onError = vi.fn();
  const onShow = vi.fn();

  const comp = (
    <ErrorModal
      error={"Thrown error"}
      show={true}
      jsonError={[
        {
          errors:
            "SyntaxError: Expected ',' or '}' after property value in JSON at position 209",
          file: "123.json",
        },
      ]}
      csvError={[
        {
          errors: [
            {
              type: "FieldMismatch",
              code: "TooFewFields",
              message: "Line 0: Too few fields: expected 3 fields but parsed 2",
              row: 0,
            },
          ],
          file: "123.csv",
        },
      ]}
      onShow={onShow}
      onError={onError}
    />
  );

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });
  it("renders initial state", () => {
    expect(screen.getByText("Thrown error")).toBeInTheDocument();
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
    expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("error-modal-dismiss"));

    expect(onShow).toBeCalledWith(false);
  });

  it("closes json error when clicking the button", async () => {
    expect(screen.getByTestId("json-error-close")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("json-error-close"));

    expect(onShow).toBeCalledWith(false);
  });

  it("closes json error modal when clicking the button", async () => {
    expect(screen.getByTestId("json-error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("json-error-modal"));

    expect(onShow).toBeCalledWith(false);
  });

  it("closes csv error when clicking the button", async () => {
    expect(screen.getByTestId("csv-error-close")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("csv-error-close"));

    expect(onShow).toBeCalledWith(false);
  });

  it("closes csv error modal when clicking the button", async () => {
    expect(screen.getByTestId("csv-error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("csv-error-modal"));

    expect(onShow).toBeCalledWith(false);
  });
});
