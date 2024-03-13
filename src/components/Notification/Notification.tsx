import { produce } from "immer";
import { Button, Toast } from "react-bootstrap";
import { BsArrowCounterclockwise, BsX } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import {
  BudgetNotification,
  useGeneralContext,
} from "../../context/GeneralContext";
import "./Notification.css";

interface NotificationProps {
  notification: BudgetNotification;
}

export function Notification({ notification }: NotificationProps) {
  const { undo } = useBudget();
  const { notifications, setNotifications } = useGeneralContext();

  function handleClose() {
    setNotifications(
      produce(notifications, (draft) => {
        const index = draft.findIndex((n) => n.id === notification.id);
        if (index !== -1) draft.splice(index, 1);
      }),
    );
  }

  return (
    <Toast
      key={`${notification.id}-toast`}
      onClose={handleClose}
      show={notification.show}
      autohide
      delay={notification.showUndo ? 60000 : 3000}
    >
      <Toast.Body
        key={`${notification.id}-toast-body`}
        className="p-2 d-flex justify-content-between align-items-center"
      >
        <div
          key={`${notification.id}-toast-body-div`}
          className="me-2 me-auto text-truncate fw-medium"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "90%",
          }}
        >
          {notification.body}
        </div>
        {notification.showUndo && (
          <Button
            className="me-2 align-self-end"
            key={`${notification.id}-undo-button`}
            size="sm"
            aria-label="undo budget deletion"
            variant="outline-info"
            onClick={() => {
              undo();
              handleClose();
            }}
          >
            <BsArrowCounterclockwise aria-hidden />
          </Button>
        )}
        <Button
          className="align-self-end"
          key={`${notification.id}-toast-button`}
          size="sm"
          aria-label="dismiss notification"
          variant="outline-secondary"
          onClick={handleClose}
        >
          {<BsX aria-hidden />}
        </Button>
      </Toast.Body>
    </Toast>
  );
}
