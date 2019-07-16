import React from 'react';
import Grants, {initialGrants} from './Grants.js';
import BaseSalary, {initialSalaries} from './BaseSalary.js';
import TotalCompensation from './TotalCompensation.js';
import VestingSchedules, {initialSchedules} from './VestingSchedules.js';
import getBaseSalaryPerYear from './SalaryUtils.js'
import getGrantVests from './GrantUtils.js'
import './App.css';

const getScheduleForGrant = (g, ss) => {
  return ss.find(s => s.name === g.vestingSchedule);
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grants: initialGrants,
      salaries: initialSalaries,
      vestingSchedules: initialSchedules,
      compensationData: [],
    }
  }

  setGrants(newGrantRows) {
    this.setState({
      grants: newGrantRows
    });
  };

  setSalaries(newSalaries) {
    this.setState({
      salaries: newSalaries
    });
  };

  setVestingSchedules(newSchedules) {
    this.setState({
      vestingSchedules: newSchedules
    });
  };

  async getAllGrantData() {
    let grants =  [];
    for (let g of this.state.grants) {
      let s = getScheduleForGrant(g, this.state.vestingSchedules);
      if (!s) {
        continue;
      }
      const d = await getGrantVests(g, s);
      grants.push({name: g.name, data: d});
    }
    return grants;
  }


  async updateCompensationData() {
      const salaryData = {name: "Base", data: getBaseSalaryPerYear(this.state.salaries)};
      const grantDatas = await this.getAllGrantData();
      this.setState({
        compensationData: [salaryData].concat(grantDatas)
      });
  }

  async componentDidMount() {
    await this.updateCompensationData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.grants !== this.state.grants  || prevState.salaries !== this.state.salaries || prevState.vestingSchedules !== this.state.vestingSchedules) {
      await this.updateCompensationData();
    }
  }


  render() {
    return (
      <div className="totalCompCalc">
        <BaseSalary
          rows={this.state.salaries}
          onRowChange={this.setSalaries.bind(this)} />
        <Grants
          grantRows={this.state.grants}
          onGrantRowChange={this.setGrants.bind(this)}
          vestingSchedules={this.state.vestingSchedules} />
        <VestingSchedules
          rows={this.state.vestingSchedules}
          onRowChange={this.setVestingSchedules.bind(this)} />
        <TotalCompensation
          data={this.state.compensationData} />
      </div>
    );
  }
}

export default App;
