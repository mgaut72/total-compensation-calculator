import React from 'react';
import Grants, {Grant} from './Grants.js';
import './App.css';


class TotalCompensation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grantRows: [Grant()]
    }
  }

  setGrantRowState(newGrantRows) {
    this.setState({
      grantRows: newGrantRows
    });
  };

  render() {
    return (
      <Grants
        grantRows={this.state.grantRows}
        onGrantRowChange={this.setGrantRowState.bind(this)} />
    );
  }
}

export default TotalCompensation;
