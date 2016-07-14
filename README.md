# react-native-chart

[![Join the chat at https://gitter.im/tomauty/react-native-chart](https://badges.gitter.im/tomauty/react-native-chart.svg)](https://gitter.im/tomauty/react-native-chart)
[![npm version](https://badge.fury.io/js/react-native-chart.svg)](https://badge.fury.io/js/react-native-chart)

react-native-chart is a simple module for adding line charts, area charts, or bar charts to your React Native app.

**NOTE!** The current major version (1.X.Y) is still being developed. If you are looking for the most recent iOS-only version, please download `^0.1.4`.

![Screenshot](https://raw.githubusercontent.com/tomauty/react-native-chart/master/screenshots/README.png)

## Getting Started
[![NPM](https://nodei.co/npm/react-native-chart.png?downloads=true)](https://nodei.co/npm/react-native-chart/)

1. `npm i react-native-chart --save`

__Link ART to your project__

1. Right click Libraries and click 'Add Files to {YourProject}'

<img width="366" alt="screen shot 2016-06-17 at 3 39 24 pm" src="https://cloud.githubusercontent.com/assets/1112872/16162504/e4f284f4-34a1-11e6-9819-49f7b3ee4fd3.png">

2. Navigate to your project's node_modules/react-native/Libraries/ART and select 'ART.xcodeproj'

<img width="435" alt="screen shot 2016-06-17 at 3 39 42 pm" src="https://cloud.githubusercontent.com/assets/1112872/16162506/e4f3f35c-34a1-11e6-8fa6-82b1d9162028.png">

3. Go to Build Phases -> Link Binary With Libraries

<img width="660" alt="screen shot 2016-06-17 at 3 40 00 pm" src="https://cloud.githubusercontent.com/assets/1112872/16162508/e4f8a6cc-34a1-11e6-91d9-2a0fcc1179ab.png">

4 Click the '+', and add libART.a

<img width="250" alt="screen shot 2016-06-17 at 3 40 03 pm" src="https://cloud.githubusercontent.com/assets/1112872/16162507/e4f50238-34a1-11e6-9b4d-3f883c9f27c4.png">

Then rebuild.



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

const data = [
	[0, 1],
	[1, 3],
	[3, 7],
	[4, 9],
];

class SimpleChart extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Chart
					style={styles.chart}
					data={data}
					verticalGridStep={5}
					type="line"
				 />
			</View>
		);
	}
}

```
## Properties

| Property                | Type                      | Description                                               | Required | Default               |
| ----------------------- | ------------------------- | --------------------------------------------------------- | -------- | --------------------- |
| data                    | Array< [number, number] > | An array of [x, y] pairs.                                 | **Yes**  |                       |
| type                    | string                    | pie/bar/line                                              | **Yes**  | bar                   |
| color                   | string                    | Color of bars/line in line chart                          | No       | #4DC4E6               |
| cornerRadius            | number                    | Corner radius of bars in bar chart                        | No       | 0                     |
| fillColor               | string                    | Fill area color in line chart                             | No       |                       |
| dataPointColor          | string                    | Stroke color for line chart data point                    | No       |                       |
| dataPointFillColor      | string                    | Fill color for line chart data point                      | No       |                       |
| dataPointRadius         | number                    | Radius of the data point                                  | No       | 3                     |
| lineWidth               | number                    | Width of line chart line                                  | No       | 1                     |
| showDataPoint           | boolean                   | Show data points on line chart                            | No       | false                 |
| sliceColors             | Array < string >          | Array of colors for pie chart slices                      | **Yes**  | [ < random colors > ] |
| axisColor               | string                    | Color of axis lines                                       | No       | #333333               |
| axisLabelColor          | string                    | Color of axis test                                        | No       | #333333               |
| axisLineWidth           | number                    | Width of axis lines                                       | No       | 1                     |
| gridColor               | string                    | Color of grid lines                                       | No       | #333333               |
| gridLineWidth           | number                    | Width of grid lines                                       | No       | 0.5                   |
| hideHorizontalGridLines | boolean                   | Hide grid lines going from LTR                            | No       | false                 |
| hideVerticalGridLines   | boolean                   | Hide grid lines going up -> down                          | No       | false                 |
| showAxis                | boolean                   | Show the X and Y axes                                     | No       | true                  |
| showGrid                | boolean                   | Show the grid                                             | No       | true                  |
| showXAxisLabels         | boolean                   | Show X-Axis labels                                        | No       | true                  |
| showYAxisLabels         | boolean                   | Show Y-Axis labels                                        | No       | true                  |
| style                   | object                    | Style on the container                                    | No       | {}                    |
| tightBounds             | boolean                   | Tighten min and max bounds strictly to min/max in dataset | No       | false                 |
| verticalGridStep        | number                    | How many vertical grid lines to show                      | No       | 4                     |
| xAxisHeight             | number                    | Height of X-axis container                                | No       | 20                    |
| yAxisTransform          | Function                  | Transform data point to y-axis label                      | No       | (_) => _              |
| xAxisTransform          | Function                  | Transform data point to x-axis label                      | No       | (_) => _              |
| yAxisWidth              | number                    | Width of the Y-axis container                             | No       | 30                    |

## TODO
- [ ] Code cleanup
- [ ] Multi-line chart
- [ ] Horizontal line chart
- [ ] Scatter chart

## Info/Support

Work prior to repo transfer on Feb 1, 2015 was the work of Hyun Cho @ OneFold.

Email tom.auty@gmail.com for support.
