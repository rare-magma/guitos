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
  needReload: boolean;
  setNeedReload: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextInterface>({
  loadingFromDB: true,
  setLoadingFromDB: (value) => value,
  needReload: true,
  setNeedReload: (value) => value,
});

export function useLoadingContext() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: PropsWithChildren) {
  const [loadingFromDB, setLoadingFromDB] = useState(true);
  const [needReload, setNeedReload] = useState(true);

  const value = useMemo(
    () => ({ loadingFromDB, setLoadingFromDB, needReload, setNeedReload }),
    [loadingFromDB, needReload],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
