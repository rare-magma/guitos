import { useRegisterHandlers } from "@guitos/hooks/useRegisterHandlers";
import type { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  useRegisterHandlers();
  return children;
}
