import React from 'react';
import CanvasJSReact from './lib/canvasjs.react'
import getBaseSalaryPerYear from './SalaryUtils.js'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

/**
https://canvasjs.com/react-charts/stacked-bar-chart/
*/
class TotalCompensation extends React.Component {

  constructor(props) {
		super(props);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
	}

  toggleDataSeries(e) {
		if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}

  toData(name, dataPoints) {
    return {
      type: "stackedColumn",
      name: name,
      showInLegend: "true",
      xValueFormatString: "YYYY",
      yValueFormatString: "$#,##0",
      dataPoints: dataPoints,
      xValueType: "datetime",
    }
  }

  getBaseSalaryData() {
    return this.toData("Base", getBaseSalaryPerYear(this.props.salaries));
  }

  render() {
    const options = {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Total Compensation"
      },
      axisX: {
        interval: 1,
		    intervalType: "year"
      },
      axisY: {
        prefix: "$"
      },
      toolTip: {
        shared: true,
        reversed: true,
      },
      legend:{
        cursor: "pointer",
        reversed: true,
        itemclick: this.toggleDataSeries
      },
      data: [this.getBaseSalaryData()]
    }
    return (
      <div>
        <CanvasJSChart options = {options}
          onRef={ref => this.chart = ref}
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }

}

export default TotalCompensation;
