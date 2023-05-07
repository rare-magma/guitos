import { ParseError } from "papaparse";
import { Accordion, Button, Modal } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";

export type CsvError = {
  errors: ParseError[];
  file: string;
};

export type JsonError = {
  errors: string;
  file: string;
};

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
  const handleShow = (value: boolean) => {
    onShow(value);
  };

  const handleError = () => {
    onError();
  };

  return (
    <>
      {error && show && (
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
              <BsXLg />
            </Button>
          </Modal.Header>
          <Modal.Body className="textarea mx-1">
            <p className="code">{error}</p>
          </Modal.Body>
        </Modal>
      )}

      {jsonError && jsonError.length > 0 && show && (
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
              key={"modal-dismiss-button"}
              variant="delete-modal"
              type="button"
              onClick={() => {
                handleShow(false);
                handleError();
              }}
            >
              <BsXLg />
            </Button>
          </Modal.Header>
          <Modal.Body key="json-error-modal-body">
            <Accordion key="json-error-modal-accordion" flush>
              {jsonError.map((jsonError: JsonError, i: number) => (
                <Accordion.Item
                  key={jsonError.file + "-item-" + i}
                  eventKey={jsonError.file}
                >
                  <Accordion.Header key={jsonError.file + "-header-" + i}>
                    {jsonError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea code mx-1"
                    key={jsonError.file + "-body-" + i}
                  >
                    <p className="code" key={jsonError.file + "-error-" + i}>
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

      {csvError && csvError.length > 0 && show && (
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
              variant="delete-modal"
              type="button"
              onClick={() => {
                handleShow(false);
                handleError();
              }}
            >
              <BsXLg />
            </Button>
          </Modal.Header>
          <Modal.Body key="csv-error-modal-body">
            <Accordion key="csv-error-modal-accordion" flush>
              {csvError.map((csvError: CsvError, i: number) => (
                <Accordion.Item
                  key={csvError.file + "-item-" + i}
                  eventKey={csvError.file}
                >
                  <Accordion.Header key={csvError.file + "-header-" + i}>
                    {csvError.file}
                  </Accordion.Header>
                  <Accordion.Body
                    className="textarea code mx-1"
                    key={csvError.file + "-body-" + i}
                  >
                    <p className="code" key={csvError.file + "-csv-error-" + i}>
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
