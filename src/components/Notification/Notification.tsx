import { Button, Toast } from "react-bootstrap";
import { BsX } from "react-icons/bs";

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
      <Toast.Header key={`${notification.id}-toast-header`} closeButton={false}>
        <div
          key={`${notification.id}-toast-body`}
          className="me-auto text-truncate"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: "90%",
          }}
        >
          {notification.body}
        </div>
        <Button
          key={`${notification.id}-toast-button`}
          size="sm"
          aria-label="dismiss notification"
          variant="outline-secondary"
          onClick={() => onShow()}
        >
          {<BsX />}
        </Button>
      </Toast.Header>
    </Toast>
  );
}
export default Notification;
