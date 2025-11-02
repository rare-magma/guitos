import { Loading } from "@guitos/sections/Loading/Loading";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Loading", () => {
  const comp = <Loading />;

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
