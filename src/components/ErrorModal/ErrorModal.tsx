import { ParseError } from "papaparse";
import { Accordion, Button, Modal } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import "./ErrorModal.css";

export interface CsvError {
  errors: ParseError[];
  file: string;
}

export interface JsonError {
  errors: string;
  file: string;
}

interface ErrorModalProps {
  error: string | null;
  show: boolean;
  jsonError: JsonError[];
  csvError: CsvError[];
  onShow: (value: boolean) => void;
  onError: () => void;
}

function ErrorModal({
  error,
  show,
  jsonError,
  csvError,
  onError,
  onShow,
}: ErrorModalProps) {
  const showModal = error && show;
  const showJsonError = jsonError && jsonError.length > 0 && show;
  const showCsvError = csvError && csvError.length > 0 && show;

  function handleShow(value: boolean) {
    onShow(value);
  }

  function handleError() {
    onError();
  }

  return (
    <>
      {showModal && (
        <Modal
          data-testid="error-modal"
          dialogClassName="modal-90w mx-auto"
          show={show}
          onHide={() => handleShow(false)}
          centered
        >
          <Modal.Header>
            Error:
            <Button
              className="align-self-end"
              data-testid="error-modal-dismiss"
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={() => {
                handleShow(false);
              }}
            >
              <BsXLg aria-hidden />
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
          show={show}
          onHide={() => handleShow(false)}
          centered
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
              onClick={() => {
                handleShow(false);
                handleError();
              }}
            >
              <BsXLg aria-hidden />
            </Button>
          </Modal.Header>
          <Modal.Body key="json-error-modal-body">
            <Accordion
              aria-label="error list"
              key="json-error-modal-accordion"
              flush
            >
              {jsonError.map((jsonError: JsonError, i: number) => (
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
          show={show}
          onHide={() => handleShow(false)}
          centered
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
              onClick={() => {
                handleShow(false);
                handleError();
              }}
            >
              <BsXLg aria-hidden />
            </Button>
          </Modal.Header>
          <Modal.Body key="csv-error-modal-body">
            <Accordion
              aria-label="error list"
              key="csv-error-modal-accordion"
              flush
            >
              {csvError.map((csvError: CsvError, i: number) => (
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

export default ErrorModal;
