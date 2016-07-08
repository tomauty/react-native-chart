/* @flow */
'use strict';
import React, { Component, PropTypes } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import YAxis from './yAxis';
import XAxis from './xAxis';
import * as C from './constants';

const styles = StyleSheet.create({
	default: { flex: 1 },
});

const getRoundNumber = (value, gridStep) => {
	if (value <= 0) return 0;
	const logValue = Math.log10(value);
	const scale = Math.pow(10, Math.floor(logValue));
	const n = Math.ceil(value / scale * 4);

	let tmp = n % gridStep;
	if (tmp !== 0) tmp += (gridStep - tmp);
	return n * scale / 4.0;
};


export default class Chart extends Component<void, any, any> {
	static defaultProps : any = {
		data: [],
		animated: true,
		animationDuration: 300,
		axisColor: C.BLACK,
		axisLabelColor: C.BLACK,
		axisLineWidth: 1,
		axisTitleColor: C.GREY,
		axisTitleFontSize: 16,
		chartFontSize: 14,
		dataPointRadius: 3,
		gridColor: C.BLACK,
		gridLineWidth: 0.5,
		hideHorizontalGridLines: false,
		hideVerticalGridLines: false,
		horizontalScale: 1,
		labelFontSize: 10,
		lineWidth: 1,
		showAxis: true,
		showDataPoint: false,
		showGrid: true,
		showXAxisLabels: true,
		showYAxisLabels: true,
		tightBounds: false,
		verticalGridStep: 4,
		xAxisHeight: 20,
		yAxisWidth: 30,
	};

	constructor(props : any) {
		super(props);
		this.state = { bounds: { min: 0, max: 0 } };
	}
	componentDidMount() {
		this._computeBounds();
	}

	shouldComponentUpdate(props, state) {
		return props !== this.props || state !== this.state;
	}

	componentDidUpdate(props : any) {
		if (this.props !== props) {
			this._computeBounds();
		}
	}

	_computeBounds() : any {
		let min = Infinity;
		let max = -Infinity;
		const data = this.props.data || [];
		data.forEach(XYPair => {
			const number = XYPair[1];
			if (number < min) min = number;
			if (number > max) max = number;
		});

		min = Math.round(min);
		max = Math.round(max);

		// Exit if we want tight bounds
		if (this.props.tightBounds) {
			return this.setState({ bounds: { min, max } });
		}

		max = getRoundNumber(max, this.props.verticalGridStep);
		if (min < 0) {
			let step;

			if (this.props.verticalGridStep > 3) {
				step = Math.abs(max - min) / (this.props.verticalGridStep - 1);
			} else {
				step = Math.max(Math.abs(max - min) / 2, Math.max(Math.abs(min), Math.abs(max)));
			}
			step = getRoundNumber(step, this.props.verticalGridStep);
			let newMin;
			let newMax;

			if (Math.abs(min) > Math.abs(max)) {
				const m = Math.ceil(Math.abs(min) / step);
				newMin = step * m * (min > 0 ? 1 : -1);
				newMax = step * (this.props.verticalGridStep - m) * (max > 0 ? 1 : -1);
			} else {
				const m = Math.ceil(Math.abs(max) / step);
				newMax = step * m * (max > 0 ? 1 : -1);
				newMin = step * (this.props.verticalGridStep - m) * (min > 0 ? 1 : -1);
			}
			if (min < newMin) {
				newMin -= step;
				newMax -= step;
			}
			if (max > newMax + step) {
				newMin += step;
				newMax += step;
			}
			if (max < min) {
				const tmp = max;
				max = min;
				min = tmp;
			}
		}
		return this.setState({ bounds: { max, min } });
	}

	_onContainerLayout = (e : Object) => this.setState({
		containerHeight: Math.ceil(e.nativeEvent.layout.height) + 1,
		containerWidth: Math.ceil(e.nativeEvent.layout.width),
	});

	_minVerticalBound() : number {
		if (this.props.tightBounds) return this.state.bounds.min;
		return (this.state.bounds.min > 0) ? this.state.bounds.min : 0;
	}

	_maxVerticalBound() : number {
		if (this.props.tightBounds) return this.state.bounds.max;
		return (this.state.bounds.max > 0) ? this.state.bounds.max : 0;
	}

