import { ParseError } from "papaparse";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useImmer } from "use-immer";

export interface CsvError {
  errors: ParseError[];
  file: string;
}

export interface JsonError {
  errors: string;
  file: string;
}

export interface BudgetNotification {
  show: boolean;
  id?: string;
  body?: string;
  showUndo?: boolean;
}

interface GeneralContextInterface {
  needReload: boolean;
  setNeedReload: (value: boolean) => void;
  loadingFromDB: boolean;
  setLoadingFromDB: (value: boolean) => void;
  error: string | null;
  setError: (value: string) => void;
  csvErrors: CsvError[];
  setCsvErrors: (value: CsvError[]) => void;
  jsonErrors: JsonError[];
  setJsonErrors: (value: JsonError[]) => void;
  showError: boolean;
  setShowError: (value: boolean) => void;
  notifications: BudgetNotification[];
  setNotifications: (value: BudgetNotification[]) => void;
}

const GeneralContext = createContext<GeneralContextInterface>({
  needReload: true,
  setNeedReload: (value: boolean) => value,
  loadingFromDB: true,
  setLoadingFromDB: (value: boolean) => value,
  error: "",
  setError: (value: string) => value,
  csvErrors: [],
  setCsvErrors: (value: CsvError[]) => value,
  jsonErrors: [],
  setJsonErrors: (value: JsonError[]) => value,
  showError: false,
  setShowError: (value: boolean) => value,
  notifications: [],
  setNotifications: (value: BudgetNotification[]) => value,
});

function useGeneralContext() {
  const {
    needReload,
    setNeedReload,
    loadingFromDB,
    setLoadingFromDB,
    error,
    setError,
    csvErrors,
    setCsvErrors,
    jsonErrors,
    setJsonErrors,
    showError,
    setShowError,
    notifications,
    setNotifications,
  } = useContext(GeneralContext);

  function handleError(e: unknown) {
    if (e instanceof Error) {
      setError(e.message);
    }
    setShowError(true);
  }

  return {
    needReload,
    setNeedReload,
    loadingFromDB,
    setLoadingFromDB,
    error,
    setError,
    csvErrors,
    setCsvErrors,
    jsonErrors,
    setJsonErrors,
    showError,
    setShowError,
    handleError,
    notifications,
    setNotifications,
  };
}

function GeneralProvider({ children }: PropsWithChildren) {
  const [needReload, setNeedReload] = useState(true);
  const [loadingFromDB, setLoadingFromDB] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csvErrors, setCsvErrors] = useState<CsvError[]>([]);
  const [jsonErrors, setJsonErrors] = useState<JsonError[]>([]);
  const [showError, setShowError] = useState(false);
  const [notifications, setNotifications] = useImmer<BudgetNotification[]>([]);

  return (
    <GeneralContext.Provider
      value={{
        needReload,
        setNeedReload,
        loadingFromDB,
        setLoadingFromDB,
        error,
        setError,
        csvErrors,
        setCsvErrors,
        jsonErrors,
        setJsonErrors,
        showError,
        setShowError,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { GeneralProvider, useGeneralContext };
