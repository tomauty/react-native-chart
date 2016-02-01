'use strict';
import React, {
	PropTypes,
	requireNativeComponent,
} from 'react-native';
const { processColor } = React;

/** A native reference to the chart view */
const CHART_REF = 'chart';

const processData = (chartData) => {
	return chartData.map(d => {
		return {
			...d,
			color: processColor(d.color),
			fillColor: processColor(d.fillColor),
			dataPointColor: processColor(d.dataPointColor),
			dataPointFillColor: processColor(d.dataPointFillColor),
			highlightColor: processColor(d.highlightColor),
			fillGradient: Array.isArray(d.fillGradient)
				? [processColor(d.fillGradient[0]), processColor(d.fillGradient[1])]
				: null,
		};
	});
};

/** Our bridge component */
export default class RNChart extends React.Component {
	static propTypes = {

		chartData: PropTypes.arrayOf(
			PropTypes.shape({
				data: PropTypes.arrayOf(PropTypes.number).isRequired,
				name: PropTypes.string,
				type: PropTypes.oneOf(['line', 'bar']),
				fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				fillGradient: PropTypes.arrayOf([PropTypes.number, PropTypes.string]),
				cornerRadius: PropTypes.number,
				lineWidth: PropTypes.number,
				highlightColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				highlightIndices: PropTypes.arrayOf(PropTypes.number),
				widthPercent: PropTypes.number,
				showDataPoint: PropTypes.bool,
				dataPointColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				dataPointFillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				dataPointRadius: PropTypes.number,
			})
		).isRequired,

		animationDuration: PropTypes.number,
		axisColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		axisLineWidth: PropTypes.number,
		axisTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		axisTitleFontSize: PropTypes.number,
		chartFontSize: PropTypes.number,
		chartTitle: PropTypes.string,
		chartTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		gridColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
