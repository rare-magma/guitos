import { render, screen } from "@testing-library/react";
import { Loading } from "./Loading";

describe("Loading", () => {
  const comp = <Loading />;

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
