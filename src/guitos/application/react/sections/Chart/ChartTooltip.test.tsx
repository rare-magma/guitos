import { ConfigProvider } from "@guitos/application/react/context/ConfigContext";
import { ChartTooltip } from "@guitos/application/react/sections/Chart/ChartTooltip";
import { UserPreferencesResponseMother } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse.mother";
import { QueryBusMock } from "@shared/__mocks__/queryBus.mock";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ChartTooltip", () => {
  const queryBus = new QueryBusMock();
  queryBus.whenAskThenReturn(UserPreferencesResponseMother.default());
  const comp = (
    <ConfigProvider queryBus={queryBus}>
      <ChartTooltip
        active={true}
        label="label"
        payload={[{ name: "name", value: 123, unit: "$" }]}
      />
    </ConfigProvider>
  );

  it("matches snapshot", () => {
    render(comp);
    waitFor(() => {
      expect(comp).toMatchSnapshot();
    });
  });

  it("renders initial state", () => {
    render(comp);
    waitFor(() => {
      expect(screen.getByText("label")).toBeInTheDocument();
      expect(screen.getByText("$123.00")).toBeInTheDocument();
    });
  });

  it("renders goal with %", () => {
    render(
      <ConfigProvider queryBus={queryBus}>
        <ChartTooltip
          active={true}
          label="goal"
          payload={[{ name: "goal", value: 123, unit: "%" }]}
          key1="goal"
        />
        ,
      </ConfigProvider>,
    );
    waitFor(() => {
      expect(screen.getByText("123%")).toBeInTheDocument();
    });
  });

  it("renders 2 legends", () => {
    render(
      <ConfigProvider queryBus={queryBus}>
        <ChartTooltip
          active={true}
          payload={[
            { name: "revenue", value: 456, unit: "$" },
            { name: "expenses", value: 789, unit: "$" },
          ]}
          key1="revenue"
          key2="expenses"
        />
        ,
      </ConfigProvider>,
    );
    waitFor(() => {
      expect(screen.getByText("$456.00")).toBeInTheDocument();
      expect(screen.getByText("$789.00")).toBeInTheDocument();
    });
  });
});
