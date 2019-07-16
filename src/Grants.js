import React from 'react';
import ReactDataGrid from "react-data-grid";
import {DateEditor, DateFormatter, moment} from "./DateUtils.js"
import { Editors } from "react-data-grid-addons";
const { DropDownEditor } = Editors;


export const Grant = () => ({name: '', symbol: 'Z', quantity: 0, strikePrice: 0, grantDate: moment(), earlyTerminationDate: null, vestingSchedule: ''});

export const initialGrants = [
  Grant()
]

class Grants extends React.Component {

  getVestingScheduleOptions = () => {
    return this.props.vestingSchedules.map(s => ({id: s.name, value: s.name}));
  }

  VestingScheduleEditor = <DropDownEditor options={this.getVestingScheduleOptions()}/>

  grantColumns = [
    {key: 'name', name: 'Grant Name', editable: true},
    {key: 'symbol', name: 'Symbol', editable: true},
    {key: 'vestingSchedule', name: 'Vesting Schedule', editor: this.VestingScheduleEditor},
    {key: 'quantity', name: 'Quantity', editable: true},
    {key: 'strikePrice', name: 'Strike Price', editable: true},
    {key: 'grantDate', name: 'Grant Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
    {key: 'earlyTerminationDate', name: 'Early Termination Date', editable: true, editor:<DateEditor/>, formatter:<DateFormatter/>},
    {key: 'action', name: ''}
  ]

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
        icon: <span className="glyphicon glyphicon-remove" />,
        callback: () => {
          const rows = [...this.props.grantRows];
          rows.splice(row.idx, 1); //
          this.props.onGrantRowChange(rows);
        }
      }
    ];
    const clearEarlyTerminationDateActions = [
      {
        icon: <span className="glyphicon glyphicon-remove-circle" />,
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
      <div className="grants">
      <ReactDataGrid
        columns={this.grantColumns}
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
