import type { ReactNode } from "react";
import { Button, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./NavBar.css";

interface NavItemProps {
  itemClassName: string;
  onClick: () => void;
  tooltipID: string;
  tooltipText: string;
  buttonAriaLabel: string;
  buttonClassName?: string;
  buttonVariant: string;
  buttonIcon: ReactNode;
  disabled?: boolean;
}

export function NavBarItem({
  itemClassName,
  onClick,
  tooltipID,
  tooltipText,
  buttonAriaLabel,
  buttonClassName,
  buttonVariant,
  buttonIcon,
  disabled,
}: NavItemProps) {
  return (
    <Nav.Item className={itemClassName} onClick={onClick}>
      <OverlayTrigger
        delay={250}
        placement="bottom"
        overlay={
          <Tooltip id={tooltipID} style={{ position: "fixed" }}>
            {tooltipText}
          </Tooltip>
        }
      >
        <Button
          aria-label={buttonAriaLabel}
          className={buttonClassName}
          variant={buttonVariant}
          disabled={disabled}
        >
          {buttonIcon}
        </Button>
      </OverlayTrigger>
    </Nav.Item>
  );
}
