import { Button, Nav, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";

interface NavBarDeleteProps {
  deleteButtonRef: React.RefObject<HTMLButtonElement>;
  handleRemove: (i: string) => void;
  expanded: boolean;
}

export function NavBarDelete({
  deleteButtonRef,
  handleRemove,
  expanded,
}: NavBarDeleteProps) {
  const { budget } = useBudget();

  return (
    <Nav className="m-2">
      <OverlayTrigger
        trigger="click"
        key="nav-deletion-overlay"
        placement="bottom"
        rootClose={true}
        overlay={
          <Popover id={`nav-popover-delete-button`}>
            <Popover.Body>
              <OverlayTrigger
                delay={250}
                placement="bottom"
                overlay={
                  <Tooltip
                    id={`nav-tooltip-delete-budget`}
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
                  {expanded ? "delete budget" : <BsXLg aria-hidden />}
                </Button>
              </OverlayTrigger>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          className="w-100"
          aria-label="delete budget"
          variant="outline-danger"
          onClick={() => {
            setTimeout(() => {
              deleteButtonRef.current?.focus();
            }, 0);
          }}
        >
          {expanded ? "delete" : <BsXLg aria-hidden />}
        </Button>
      </OverlayTrigger>
    </Nav>
  );
}
