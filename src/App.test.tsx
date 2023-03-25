import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders new button", () => {
  render(<App />);
  const linkElement = screen.getByText(/Select/i);
  expect(linkElement).toBeInTheDocument();
});
