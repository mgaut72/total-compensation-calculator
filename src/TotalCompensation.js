import React from 'react';
import CanvasJSReact from './lib/canvasjs.react'
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

  toolTipContent(e) {
	var str = "";
	var total = 0;
	var str2, str3;
	for (var i = 0; i < e.entries.length; i++){
    var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: $<strong>"+Math.round(e.entries[i].dataPoint.y)+"</strong><br/>";
		total = e.entries[i].dataPoint.y + total;
		str = str.concat(str1);
	}
	str2 = "<span style = \"color:DodgerBlue;\"><strong>"+(e.entries[0].dataPoint.x).getFullYear()+"</strong></span><br/>";
  total = Math.round(total);
	str3 = "<span style = \"color:Tomato\">Total:</span><strong> $"+total+"</strong><br/>";
	return (str2.concat(str)).concat(str3);
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
        content: this.toolTipContent
      },
      legend:{
        cursor: "pointer",
        itemclick: this.toggleDataSeries
      },
      data: this.props.data.map(d => this.toData(d.name, d.data))
    }
    return (
      <div style={{background: "transparent"}} class="jumbotron">
        <CanvasJSChart options = {options}
          onRef={ref => this.chart = ref}
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }

}

export default TotalCompensation;
