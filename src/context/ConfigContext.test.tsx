import { cleanup, render } from "@testing-library/react";
import { ConfigProvider, useConfig } from "./ConfigContext";
import { configContextSpy } from "../setupTests";

function TestComponent() {
  const { intlConfig, currency } = useConfig();
  return (
    <>
      <p aria-label="currency">{intlConfig?.currency}</p>
      <p aria-label="locale">{intlConfig?.locale}</p>
      <p aria-label="c">{currency}</p>
    </>
  );
}

describe("ConfigProvider", () => {
  it("provides expected ConfigContext obj to child elements", () => {
    const { getByLabelText } = render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );
    expect(getByLabelText("currency").textContent).toEqual("USD");
    expect(getByLabelText("locale").textContent).toEqual("en-US");
    expect(getByLabelText("c").textContent).toEqual("USD");
  });

  it.skip("throws error when not used within provider", () => {
    // configContextSpy.mockClear();
    configContextSpy.mockReset();
    cleanup();
    expect(() => render(<TestComponent />)).toThrow(
      "useConfig must be used within a Config provider",
    );
  });
});
