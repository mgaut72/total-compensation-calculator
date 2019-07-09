import React from 'react';
import Grants, {Grant} from './Grants.js';
import BaseSalary, {Salary} from './BaseSalary.js';
import TotalCompensation from './TotalCompensation.js';
import './App.css';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grantRows: [Grant()],
      salaries: [Salary()],
    }
  }

  setGrants(newGrantRows) {
    this.setState({
      grantRows: newGrantRows
    });
  };

  setSalaries(newSalaries) {
    this.setState({
      salaries: newSalaries
    });
  };

  render() {
    return (
      <div className="totalCompCalc">
        <Grants
          grantRows={this.state.grantRows}
          onGrantRowChange={this.setGrants.bind(this)} />
        <BaseSalary
          rows={this.state.salaries}
          onRowChange={this.setSalaries.bind(this)} />
        <TotalCompensation
          salaries={this.state.salaries}/>
      </div>
    );
  }
}

export default App;
