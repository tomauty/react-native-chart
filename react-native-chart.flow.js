declare type Chart = {
	// Shared properties between most types
	data: Array<Array<number>>,
	type: 'line' | 'bar' | 'pie',
	highlightColor?: number | string,
	highlightIndices?: Array<number>,
	onDataPointPress?: Function,
	axisColor?: number | string,
	axisLabelColor?: number | string,
	axisLineWidth?: number,
	gridColor?: number | string,
	gridLineWidth?: number,
	hideHorizontalGridLines?: boolean,
	hideVerticalGridLines?: boolean,
	showAxis?: boolean,
	showGrid?: boolean,
	showXAxisLabels?: boolean,
	showYAxisLabels?: boolean,
	style?: any,
	tightBounds?: boolean,
	verticalGridStep?: number,
	xAxisHeight?: number,
	yAxisTransform?: Function,
	yAxisWidth?: number,

	// Bar chart props
	color?: number | string,
	cornerRadius?: number,
	widthPercent?: number,

	// Line/multi-line chart props
	fillColor?: number | string,
	dataPointColor?: number | string,
	dataPointFillColor?: number | string,
	dataPointRadius?: number,
	lineWidth?: number,
	showDataPoint?: boolean,

	// Pie chart props
	sliceColors?: Array<number | string>,

  // TODO
	highlightRadius?: number,
	pieCenterRatio?: number,
	animationDuration?: number,
	axisTitleColor?: number | string,
	axisTitleFontSize?: number,
	chartFontSize?: number,
	chartTitle?: string,
	chartTitleColor?: number | string,
	labelFontSize?: number,
	xAxisTitle?: string,
	yAxisTitle?: string,
	fillGradient?: Array<number | string>,
};
