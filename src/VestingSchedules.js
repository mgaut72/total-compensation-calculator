import React from 'react';
import ReactDataGrid from "react-data-grid";

const columns = [
  {key: 'name', name: 'Schedule Name', editable: true},
  {key: 'durationMonths', name: 'Grant Duration (Months)', editable: true},
  {key: 'frequencyMonths', name: 'Vest Frequency (Months)', editable: true},
  {key: 'cliffMonths', name: 'Vest Cliff (Months)', editable: true},
  {key: 'percentPerVest', name: 'Percent Per Vest', editable: true},
  {key: 'action', name: ''}
]

export const Schedule = () => ({name: 'Schedule', durationMonths: 0, frequencyMonths: 0, cliffMonths: 0, percentPerVest: 'EVEN'});

export const initialSchedules = [
  {name: 'AMZN Signing', durationMonths: 48, frequencyMonths: 6, cliffMonths: 0, percentPerVest: '0,5,0,15,20,20,20,20'},
  {name: 'Z Signing', durationMonths: 48, frequencyMonths: 1, cliffMonths: 12, percentPerVest: 'EVEN'},
  {name: 'Semi-Annually for 2 years', durationMonths: 24, frequencyMonths: 6, cliffMonths: 0, percentPerVest: 'EVEN'},
  {name: 'Quarterly for 4 Years', durationMonths: 48, frequencyMonths: 3, cliffMonths: 0, percentPerVest: 'EVEN'},
  {name: 'Monthly for 1 Year', durationMonths: 48, frequencyMonths: 3, cliffMonths: 0, percentPerVest: 'EVEN'},
]

class VestingSchedules extends React.Component {

  addRow = () => {
    this.props.onRowChange(this.props.rows.concat([Schedule()]));
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
        icon: <i class="fas fa-times-circle"></i>,
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
        <h2>Vesting Schedules</h2>
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
          Add Vesting Schedule
        </button>
      </div>
    );
  }
}

export default VestingSchedules;
