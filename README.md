# react-native-chart
react-native-chart is a simple module for adding line charts, area charts, or bar charts to your React Native app.

## Features
1. Define chart components in Javascript file and see rendered charts using Core Graphics and CALayer
1. Supports line charts with options to show data points, line fill, customized color, customized labels, etc...
2. Supports bar charts
3. Supports multiple charts in one view
4. Show animation when populating the chart

## Getting Started
1. `npm install react-native-chart --save`
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules` ➜ `react-native-chart` and add `RNChart.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libRNChart.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Click `RNChart.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.
5. Run your project (`Cmd+R`)

## Usage
```javascript
var React = require('react-native');
var RNChart = require('react-native-chart');

var {
    StyleSheet, View, Component,
} = React;

var styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
    },
    chart: {
        position: 'absolute', top: 16, left: 4, bottom: 4,right: 16
    }
});

var chartData = [
    {
        name:'BarChart',
        type:'bar',
        color:'purple',
        widthPercent:0.6,
        data:[
            30, 1, 1, 2, 3, 5, 21, 13, 21, 34, 55, 30
        ]
    },
    {
        name:'LineChart',
        color:'gray',
        lineWidth:2,
        showDataPoint:false,
        data:[
            10, 12, 14, 25, 31, 52, 41, 31, 52, 66, 22, 11
        ]
    }
];

var xLabels = ['0','1','2','3','4','5','6','7','8','9','10','11'];

class SimpleChart extends Component {
    render() {
        return (
            <View style={styles.container}>
                <RNChart style={styles.chart}
                    chartData={chartData}
                    verticalGridStep="5"
                    xLabels={xLabels}>
                </RNChart>
            </View>
        );
    }
}

```
## Properties
All properties are optional otherwise noted
### General
- `chartData` _(Dictionary)_ - : one nested block produces one type of chart
    - `data` - _(NumberArray)_ - Y axis values / **Required**
    - `name` - _(String)_ - name of the plot
    - `type` - _(String)_ - "line" or "bar" / Default: "line"
    - `fillColor` - _(color)_ - Line chart only: area fill color / If not specified, the line will not be filled
    - `lineWidth` - _(CGFloat)_ - Line chart only: line width / Default: 1.0
    - `widthPercent` - _(CGFloat)_ - Bar chart only: [0 - 1.0], 0.1 means very skinny, 1.0 means bars touch each other / Default: 0.5
    - `showDataPoint` - _(BOOL)_ - show or hide the data points / Default: false
    - `dataPointColor` - _(color)_ - outline color of the data point / Default: blue
    - `dataPointFillColor` - _(color)_ - fill color of the data point / Default: blue
    - `dataPointRadius` - _(CGFloat)_ - the circel radius of the data point / Default: 1.0

- `xLabels` _(StringArray)_ - array of all X axis label strings.  This determines the X-axis grid as well.  Need to match the number of input data in `chartData` / **Required**
- `animationDuration` _(CGFloat)_ - duration of the animation in seconds / Default: 0.3

- `showGrid` _(BOOL)_ - show or hide grid / Default: true
- `verticalGridStep` _(int)_ - number of Y axis grids / Default: 3
- `gridColor` _(color)_ - color of the grid / Default: lightgray
- `gridLineWidth` _(CGFloat)_ - width of the grid line / Default: 0.5

- `showAxis` _(BOOL)_ - show or hide axis / Default: true
- `axisLineWidth` _(CGFloat)_ - width of the axis line / Default: 1

- `labelFontSize` _(CGFloat)_ - font size of axis labels / Default: 10
- `labelTextColor` _(color)_ - text color of axis labels / Default: gray

## Known Issues / TODO
- Sample code cleanup
- Needs touch support
- Needs legend
- Stack Bar Chart
- Multi Line Chart
- Scatter/Bubble chart
- Pie chart

## Support
Email hyun@onefold.io
