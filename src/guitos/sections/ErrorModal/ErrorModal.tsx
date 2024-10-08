import { Accordion, Button, Modal } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import "./ErrorModal.css";
import type { CsvError } from "../../domain/csvError";
import type { JsonError } from "../../domain/jsonError";

interface ErrorModalProps {
  error: string | null;
  setShowError: (value: boolean) => void;
  showError: boolean;
  jsonErrors: JsonError[];
  setJsonErrors: (value: JsonError[]) => void;
  csvErrors: CsvError[];
  setCsvErrors: (value: CsvError[]) => void;
  handleDismiss: () => void;
}
export function ErrorModal({
  error,
  setShowError,
  showError,
  jsonErrors,
  csvErrors,
  handleDismiss,
}: ErrorModalProps) {
  const showModal = error && showError;
  const showJsonError = jsonErrors && jsonErrors.length > 0 && showError;
  const showCsvError = csvErrors && csvErrors.length > 0 && showError;

  return (
    <>
      {showModal && (
        <Modal
          data-testid="error-modal"
          dialogClassName="modal-90w mx-auto"
          show={showError}
          onHide={() => setShowError(false)}
          centered={true}
        >
          <Modal.Header>
            Error:
            <Button
              className="align-self-end"
              data-testid="error-modal-dismiss"
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={() => setShowError(false)}
            >
              <BsXLg aria-hidden={true} />
            </Button>
          </Modal.Header>
          <Modal.Body className="textarea mx-1">
            <p className="code">{error}</p>
          </Modal.Body>
        </Modal>
      )}

      {showJsonError && (
        <Modal
          key="json-error-modal"
          data-testid="json-error-modal"
          dialogClassName="modal-90w mx-auto"
          show={showError}
          onHide={() => setShowError(false)}
          centered={true}
        >
          <Modal.Header key="json-error-modal-header">
            Errors found while importing:
            <Button
              data-testid="json-error-close"
              className="align-self-end"
              aria-label="close error dialog"
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={handleDismiss}
            >
              <BsXLg aria-hidden={true} />
            </Button>
          </Modal.Header>
          <Modal.Body key="json-error-modal-body">
            <Accordion
              aria-label="error list"
              key="json-error-modal-accordion"
              flush={true}
            >
              {jsonErrors.map((jsonError: JsonError, i: number) => (
                <Accordion.Item
                  key={`${jsonError.file}-item-${i}`}
                  eventKey={jsonError.file}
                >
                  <Accordion.Header
                    aria-label="file"
                    key={`${jsonError.file}-header-${i}`}
                  >
                    {jsonError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea fixed-width-font mx-1"
                    key={`${jsonError.file}-body-${i}`}
                  >
                    <p className="code" key={`${jsonError.file}-error-${i}`}>
                      <>
                        {jsonError.errors}
                        <br />
                      </>
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Modal.Body>
        </Modal>
      )}

      {showCsvError && (
        <Modal
          key="csv-error-modal"
          data-testid="csv-error-modal"
          dialogClassName="modal-90w mx-auto"
          show={showError}
          onHide={() => setShowError(false)}
          centered={true}
        >
          <Modal.Header key="csv-error-modal-header">
            Errors found while importing:
            <Button
              data-testid="csv-error-close"
              className="align-self-end"
              key={"modal-dismiss-button"}
              aria-label="close error dialog"
              variant="delete-modal"
              type="button"
              onClick={handleDismiss}
            >
              <BsXLg aria-hidden={true} />
            </Button>
          </Modal.Header>
          <Modal.Body key="csv-error-modal-body">
            <Accordion
              aria-label="error list"
              key="csv-error-modal-accordion"
              flush={true}
            >
              {csvErrors.map((csvError: CsvError, i: number) => (
                <Accordion.Item
                  key={`${csvError.file}-item-${i}`}
                  eventKey={csvError.file}
                >
                  <Accordion.Header
                    aria-label="file"
                    key={`${csvError.file}-header-${i}`}
                  >
                    {csvError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea fixed-width-font mx-1"
                    key={`${csvError.file}-body-${i}`}
                  >
                    <p className="code" key={`${csvError.file}-csverror-${i}`}>
                      {csvError.errors.map((error) => (
                        <span key={error.row}>
                          Line {error.row}: {error.message}
                          <br />
                        </span>
                      ))}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
