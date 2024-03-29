import React from 'react';
import ReactDataGrid from "react-data-grid";
import {DateEditor, DateFormatter, moment} from "./DateUtils.js"
import { Editors } from "react-data-grid-addons";
const { DropDownEditor } = Editors;


export const Grant = () => ({name: '', symbol: 'Z', quantity: 0, strikePrice: 0, grantDate: moment(), earlyTerminationDate: null, vestingSchedule: ''});

export const initialGrants = [
  {name: 'Sample Grant 1', symbol: 'Z', quantity: 4000, strikePrice: 30, grantDate: moment(), earlyTerminationDate: null, vestingSchedule: 'Z Signing'},
  {name: 'Sample Grant 2', symbol: 'Z', quantity: 1000, strikePrice: 0, grantDate: moment().add(1, 'y'), earlyTerminationDate: null, vestingSchedule: 'Quarterly for 4 Years'},
]

class Grants extends React.Component {

  grantColumns = () => {
    return [
      {key: 'name', name: 'Grant Name', editable: true},
      {key: 'symbol', name: 'Symbol', editable: true},
      {key: 'vestingSchedule', name: 'Vesting Schedule', hash: new Date().getTime(), editor: <DropDownEditor options={this.props.vestingSchedules.map(s => ({id: s.name, value: s.name}))}/>},  // hash is a hack to break ReactDataGrid's cache
      {key: 'quantity', name: 'Quantity', editable: true},
      {key: 'strikePrice', name: 'Strike Price', editable: true},
      {key: 'grantDate', name: 'Grant Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
      {key: 'earlyTerminationDate', name: 'Early Termination Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
      {key: 'action', name: ''}
    ]
  }

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
        icon: <i class="fas fa-times-circle"></i>,
        callback: () => {
          const rows = [...this.props.grantRows];
          rows.splice(row.idx, 1); //
          this.props.onGrantRowChange(rows);
        }
      }
    ];
    const clearEarlyTerminationDateActions = [
      {
        icon: <i class="fas fa-times-circle"></i>,
        callback: () => {
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
      <div style={{background: "transparent"}} class="jumbotron">
        <h2>Grants</h2>
        <div class="relativeWrapper">
          <ReactDataGrid
            columns={this.grantColumns()}
            rowGetter={i => ({...this.props.grantRows[i], idx: i})}
            rowsCount={this.props.grantRows.length}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect={true}
            getCellActions={this.getCellActions}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={this.addGrantRow}
        >
          Add Grant
        </button>
      </div>
    );
  }
}

export default Grants;
