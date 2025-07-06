import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useWindowSize } from "./useWindowSize";

describe("useWindowSize", () => {
  it("returns initial window size", () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
  });

  it("updates window size on resize", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.innerWidth = 900;
      window.innerHeight = 600;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(900);
    expect(result.current.height).toBe(600);
  });
});
