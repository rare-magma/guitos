import { useEffect, useRef, useState } from "react";
import { Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import TypeaheadRef from "react-bootstrap-typeahead/types/core/Typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useHotkeys } from "react-hotkeys-hook";
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsArrowLeft,
  BsArrowRight,
  BsPlusLg,
  BsQuestionLg,
  BsXLg,
} from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { useBudget } from "../../context/BudgetContext";
import { useDB } from "../../hooks/useDB";
import { useMove } from "../../hooks/useMove";
import { focusRef, getLabelKey } from "../../utils";
import "./NavBar.css";
import { NavBarDelete } from "./NavBarDelete";
import { NavBarImpExp } from "./NavBarImpExp";
import { NavBarItem } from "./NavBarItem";
import { NavBarSettings } from "./NavBarSettings";

export interface SearchOption {
  id: string;
  item: string;
  name: string;
}

export function NavBar() {
  const searchRef = useRef<TypeaheadRef>(null);
  const nameRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");
  const [invalidName, setInvalidName] = useState(false);

  const { select, goBack, canGoBack, goForward, canGoForward, goHome } =
    useMove();
  const {
    options,
    createBudget,
    cloneBudget,
    deleteBudget,
    renameBudget,
    searchBudgets,
  } = useDB();

  const { budget, undo, redo, canRedo, canUndo, budgetNameList } = useBudget();

  const shouldShowBrand = budgetNameList && budgetNameList.length < 1;
  const hasOneOrMoreBudgets = budgetNameList && budgetNameList.length > 0;
  const hasMultipleBudgets = budgetNameList && budgetNameList.length > 1;

  useHotkeys("pageup", (e) => !e.repeat && goForward(), {
    preventDefault: true,
  });

  useHotkeys("pagedown", (e) => !e.repeat && goBack(), {
    preventDefault: true,
  });

  useHotkeys("Home", (e) => !e.repeat && goHome(), {
    preventDefault: true,
  });

  useHotkeys(
    ["/", "f"],
    (e) =>
      !e.repeat &&
      focusRef(
        searchRef as unknown as React.MutableRefObject<HTMLInputElement>,
      ),
    { preventDefault: true },
  );

  useHotkeys("n", (e) => !e.repeat && focusRef(nameRef), {
    preventDefault: true,
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    if (mediaQueryList.matches) {
      setTheme("dark");
    }

    mediaQueryList.addEventListener("change", (event) =>
      setTheme(event.matches ? "dark" : "light"),
    );
  }, []);

  function handleRename(name: React.ChangeEvent<HTMLInputElement>) {
    if (checkIsUniqueName(name)) {
      renameBudget(name);
    }
  }
  function checkIsUniqueName(name: React.ChangeEvent<HTMLInputElement>) {
    const isUnique = !budgetNameList?.some(
      (b: SearchOption) => b.name === name.target.value,
    );
    setInvalidName(!isUnique);
    return isUnique;
  }

  function handleRemoveBudget(initialId?: string | null) {
    if (initialId) {
      setExpanded(false);
      deleteBudget(initialId);
    }
  }

  function handleSelectAction(option: Option[]) {
    setExpanded(false);
    select(option as SearchOption[]);
    if (searchRef.current) {
      searchRef.current.clear();
    }
  }

  return (
    <Navbar
      variant={theme}
      expand="md"
      onToggle={() => setExpanded(!expanded)}
      data-testid="header"
    >
      <Container fluid className="flex-row">
        {shouldShowBrand && (
          <OverlayTrigger
            delay={250}
            placement="bottom"
            overlay={
              <Tooltip id={`tooltip-guitos-repo`} style={{ position: "fixed" }}>
                view source code in new tab
              </Tooltip>
            }
          >
            <Navbar.Brand className="flex-sm-row">
              <a
                className="brand"
                aria-label="open guitos repository"
                href="https://github.com/rare-magma/guitos"
                target="_blank"
                rel="noreferrer"
              >
                guitos
              </a>
            </Navbar.Brand>
          </OverlayTrigger>
        )}

        <Nav className="flex-row flex-grow-1">
          {budget?.name && (
            <Nav className="flex-row">
              {hasMultipleBudgets && (
                <>
                  <NavBarItem
                    itemClassName={"me-1 my-2"}
                    onClick={goBack}
                    disabled={!canGoBack}
                    tooltipID={"tooltip-go-to-older-budget"}
                    tooltipText={"go to older budget"}
                    buttonAriaLabel={"go to older budget"}
                    buttonVariant={"go-button"}
                    buttonIcon={<BsArrowLeft aria-hidden />}
                  />
                  <NavBarItem
                    itemClassName={"m-2"}
                    onClick={goForward}
                    disabled={!canGoForward}
                    tooltipID={"tooltip-go-to-newer-budget"}
                    tooltipText={"go to newer budget"}
                    buttonAriaLabel={"go to newer budget"}
                    buttonVariant={"go-button"}
                    buttonIcon={<BsArrowRight aria-hidden />}
                  />
                </>
              )}
              <Nav.Item className="m-2 me-3">
                <OverlayTrigger
                  delay={250}
                  placement="bottom"
                  overlay={
                    <Tooltip
                      id={`tooltip-budget-name`}
                      style={{ position: "fixed" }}
                    >
                      budget name
                    </Tooltip>
                  }
                >
                  <>
                    <Form.Control
                      id="budget-name"
                      aria-label={"budget name"}
                      key={"budget-name-key-" + budget.id}
                      defaultValue={budget.name}
                      ref={nameRef}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleRename(e);
                      }}
                      style={expanded ? {} : { minWidth: "12ch" }}
                      type="text"
                      maxLength={25}
                      isInvalid={invalidName}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      This name is already used by another budget.
                    </Form.Control.Feedback>
                  </>
                </OverlayTrigger>
              </Nav.Item>
            </Nav>
          )}
          <Nav className="flex-grow-1">
            <Navbar.Toggle
              className="ms-auto ms-2 my-2"
              aria-controls={`offcanvasNavbar-expand-md`}
            />
          </Nav>
        </Nav>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          placement="end"
          show={expanded}
        >
          <Offcanvas.Header>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              {budget?.name ?? "guitos"}
            </Offcanvas.Title>
            <Button
              aria-label="close navigation"
              variant="outline-secondary"
              onClick={() => setExpanded(false)}
            >
              {<BsXLg aria-hidden />}
            </Button>
          </Offcanvas.Header>
          <Offcanvas.Body className="justify-content-end">
            <Nav>
              <Nav className="m-2">
                {hasMultipleBudgets && (
                  <AsyncTypeahead
                    id="search-budget-list"
                    inputProps={{
                      "aria-label": "search in budgets",
                    }}
                    filterBy={["name", "item"]}
                    labelKey={getLabelKey}
                    ref={searchRef}
                    style={expanded ? {} : { minWidth: "14ch" }}
                    onChange={(option: Option[]) => handleSelectAction(option)}
                    className="w-100"
                    options={options}
                    placeholder="Search..."
                    isLoading={false}
                    onSearch={searchBudgets}
                  />
                )}
              </Nav>
            </Nav>
            <Nav>
              {hasOneOrMoreBudgets && (
                <>
                  <NavBarItem
                    disabled={!canUndo}
                    itemClassName={"m-2"}
                    onClick={undo}
                    tooltipID={"tooltip-undo-history"}
                    tooltipText={"undo"}
                    buttonAriaLabel={"undo change"}
                    buttonClassName="w-100"
                    buttonVariant={"outline-info"}
                    buttonIcon={
                      expanded ? (
                        "undo"
                      ) : (
                        <BsArrowCounterclockwise aria-hidden />
                      )
                    }
                  />

                  <NavBarItem
                    disabled={!canRedo}
                    itemClassName={"m-2"}
                    onClick={redo}
                    tooltipID={"tooltip-redo-history"}
                    tooltipText={"redo"}
                    buttonAriaLabel={"redo change"}
                    buttonClassName="w-100"
                    buttonVariant={"outline-info"}
                    buttonIcon={
                      expanded ? "redo" : <BsArrowClockwise aria-hidden />
                    }
                  />
                </>
              )}
              <NavBarItem
                itemClassName={"m-2"}
                onClick={() => {
                  setExpanded(false);
                  createBudget();
                }}
                tooltipID={"tooltip-new-budget"}
                tooltipText={"new budget"}
                buttonAriaLabel={"new budget"}
                buttonClassName="w-100"
                buttonVariant={"outline-success"}
                buttonIcon={expanded ? "new" : <BsPlusLg aria-hidden />}
              />
              {hasOneOrMoreBudgets && (
                <>
                  <NavBarItem
                    itemClassName={"m-2"}
                    onClick={() => {
                      setExpanded(false);
                      cloneBudget();
                    }}
                    tooltipID={"tooltip-clone-budget"}
                    tooltipText={"clone budget"}
                    buttonAriaLabel={"clone budget"}
                    buttonClassName="w-100"
                    buttonVariant={"outline-success"}
                    buttonIcon={expanded ? "clone" : <FaRegClone aria-hidden />}
                  />
                  <NavBarDelete
                    deleteButtonRef={deleteButtonRef}
                    handleRemove={() => handleRemoveBudget(budget?.id)}
                    expanded={expanded}
                  />
                </>
              )}

              <NavBarImpExp expanded={expanded} setExpanded={setExpanded} />

              {hasOneOrMoreBudgets && <NavBarSettings expanded={expanded} />}

              <NavBarItem
                itemClassName={"m-2"}
                onClick={() => undefined}
                tooltipID={"tooltip-guitos-instructions"}
                tooltipText={"open instructions in new tab"}
                buttonAriaLabel={"open instructions in new tab"}
                buttonClassName="w-100"
                buttonVariant={"outline-info"}
                buttonLink="https://github.com/rare-magma/guitos#getting-started"
                buttonIcon={
                  expanded ? "instructions" : <BsQuestionLg aria-hidden />
                }
                target="_blank"
              />
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
