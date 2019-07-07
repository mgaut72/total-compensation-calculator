import React from 'react';
import ReactDataGrid from "react-data-grid";
import {DateEditor, DateFormatter, moment} from "./DateUtils.js"

const grantColumns = [
  {key: 'name', name: 'Grant Name', editable: true},
  {key: 'symbol', name: 'Symbol', editable: true},
  {key: 'quantity', name: 'Quantity', editable: true},
  {key: 'strikePrice', name: 'Strike Price', editable: true},
  {key: 'grantDate', name: 'Grant Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
  {key: 'earlyTerminationDate', name: 'Early Termination Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
  {key: 'action', name: ''}
]

export const Grant = () => ({name: '', symbol: '', quantity: 0, strikePrice: 0, grantDate: moment(), earlyTerminationDate: null});

class Grants extends React.Component {

  deleteRow = (id) => {
    let rows = this.props.grantRows.slice();
    rows = rows.filter(row => row.id !== id)
    this.props.onGrantRowChange(rows)
  }

  addGrantRow = () => {
    this.props.onGrantRowChange(this.props.grantRows.concat([Grant()]));
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    var rows = this.props.grantRows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      rows[i] = { ...rows[i], ...updated };
    }
    this.props.onGrantRowChange(rows);
  };

  getCellActions = (column, row) => {
    const deleteRowActions = [
      {
        icon: <button className="deleteGrantRowButton">Delete</button>,
        callback: () => {
          const rows = [...this.props.grantRows];
          rows.splice(row.idx, 1); //
          this.props.onGrantRowChange(rows);
        }
      }
    ];
    const clearEarlyTerminationDateActions = [
      {
        icon: <button className="clearTerminationDateButton">Clear</button>,
        callback: () => {
          console.log(row.idx);
          this.props.onGrantRowChange(
            this.props.grantRows.map((grant, idx) => {
              return idx === row.idx ? {...grant, earlyTerminationDate: null} : grant
            }));
        }
      }
    ];
    if (column.key === "action") {
      return deleteRowActions;
    } else if (column.key === "earlyTerminationDate" && this.props.grantRows[row.idx].earlyTerminationDate !== null) {
      return clearEarlyTerminationDateActions;
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="grants">
      <ReactDataGrid
        columns={grantColumns}
        rowGetter={i => ({...this.props.grantRows[i], idx: i})}
        rowsCount={this.props.grantRows.length}
        onGridRowsUpdated={this.onGridRowsUpdated}
        enableCellSelect={true}
        getCellActions={this.getCellActions}
      />
      <button
        className="addGrantRowButton"
        onClick={this.addGrantRow}
      >
        Add Grant
      </button>
    </div>
    );
  }
}

export default Grants;
