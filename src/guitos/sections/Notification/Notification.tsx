import { Button, Toast } from "react-bootstrap";
import { BsArrowCounterclockwise, BsX } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import "./Notification.css";
import type { BudgetNotification } from "../../context/NotificationContext";

interface NotificationProps {
  notification: BudgetNotification;
  handleClose: (notification: BudgetNotification) => void;
}

export function Notification({ notification, handleClose }: NotificationProps) {
  const { undo } = useBudget();

  return (
    <Toast
      key={`${notification.id}-toast`}
      onClose={() => handleClose(notification)}
      show={notification.show}
      autohide={true}
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
            variant="outline-info toggle"
            onClick={() => {
              undo();
              handleClose(notification);
            }}
          >
            <BsArrowCounterclockwise aria-hidden={true} />
          </Button>
        )}
        <Button
          className="align-self-end"
          key={`${notification.id}-toast-button`}
          size="sm"
          aria-label="dismiss notification"
          variant="outline-secondary"
          onClick={() => handleClose(notification)}
        >
          {<BsX aria-hidden={true} />}
        </Button>
      </Toast.Body>
    </Toast>
  );
}
