'use strict';

var React = require('react-native');
var PropTypes = require('ReactPropTypes');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var createReactNativeComponentClass = require('createReactNativeComponentClass');
var StyleSheet = require('StyleSheet');
var NativeMethodsMixin = require('NativeMethodsMixin');
var flattenStyle = require('flattenStyle');
var merge = require('merge');
var { View } = React;

var RNChartView = createReactNativeComponentClass({
    validAttributes: merge(ReactNativeViewAttributes.UIView, {
        chartData:true,
        verticalGridStep:true,
        animationDuration:true,

        showGrid:true,
        gridColor:true,
        gridLineWidth:true,

        showAxis:true,
        xLabels:true,
        xAxisTitle:true,
        yAxisTitle:true,
        axisTitleColor:true,
        axisTitleFontSize:true,
        axisColor:true,
        axisLineWidth:true,

        labelFontSize:true,
        labelTextColor:true,

        chartTitle:true,
        chartTitleColor:true,
        chartFontSize:true
    }),
    uiViewClassName: 'RNChartView'
});

var RNChart = React.createClass({
    mixins: [NativeMethodsMixin],

    viewConfig: {
        uiViewClassName: 'UIView',
        validAttributes: ReactNativeViewAttributes.UIView
    },

    render() {
        var nativeProps = merge(this.props, {
            style: this.props.style,
            chartData: this.props.chartData
        });

        return <RNChartView {... nativeProps} />
    }
});

var styles = StyleSheet.create({
});

module.exports = RNChart;
