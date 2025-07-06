import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

interface LoadingContextInterface {
  loadingFromDB: boolean;
  setLoadingFromDB: (value: boolean) => void;
  shouldReload: boolean;
  setShouldReload: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextInterface>({
  loadingFromDB: true,
  setLoadingFromDB: (value) => value,
  shouldReload: true,
  setShouldReload: (value) => value,
});

export function useLoadingContext() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: PropsWithChildren) {
  const [loadingFromDB, setLoadingFromDB] = useState(true);
  const [shouldReload, setShouldReload] = useState(true);

  const value = useMemo(
    () => ({ loadingFromDB, setLoadingFromDB, shouldReload, setShouldReload }),
    [loadingFromDB, shouldReload],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
