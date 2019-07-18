import React from 'react';
import ReactDataGrid from "react-data-grid";
import {DateEditor, DateFormatter, moment} from "./DateUtils.js"

const columns = [
  {key: 'effectiveDate', name: 'Effecive Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
  {key: 'salary', name: 'Salary', editable: true, format: 'currency'},
  {key: 'action', name: ''}
]

export const Salary = () => ({effectiveDate: moment(), salary: 0});

export const initialSalaries = [
  {effectiveDate: moment(), salary: 100000},
]

class BaseSalary extends React.Component {

  addRow = () => {
    this.props.onRowChange(this.props.rows.concat([Salary()]));
  }

  onRowsUpdated = ({ fromRow, toRow, updated }) => {
    var rows = this.props.rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      rows[i] = { ...rows[i], ...updated };
    }
    this.props.onRowChange(rows);
  };

  getCellActions = (column, row) => {
    const deleteRowActions = [
      {
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: () => {
          const rows = [...this.props.rows];
          rows.splice(row.idx, 1); //
          this.props.onRowChange(rows);
        }
      }
    ];
    if (column.key === "action") {
      return deleteRowActions;
    } else {
      return null;
    }
  };

  render() {
    return (
      <div style={{background: "transparent"}} class="jumbotron">
        <h2>Base Salary</h2>
        <div class="relativeWrapper">
          <ReactDataGrid
            columns={columns}
            rowGetter={i => ({...this.props.rows[i], idx: i})}
            rowsCount={this.props.rows.length}
            onGridRowsUpdated={this.onRowsUpdated}
            enableCellSelect={true}
            getCellActions={this.getCellActions}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={this.addRow}
        >
          Add Salary
        </button>
      </div>
    );
  }
}

export default BaseSalary;
