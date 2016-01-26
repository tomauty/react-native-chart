'use strict';
import React, {
	PropTypes,
	StyleSheet,
	requireNativeComponent,
} from 'react-native';

const { processColor } = React;

import merge from 'merge';

/** A native reference to the chart view */
const CHART_REF = 'chart';

/** A base styles object that the user can override by passing in their own styles */
const styles = StyleSheet.create({
	base: {},
});

const processData = (chartData) => {
	return chartData.map(d => {
		return {
			...d,
			color: processColor(d.color),
			fillColor: processColor(d.fillColor),
			dataPointColor: processColor(d.dataPointColor),
			dataPointFillColor: processColor(d.dataPointFillColor),
		};
	});
};

/** Our bridge component */

export default class RNChart extends React.Component {
	static propTypes = {
			// TODO: define what these objects look like
		animationDuration: PropTypes.number,
		axisColor: PropTypes.number,
		axisLineWidth: PropTypes.number,
		axisTitleColor: PropTypes.number,
		axisTitleFontSize: PropTypes.number,
		chartData: PropTypes.array.isRequired,
		chartFontSize: PropTypes.number,
		chartTitle: PropTypes.string,
		chartTitleColor: PropTypes.number,
		gridColor: PropTypes.number,
		gridLineWidth: PropTypes.number,
		labelFontSize: PropTypes.number,
		labelTextColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		showAxis: PropTypes.bool,
		showGrid: PropTypes.bool,
		showXAxisLabels: PropTypes.bool,
		showYAxisLabels: PropTypes.bool,
		style: PropTypes.any,
		tightBounds: PropTypes.bool,
		verticalGridStep: PropTypes.number,
		xAxisTitle: PropTypes.string,
		xLabels: PropTypes.array.isRequired,
		yAxisTitle: PropTypes.string,
	};

	/** Render the native component with the correct props */
	render() {
		const convertedProps = {
			...this.props,
			axisColor: processColor(this.props.axisColor),
			axisTitleColor: processColor(this.props.axisTitleColor),
			chartTitleColor: processColor(this.props.chartTitleColor),
			gridColor: processColor(this.props.gridColor),
			labelTextColor: processColor(this.props.labelTextColor),
			chartData: (this.props.chartData) ? processData(this.props.chartData) : undefined,
		};
		return <RNChartView ref={CHART_REF} {...convertedProps} />;
	}
}

/** The native chart view */
const RNChartView = requireNativeComponent('RNChartView', RNChart);
