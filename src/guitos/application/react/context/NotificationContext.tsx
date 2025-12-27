import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import { useImmer } from "use-immer";

export interface BudgetNotification {
  show: boolean;
  id?: string;
  body?: string;
  showUndo?: boolean;
}

interface NotificationContextInterface {
  notifications: BudgetNotification[];
  setNotifications: (value: BudgetNotification[]) => void;
}

const NotificationContext = createContext<NotificationContextInterface>({
  notifications: [],
  setNotifications: (value) => value,
});

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useImmer<BudgetNotification[]>([]);

  const value = useMemo(
    () => ({ notifications, setNotifications }),
    [notifications, setNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
