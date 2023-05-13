import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorModal from "./ErrorModal";
import { vi } from "vitest";

describe("ErrorModal", () => {
  const onError = vi.fn();
  const onShow = vi.fn();

  beforeEach(() => {
    render(
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
                message:
                  "Line 0: Too few fields: expected 3 fields but parsed 2",
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
  });

  it("renders initial state", () => {
    expect(screen.getByText("Thrown error")).toBeInTheDocument();
    expect(
      screen.getAllByText("Errors found while importing:")[0]
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "SyntaxError: Expected ',' or '}' after property value in JSON at position 209"
      )
    ).toBeInTheDocument();
  });

  it("closes error when clicking the button", async () => {
    expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("error-modal-dismiss"));

    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it("closes json error when clicking the button", async () => {
    expect(screen.getByTestId("json-error-close")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("json-error-close"));

    expect(onShow).toHaveBeenCalledTimes(2);
  });

  it("closes csv error when clicking the button", async () => {
    expect(screen.getByTestId("csv-error-close")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("csv-error-close"));

    expect(onShow).toHaveBeenCalledTimes(3);
  });
});
