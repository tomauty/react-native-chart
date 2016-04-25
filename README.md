# react-native-chart

[![Join the chat at https://gitter.im/tomauty/react-native-chart](https://badges.gitter.im/tomauty/react-native-chart.svg)](https://gitter.im/tomauty/react-native-chart)
[![npm version](https://badge.fury.io/js/react-native-chart.svg)](https://badge.fury.io/js/react-native-chart)

react-native-chart is a simple module for adding line charts, area charts, or bar charts to your React Native app.

![Screenshot](https://raw.githubusercontent.com/tomauty/react-native-chart/master/screenshots/README.png)

## Getting Started
[![NPM](https://nodei.co/npm/react-native-chart.png?downloads=true)](https://nodei.co/npm/react-native-chart/)

1. `npm install react-native-chart --save`
2. I recommend using [rnpm](https://github.com/rnpm/rnpm) for linking.

	2a. `npm install -g rnpm`

	2b. `rnpm link`

If you'd rather not use `rnpm`, you can link the library as described [here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html).

## Usage
```javascript
import React, { StyleSheet, View, Component } from 'react-native';
import RNChart from 'react-native-chart';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	chart: {
		position: 'absolute',
		top: 16,
		left: 4,
		bottom: 4,
		right: 16,
	}
});

const chartData = [
	{
		name: 'BarChart',
		type: 'bar',
		color:'purple',
		widthPercent: 0.6,
		data: [30, 1, 1, 2, 3, 5, 21, 13, 21, 34, 55, 30],
	},
	{
		name: 'LineChart',
		color: 'gray',
		lineWidth: 2,
		highlightIndices: [1, 2],	// The data points at indexes 1 and 2 will be orange
		highlightColor: 'orange',
		showDataPoint: true,
		data: [10, 12, 14, 25, 31, 52, 41, 31, 52, 66, 22, 11],
	}
];

const xLabels = ['0','1','2','3','4','5','6','7','8','9','10','11'];

class SimpleChart extends Component {
	render() {
		return (
			<View style={styles.container}>
				<RNChart style={styles.chart}
					chartData={chartData}
					verticalGridStep={5}
					xLabels={xLabels}
				 />
			</View>
		);
	}
}

```
## Properties
All properties are optional otherwise noted
### General
- **`chartData`** _(ObjectArray)_ - : one nested block produces one type of chart
	- **`data`** - _(NumberArray)_ - Y axis values / **Required**
	- **`name`** - _(String)_ - name of the plot
	- **`type`** - _(String)_ - "line" or "bar" / Default: line"
	- **`fillColor`** - _(String/Color)_ - Line chart only: area fill color / If not specified, the line will not be filled
	- **`lineWidth`** - _(Float)_ - Line chart only: line width / Default: 1.0
	- **`widthPercent`** - _(Float)_ - Bar chart only: [0 - 1.0], 0.1 means very skinny, 1.0 means bars touch each other / Default: 0.5
	- **`showDataPoint`** - _(Boolean)_ - show or hide the data points / Default: false
	- **`dataPointColor`** - _(String/Color)_ - outline color of the data point / Default: blue
	- **`dataPointFillColor`** - _(String/Color)_ - fill color of the data point / Default: blue
	- **`dataPointRadius`** - _(Float)_ - the radius of the data point / Default: 1.0
	- **`cornerRadius`** - _(Float)_ corner radius of the bars in a bar chart / Default: 1.0 / If 0, it will be completely rectangular.
	- **`highlightColor`** - _(String/Color)_ - the color of the highlighted data points at the highlight indices. this will override `dataPointColor` and `dataPointFillColor`.
	- **`highlightIndices`** - _(NumberArray)_ - the indices to apply the `highlightColor`
	- **`highlightRadius`** - _(Float)_ - the radius of a highlighted data point / Default: 1.0
	- **`sliceColors`** _(Array)_ - array of colors for the pie chart slices. matched by index with the `chartData.data` array. if fewer specified, remaining slices will be blue for now. **Required for pie chart**


- **`animationDuration`** _(Float)_ - duration of the animation in seconds / Default: 0.3
- **`axisColor`** _(String/Color)_ - color of the X and Y axes / Default: lightgray
- **`axisLineWidth`** _(Float)_ - width of the axis line / Default: 1
- **`axisTitleColor`** _(String/Color)_ - color of the title of the axes / Default: gray
- **`axisTitleFontSize`** _(Integer)_ - font size of axis titles / Default: 10
- **`chartTitle`** _(String)_ - title of the chart
- **`chartTitleColor`** _(String/Color)_ - color of the chart title / Default: gray
- **`gridColor`** _(String/Color)_ - color of the grid / Default: lightgray
- **`gridLineWidth`** _(Float)_ - width of the grid line / Default: 0.5
- **`hideHorizontalGridLines`** _(Boolean)_ - hides the horizontal grid lines when showGrid is true / Default: false
- **`hideVerticalGridLines`** _(Boolean)_ - hides the vertical grid lines when showGrid is true / Default: false
- **`labelFontSize`** _(Integer)_ - font size of axis labels / Default: 10
- **`labelTextColor`** _(String/Color)_ - text color of axis labels / Default: gray
- **`showAxis`** _(Boolean)_ - show or hide axis / Default: true
- **`showGrid`** _(Boolean)_ - show or hide grid / Default: true
- **`showXAxisLabels`** _(Boolean)_ - show or hide axis labels for the X axis / Default: true
- **`showYAxisLabels`** _(Boolean)_ - show or hide axis labels for the Y axis / Default: true
- **`tightBounds`** _(Boolean)_ - constrict Y axis to min/max of values instead of max/minning with 0 / Default: false
- **`verticalGridStep`** _(Integer)_ - number of Y axis grids / Default: 3
- **`xAxisTitle`** _(String)_ - Title for the x-axis
- **`xLabels`** _(StringArray)_ - array of all X axis label strings.	This determines the X-axis grid as well.	Need to match the number of input data in `chartData` / **Required**
- **`yAxisTitle`** _(String)_ - Title for the y-axis


## Known Issues / TODO
- Needs touch support
- Needs legend
- Stack Bar Chart
- Multi Line Chart
- Scatter/Bubble chart
- Testing w/ Travis CI

## Info/Support

Work prior to repo transfer on Feb 1, 2015 was the work of Hyun Cho @ OneFold.

Email tom.auty@gmail.com for support.
