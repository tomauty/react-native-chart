'use strict';

var React = require('react-native');
var {
    PropTypes,
    StyleSheet,
    requireNativeComponent
} = React;
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
    setNativeProps(props) {
        this.refs[CHART_REF].setNativeProps(props);
    },

    /** Render the native component with the correct props */
    render() {
        var style = [styles.base, this.props.style];
        var nativeProps = merge(this.props, {
            style,
            chartData: this.props.chartData
        });

        return <RNChartView ref={CHART_REF} {... nativeProps} />;
    }
});

module.exports = RNChart;
