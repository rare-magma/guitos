import BTable from "react-bootstrap/Table";
import { useTable, TableOptions, Column } from "react-table";
import React from "react";

type Cols = { expensesHeader: string; col2: string };

function GuitosTable() {
  const data = React.useMemo(
    (): Cols[] => [
      {
        expensesHeader: "Hello",
        col2: "World",
      },
      {
        expensesHeader: "react-table",
        col2: "rocks",
      },
      {
        expensesHeader: "whatever",
        col2: "you want",
      },
    ],
    []
  );

  const columns: Column<{ expensesHeader: string; col2: string }>[] =
    React.useMemo(
      () => [
        {
          Header: "Expenses",
          accessor: "expensesHeader", // accessor is the "key" in the data
        },
        {
          Header: "",
          accessor: "col2",
        },
      ],
      []
    );
  const options: TableOptions<{ expensesHeader: string; col2: string }> = {
    data,
    columns,
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(options);

  return (
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 3px red",
                  background: "aliceblue",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "papayawhip",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
}

export default GuitosTable;