	render() {
		const components = { 'line': LineChart, 'bar': BarChart, 'pie': PieChart };
		const axisAlign = (this.props.type === 'line') ? 'left' : 'center';
		return (
			<View>
				{(() => {
					const ChartType = components[this.props.type] || BarChart;
					if (this.props.showAxis && Chart !== PieChart) {
						return (
							<View
								ref="container"
								style={[this.props.style || {}, { flex: 1, flexDirection: 'column' }]}
								onLayout={this._onContainerLayout}
							>
								<View style={[styles.default, { flexDirection: 'row' }]}>
									<View ref="yAxis">
										<YAxis
											{...this.props}
											data={this.props.data}
											height={this.state.containerHeight - this.props.xAxisHeight}
											width={this.props.yAxisWidth}
											minVerticalBound={this.state.bounds.min}
											containerWidth={this.state.containerWidth}
											maxVerticalBound={this.state.bounds.max}
											style={{ width: this.props.yAxisWidth }}
										/>
									</View>
									<ChartType
										{...this.props}
										data={this.props.data}
										width={this.state.containerWidth - this.props.yAxisWidth}
										height={this.state.containerHeight - this.props.xAxisHeight}
										minVerticalBound={this.state.bounds.min}
										maxVerticalBound={this.state.bounds.max}
									/>
								</View>
								{(() => {
									return (
										<View ref="xAxis">
											<XAxis
												{...this.props}
												width={this.state.containerWidth - this.props.yAxisWidth}
												data={this.props.data}
												height={this.props.xAxisHeight}
												align={axisAlign}
												style={{ marginLeft: this.props.yAxisWidth - 1 }}
											/>
										</View>
									);
								})()}
							</View>
						);
					}
					return (
						<View
							ref="container"
							onLayout={this._onContainerLayout}
							style={[this.props.style || {}, styles.default]}
						>
							<ChartType
								{...this.props}
								data={this.props.data}
								width={this.state.containerWidth}
								height={this.state.containerHeight}
								minVerticalBound={this.state.bounds.min}
								maxVerticalBound={this.state.bounds.max}
							/>
						</View>
					);
				})()}
			</View>
		);
	}
}

Chart.propTypes = {
	// Shared properties between most types
	data: PropTypes.arrayOf(PropTypes.array).isRequired,
	type: PropTypes.oneOf(['line', 'bar', 'pie']).isRequired,
	highlightColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
	highlightIndices: PropTypes.arrayOf(PropTypes.number), // TODO
	onDataPointPress: PropTypes.func,

	// Bar chart props
	color: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	cornerRadius: PropTypes.number,
	// fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
	widthPercent: PropTypes.number,

	// Line/multi-line chart props
	fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	dataPointColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	dataPointFillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	dataPointRadius: PropTypes.number,
	// highlightRadius: PropTypes.number, // TODO
	lineWidth: PropTypes.number,
	showDataPoint: PropTypes.bool, // TODO

	// Pie chart props
	// pieCenterRatio: PropTypes.number, // TODO
	sliceColors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
	animationDuration: PropTypes.number,
	axisColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisLabelColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisLineWidth: PropTypes.number,
	// axisTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	// axisTitleFontSize: PropTypes.number,
	// chartFontSize: PropTypes.number,
	// chartTitle: PropTypes.string,
	// chartTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	gridColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	gridLineWidth: PropTypes.number,
	hideHorizontalGridLines: PropTypes.bool,
	hideVerticalGridLines: PropTypes.bool,
	// labelFontSize: PropTypes.number,
	showAxis: PropTypes.bool,
	showGrid: PropTypes.bool,
	showXAxisLabels: PropTypes.bool,
	showYAxisLabels: PropTypes.bool,
	style: PropTypes.any,
	tightBounds: PropTypes.bool,
	verticalGridStep: PropTypes.number,
	// xAxisTitle: PropTypes.string,
	xAxisHeight: PropTypes.number,
	xAxisTransform: PropTypes.func,
	// yAxisTitle: PropTypes.string,
	yAxisTransform: PropTypes.func,
	yAxisWidth: PropTypes.number,
};
