# react-native-chart
react-native-chart is a simple module for adding line charts, area charts, or bar charts to your React Native app.

## Features
1. Line chart with options to show data points, fill the line, customize color, customize labels, etc...
2. Bar chart with options to customize
3. Add multiple charts in one view
4. Add animation when populating the chart

## Getting Started
1. `npm install react-native-chart --save`
2. In XCode, right click on project's name and choose `Add Files to..`
3. Go to `node_modules` ➜ `react-native-native` and add files
4. Add `require('./react-native-chart')` in your JS file and start using the `<RNChart\>` tag

## Usage
```javascript
var React = require('react-native');
var RNChart = require('react-native-chart');

var {
    StyleSheet,
    View,
    Component,
} = React;

var styles = StyleSheet.create({
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
        right: 16
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
All properties are optional otherwise the noted
### General
- `chartData` _(String)_ - choose one of the following:
    - `name` - (String) - name of the plot /
    - `type` - (String) - "line" or "bar" / Default: "line"
    - `color` - (color) - color of the line or the bar / Default: 
- `animationDuration` _(CGFloat)_ - duration of the animation in seconds / Default: 0.3
### Grid
- `showGrid` _(BOOL)_ - show or hide grid / Default: true
- `verticalGridStep` _(int)_ - number of Y axis grids / Default: 3
- `gridColor` _(color)_ - color of the grid / Default: lightgray
- `gridLineWidth` _(CGFloat)_ - width of the grid line / Default: 0.5
### Axis
- `showAxis` _(BOOL)_ - show or hide axis / Default: true
- `axisLineWidth` _(CGFloat)_ - width of the axis line / Default: 1
### Label
- `labelFontSize` _(CGFloat)_ - font size of axis labels / Default: 10
- `labelTextColor` _(color)_ - text color of axis labels / Default: gray

## Known Issues

## FAQ

## Support
Email hyun@onefold.io
