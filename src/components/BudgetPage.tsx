import React, { useEffect, useState } from "react";
import { projectAPI } from "./projectAPI";
import BudgetDetail from "./BudgetDetail";
import { Budget } from "./Budget";
import { useParams } from "react-router-dom";

function BudgetPage(props: any) {
  const [loading, setLoading] = useState(false);
  const [project, setBudget] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    setLoading(true);
    projectAPI
      .find(id)
      .then((data) => {
        setBudget(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <>
        <h1>Budget Detail</h1>

        {loading && (
          <div className="center-page">
            <span className="spinner primary"></span>
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="row">
            <div className="card large error">
              <section>
                <p>
                  <span className="icon-alert inverse "></span> {error}
                </p>
              </section>
            </div>
          </div>
        )}

        {project && <BudgetDetail project={project} />}
      </>
    </div>
  );
}

export default BudgetPage;
