import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading", () => {
  const comp = <Loading />;

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
