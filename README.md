# react-native-chart

## Getting Started
1. blah blah
2. 

## Usage
Add `require('./react-native-chart')` in your JS file and start using the `<RNChart\>` tag

1. git clone this repo on the master node in your Hadoop cluster.
2. Run this to compile custom code needed for MapReduce:
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
