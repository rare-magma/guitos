import { render, screen } from "@testing-library/react";
import { ConfigProvider, useConfig } from "./ConfigContext";

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
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );
    expect(screen.getByLabelText("currency").textContent).toEqual("USD");
    expect(screen.getByLabelText("locale").textContent).toEqual("en-US");
    expect(screen.getByLabelText("c").textContent).toEqual("USD");
  });
});
