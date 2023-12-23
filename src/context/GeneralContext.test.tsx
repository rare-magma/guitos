import { render } from "@testing-library/react";
import { generalContextSpy, testErrorGeneralContext } from "../setupTests";
import { GeneralProvider, useGeneralContext } from "./GeneralContext";

function TestComponent() {
  const { error, csvErrors, jsonErrors, showError } = useGeneralContext();
  return (
    <>
      <p aria-label="error">{error?.toString()}</p>
      <p aria-label="csv">{csvErrors.toString()}</p>
      <p aria-label="json">{jsonErrors.toString()}</p>
      <p aria-label="showError">{showError.toString()}</p>
    </>
  );
}

describe("GeneralProvider", () => {
  beforeEach(() => {
    generalContextSpy.mockReturnValue(testErrorGeneralContext);
  });
  it("provides expected GeneralContext obj to child elements", () => {
    const { getByLabelText } = render(
      <GeneralProvider>
        <TestComponent />
      </GeneralProvider>,
    );
    expect(getByLabelText("error").textContent).toEqual("Thrown error");
    expect(getByLabelText("csv").textContent).toEqual("");
    expect(getByLabelText("json").textContent).toEqual("");
    expect(getByLabelText("showError").textContent).toEqual("true");
  });
});
