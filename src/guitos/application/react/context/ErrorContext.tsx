import type { CsvError } from "@guitos/contexts/importExport/domain/csvError";
import type { JsonError } from "@guitos/contexts/importExport/domain/jsonError";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ErrorContextInterface {
  error: string | null;
  setError: (value: string | null) => void;
  csvErrors: CsvError[];
  setCsvErrors: (value: CsvError[]) => void;
  jsonErrors: JsonError[];
  setJsonErrors: (value: JsonError[]) => void;
  showError: boolean;
  setShowError: (value: boolean) => void;
  handleError: (e: unknown) => void;
}

const ErrorContext = createContext<ErrorContextInterface>({
  error: null,
  setError: (value) => value,
  csvErrors: [],
  setCsvErrors: (value: CsvError[]) => value,
  jsonErrors: [],
  setJsonErrors: (value: JsonError[]) => value,
  showError: false,
  setShowError: (value) => value,
  handleError: (value) => value,
});

export function useErrorContext() {
  return useContext(ErrorContext);
}

export function ErrorProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState<string | null>(null);
  const [csvErrors, setCsvErrors] = useState<CsvError[]>([]);
  const [jsonErrors, setJsonErrors] = useState<JsonError[]>([]);
  const [showError, setShowError] = useState(false);

  const handleError = useCallback((e: unknown) => {
    if (e instanceof Error) setError(e.message);
    setShowError(true);
  }, []);

  // TODO: listen to error events

  const value = useMemo(
    () => ({
      error,
      setError,
      csvErrors,
      setCsvErrors,
      jsonErrors,
      setJsonErrors,
      showError,
      setShowError,
      handleError,
    }),
    [error, csvErrors, jsonErrors, showError, handleError],
  );

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
}
