import type { RefObject } from "react";
import { Button, Nav, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import type { Uuid } from "../../guitos/domain/uuid";

interface NavBarDeleteProps {
  deleteButtonRef: RefObject<HTMLButtonElement>;
  handleRemove: (i: Uuid) => void;
  expanded: boolean;
}

export function NavBarDelete({
  deleteButtonRef,
  handleRemove,
  expanded,
}: NavBarDeleteProps) {
  const { budget } = useBudget();

  return (
    <Nav className={expanded ? "m-4 flex-grow-1 h-25" : "m-2"}>
      <OverlayTrigger
        trigger="click"
        key="nav-deletion-overlay"
        placement="bottom"
        rootClose={true}
        overlay={
          <Popover id={"nav-popover-delete-button"}>
            <Popover.Body>
              <OverlayTrigger
                delay={250}
                placement="bottom"
                overlay={
                  <Tooltip
                    id={"nav-tooltip-delete-budget"}
                    style={{ position: "fixed" }}
                  >
                    delete budget
                  </Tooltip>
                }
              >
                <Button
                  id={"budget-deletion-button"}
                  aria-label="confirm budget deletion"
                  key={"budget-deletion-button"}
                  variant="delete"
                  type="button"
                  ref={deleteButtonRef}
                  onClick={() => budget?.id && handleRemove(budget.id)}
                >
                  {expanded ? "delete budget" : <BsXLg aria-hidden={true} />}
                </Button>
              </OverlayTrigger>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          className={expanded ? "w-100 h-100" : "w-100"}
          aria-label="delete budget"
          variant="outline-danger"
          onClick={() => {
            setTimeout(() => {
              deleteButtonRef.current?.focus();
            }, 0);
          }}
        >
          {<BsXLg size={expanded ? 50 : 0} aria-hidden={true} />}
        </Button>
      </OverlayTrigger>
    </Nav>
  );
}
