# react-native-chart

[![Join the chat at https://gitter.im/tomauty/react-native-chart](https://badges.gitter.im/tomauty/react-native-chart.svg)](https://gitter.im/tomauty/react-native-chart)
[![npm version](https://badge.fury.io/js/react-native-chart.svg)](https://badge.fury.io/js/react-native-chart)

react-native-chart is a simple module for adding line charts, area charts, or bar charts to your React Native app.

![Screenshot](http://g.recordit.co/t7LYAmXOIc.gif)
(Working on getting a better GIF...)

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
import Chart from 'react-native-chart';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	chart: {
		width: 200,
		height: 200,
	},
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
| Property                | Type    | Description                                                   | Required | Default |
|-------------------------|---------|---------------------------------------------------------------|----------|---------|
| data                    | Object  | A chartData object                                            | Yes      | N/A     |
| animationDuration       | Number  | The length of time in which a  chart animation occurs, in ms. |          | 0.5     |
| axisColor               | String  | The color of the lines of the X and Y axes                    |          | #333333 |
| axisLabelColor          | String  | Color of the labels on X and Y axes                           |          | #333333 |
| axisLineWidth           | Number  | Width of the axis lines                                       |          | 0.5     |
| gridColor               | String  | Color of the grid lines                                       |          | #333333 |
| gridLineWidth           | Number  | Width of the grid lines                                       |          | 0.5     |
| hideHorizontalGridLines | Boolean | Hide only the grid lines running LTR                          |          | false   |
| hideVerticalGridLines   | Boolean | Hide only the grid lines running up/down                      |          | false   |
| labelFontSize           | Number  | Font size of axis labels                                      |          | 14      |
| showAxis                | Boolean | Show the X and Y axes                                         |          | true    |
| showGrid                | Boolean | Show gridlines                                                |          | true    |
| showXAxisLabels         | Boolean | Show the labels for the x-axis                                |          | true    |
| showYAxisLabels         | Boolean | Show the labels for the y-axis                                |          | true    |

## Info/Support

Work prior to repo transfer on Feb 1, 2015 was the work of Hyun Cho @ OneFold.

Email tom.auty@gmail.com for support.
