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
  BsUpload,
  BsXLg,
} from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { useBudget } from "../../context/BudgetContext";
import { budgetsDB } from "../../context/db";
import { focusRef } from "../../utils";
import { Budget } from "../Budget/Budget";
import "./NavBar.css";
import { NavBarDelete } from "./NavBarDelete";
import { NavBarItem } from "./NavBarItem";
import { NavBarSettings } from "./NavBarSettings";

export interface SearchOption {
  id: string;
  item: string;
  name: string;
}

interface NavBarProps {
  onClone: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
  onGoForward: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNew: () => void;
  onRemove: (name: string) => void;
  onSelect: (option: SearchOption[]) => void;
}

export function NavBar({
  onClone,
  onGoBack,
  onGoHome,
  onGoForward,
  onImport,
  onNew,
  onRemove,
  onSelect,
}: NavBarProps) {
  const importRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const searchRef = useRef<TypeaheadRef>(null);
  const nameRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");
  const [options, setOptions] = useState<Option[]>([]);

  const { budget, setBudget, undo, redo, canRedo, canUndo, budgetNameList } =
    useBudget();

  const shouldShowBrand = budgetNameList && budgetNameList.length < 1;
  const hasOneOrMoreBudgets = budgetNameList && budgetNameList.length > 0;
  const hasMultipleBudgets = budgetNameList && budgetNameList.length > 1;

  useHotkeys("pageup", (e) => !e.repeat && handleGoForward(), {
    preventDefault: true,
  });

  useHotkeys("pagedown", (e) => !e.repeat && handleGoBack(), {
    preventDefault: true,
  });

  useHotkeys("Home", (e) => !e.repeat && handleGoHome(), {
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

  function handleNew() {
    setExpanded(false);
    onNew();
  }

  function handleClone() {
    setExpanded(false);
    onClone();
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    setExpanded(false);
    onImport(event);
  }

  function handleRemove(initialId?: string | null) {
    if (initialId) {
      setExpanded(false);
      onRemove(initialId);
    }
  }

  function handleSelect(option: Option[]) {
    setExpanded(false);
    onSelect(option as SearchOption[]);
    if (searchRef.current) {
      searchRef.current.clear();
    }
  }

  function handleGoBack() {
    onGoBack();
  }

  function handleGoHome() {
    onGoHome();
  }

  function handleGoForward() {
    onGoForward();
  }

  function handleRename(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value;
    let newBudget: Budget;
    if (budget && newName) {
      newBudget = {
        ...budget,
        name: newName,
      };
      setBudget(newBudget);
    }
  }

  function handleSearch() {
    let options: SearchOption[] = [];

    budgetsDB
      .iterate((budget: Budget) => {
        options = options.concat(
          budget.incomes.items.map((i) => {
            return {
              id: budget.id,
              item: i.name,
              name: budget.name,
            };
          }),
          budget.expenses.items.map((i) => {
            return {
              id: budget.id,
              item: i.name,
              name: budget.name,
            };
          }),
        );
      })
      .then(() => {
        if (budgetNameList) {
          options = options.concat(budgetNameList);
        }
        setOptions(
          options.sort((a, b) => a.name.localeCompare(b.name)).reverse(),
        );
      })
      .catch((e) => {
        throw new Error(e as string);
      });
  }

  function getLabelKey(option: unknown): string {
    const label = option as SearchOption;
    return label.item ? `${label.name} ${label.item}` : `${label.name}`;
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
                open repository in new tab
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
                    onClick={handleGoBack}
                    tooltipID={"tooltip-go-to-older-budget"}
                    tooltipText={"go to older budget"}
                    buttonAriaLabel={"go to older budget"}
                    buttonVariant={"go-button"}
                    buttonIcon={<BsArrowLeft aria-hidden />}
                  />
                  <NavBarItem
                    itemClassName={"m-2"}
                    onClick={handleGoForward}
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
                  <Form.Control
                    aria-label={"budget name"}
                    key={"budget-name-key-" + budget.id}
                    defaultValue={budget.name}
                    ref={nameRef}
                    onChange={handleRename}
                    style={expanded ? {} : { minWidth: "12ch" }}
                    type="text"
                    maxLength={25}
                  />
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
                    filterBy={["name", "item"]}
                    labelKey={getLabelKey}
                    ref={searchRef}
                    style={expanded ? {} : { minWidth: "14ch" }}
                    onChange={(option: Option[]) => handleSelect(option)}
                    className="w-100"
                    options={options}
                    placeholder="Search..."
                    isLoading={false}
                    onSearch={handleSearch}
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
                onClick={handleNew}
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
                    onClick={handleClone}
                    tooltipID={"tooltip-clone-budget"}
                    tooltipText={"clone budget"}
                    buttonAriaLabel={"clone budget"}
                    buttonClassName="w-100"
                    buttonVariant={"outline-success"}
                    buttonIcon={expanded ? "clone" : <FaRegClone aria-hidden />}
                  />
                  <NavBarDelete
                    deleteButtonRef={deleteButtonRef}
                    handleRemove={() => handleRemove(budget?.id)}
                    expanded={expanded}
                  />
                </>
              )}

              <Nav className="m-2">
                <OverlayTrigger
                  delay={250}
                  placement="bottom"
                  overlay={
                    <Tooltip
                      id={`tooltip-import-budget`}
                      style={{ position: "fixed" }}
                    >
                      import budget
                    </Tooltip>
                  }
                >
                  <Form.Group controlId="import">
                    <Button
                      className="w-100"
                      aria-label="import budget"
                      variant="outline-primary"
                      onClick={() => importRef.current?.click()}
                    >
                      {expanded ? "import" : <BsUpload aria-hidden />}
                    </Button>
                    <Form.Control
                      data-testid="import-form-control"
                      type="file"
                      multiple
                      ref={importRef}
                      onChange={handleImport}
                      style={{ display: "none" }}
                    />
                  </Form.Group>
                </OverlayTrigger>
              </Nav>

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
