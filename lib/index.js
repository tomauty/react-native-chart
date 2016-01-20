'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react-native');
var PropTypes = React.PropTypes;
var StyleSheet = React.StyleSheet;
var requireNativeComponent = React.requireNativeComponent;

var merge = require('merge');

/** A native reference to the chart view */
var CHART_REF = 'chart';

/** The native chart view */
var RNChartView = requireNativeComponent('RNChartView', RNChart);

/** A base styles object that the user can override by passing in their own styles */
var styles = StyleSheet.create({
    base: {}
});

/** Our bridge component */
var RNChart = React.createClass({
    displayName: 'RNChart',

    propTypes: {
        // TODO: define what these objects look like
        chartData: PropTypes.array.isRequired,
        xLabels: PropTypes.array.isRequired,
        animationDuration: PropTypes.number,
        showGrid: PropTypes.bool,
        verticalGridStep: PropTypes.number,
        // TODO: allow strings and use processColor to convert
        gridColor: PropTypes.number,
        gridLineWidth: PropTypes.number,
        showAxis: PropTypes.bool,
        showXAxisLabels: PropTypes.bool,
        showYAxisLabels: PropTypes.bool,
        axisLineWidth: PropTypes.number,
        labelFontSize: PropTypes.number,
        // TODO: allow strings and use processColor to convert
        labelTextColor: PropTypes.number
    },

    /** Pass the props to the native component */
    setNativeProps: function setNativeProps(props) {
        this.refs[CHART_REF].setNativeProps(props);
    },

    /** Render the native component with the correct props */
    render: function render() {
        var style = [styles.base, this.props.style];
        var nativeProps = merge(this.props, {
            style: style,
            chartData: this.props.chartData
        });

        return React.createElement(RNChartView, _extends({ ref: CHART_REF }, nativeProps));
    }
});

module.exports = RNChart;