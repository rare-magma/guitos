import { Button, Toast } from "react-bootstrap";
import { BsArrowCounterclockwise, BsX } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import "./Notification.css";

export interface BudgetNotification {
  show: boolean;
  id?: string;
  body?: string;
  showUndo?: boolean;
}

interface NotificationProps {
  notification: BudgetNotification;
  onShow: () => void;
}

export function Notification({ notification, onShow }: NotificationProps) {
  const { undo } = useBudget();
  function handleUndo() {
    undo();
    onShow();
  }

  return (
    <Toast
      key={`${notification.id}-toast`}
      onClose={onShow}
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
          className="me-2 me-auto text-truncate"
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
            onClick={handleUndo}
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
          onClick={onShow}
        >
          {<BsX aria-hidden />}
        </Button>
      </Toast.Body>
    </Toast>
  );
}
