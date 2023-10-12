import { Button, Toast } from "react-bootstrap";
import { BsX } from "react-icons/bs";
import "./Notification.css";

interface NotificationProps {
  notification: { show: boolean; id?: string; body?: string };
  onShow: () => void;
}

function Notification({ notification, onShow }: NotificationProps) {
  return (
    <Toast
      key={`${notification.id}-toast`}
      onClose={() => onShow()}
      show={notification.show}
      autohide
      delay={3000}
    >
      <Toast.Body
        key={`${notification.id}-toast-body`}
        className="p-2 d-flex justify-content-between align-items-center"
      >
        <div
          key={`${notification.id}-toast-body-div`}
          className="me-2 text-truncate"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "90%",
          }}
        >
          {notification.body}
        </div>
        <Button
          className="align-self-end"
          key={`${notification.id}-toast-button`}
          size="sm"
          aria-label="dismiss notification"
          variant="outline-secondary"
          onClick={() => onShow()}
        >
          {<BsX aria-hidden />}
        </Button>
      </Toast.Body>
    </Toast>
  );
}
export default Notification;
