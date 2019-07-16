import React from 'react';
import ReactDOM from 'react-dom';
import * as Datetime from 'react-datetime';

export class DateEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: Datetime.moment()
    }
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this)
  }

  getValue() {
    var updated = {}
    updated[this.props.column.key] = this.state.date
    return updated
  };

  onClick() {
    this.getInputNode().focus();
  }

  onDoubleClick() {
    this.getInputNode().focus();
  }

  handleDate(date) {
    this.setState({
      date:date
    })
  }

  render(){
    return (
      <div style={{"zIndex":"10000000000"}}>
        <Datetime timeFormat={false} inputProps={{ autoFocus: true }} onChange={(moment) => this.handleDate(moment)} />
      </div>
    );
  }
}

export class DateFormatter extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    let value = this.props.value;
    return value ? <div title={value.format("L")}>{value.format("L")}</div> : <div/>
  }
}

export const moment = Datetime.moment;
