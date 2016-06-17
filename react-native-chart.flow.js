declare type Chart = {
	// Shared properties between most types
	data: Array<Array<number>>,
	type: 'line' | 'bar' | 'pie',
	highlightColor?: number | string,
	highlightIndices?: Array<number>,
	onDataPointPress?: Function,
	axisColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisLabelColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisLineWidth: PropTypes.number,
	gridColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	gridLineWidth: PropTypes.number,
	hideHorizontalGridLines: PropTypes.bool,
	hideVerticalGridLines: PropTypes.bool,
	showAxis: PropTypes.bool,
	showGrid: PropTypes.bool,
	showXAxisLabels: PropTypes.bool,
	showYAxisLabels: PropTypes.bool,
	style: PropTypes.any,
	tightBounds: PropTypes.bool,
	verticalGridStep: PropTypes.number,
	xAxisHeight: PropTypes.number,
	yAxisTransform: PropTypes.func,
	yAxisWidth: PropTypes.number,

	// Bar chart props
	color?: number | string,
	cornerRadius?: number
	// fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
	widthPercent?: number,

	// Line/multi-line chart props
	fillColor?: number | string,
	dataPointColor?: number | string,
	dataPointFillColor?: number | string,
	dataPointRadius?: number
	lineWidth?: number
	showDataPoint?: boolean,

	// Pie chart props
	sliceColors?: Array<number | string>,

  // TODO
	// highlightRadius: PropTypes.number, // TODO
	// pieCenterRatio: PropTypes.number, // TODO
	// animationDuration: PropTypes.number, // TODO
	// axisTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	// axisTitleFontSize: PropTypes.number,
	// chartFontSize: PropTypes.number,
	// chartTitle: PropTypes.string,
	// chartTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	// labelFontSize: PropTypes.number,
	// xAxisTitle: PropTypes.string,
	// yAxisTitle: PropTypes.string,
};
