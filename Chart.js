/* @flow */
'use strict';
import React, { Component, PropTypes, StyleSheet, View } from 'react-native';
import BarChart from './src/BarChart';
import YAxis from './src/yAxis';
import XAxis from './src/xAxis';
import * as C from './src/constants';

const styles = StyleSheet.create({
	default: {
		flex: 1,
	},
})

const getRoundNumber = (value, gridStep) => {
	if (value <= 0) return 0;
	const logValue = Math.log10(value);
	const scale = Math.pow(10, Math.floor(logValue));
	const n = Math.ceil(value / scale * 4);

	let tmp = n % gridStep;
	if (tmp !== 0) tmp += (gridStep - tmp);
	return n * scale / 4.0;
}


export default class RNChart extends Component<void, any, any> {
	static defaultProps : any = {
		chartData: [],
		animationDuration: 0.5,
		axisColor: C.BLACK,
		axisLineWidth: 1,
		axisTitleColor: C.GREY,
		axisTitleFontSize: 16,
		chartFontSize: 14,
		gridColor: C.BLACK,
		gridLineWidth: 0.5,
		labelFontSize: 10,
		labelTextColor: C.GREY,
		showAxis: true,
		showGrid: true,
		showXAxisLabels: true,
		showYAxisLabels: true,
		tightBounds: false,
		touchRadius: 5,
		verticalGridStep: 3,
		yAxisWidth: 30,
		horizontalScale: 1,
	};

	constructor(props : any) {
		super(props);
		this.state = { bounds: { min: 0, max: 0 } };
	}
	componentDidMount() {
		this._updateAxisLayout();
		this._computeBounds();
	}
	componentDidUpdate(props : any) {
		this._updateAxisLayout();
		if (this.props !== props) {
			this._computeBounds();
		}
	}

	_computeBounds() {
		let min = Infinity;
		let max = -Infinity;

		this.props.chartData.data.forEach(number => {
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
			let newMin, newMax;

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
		this.setState({ bounds: { max, min }});
	}

	_minVerticalBound() : number {
		if (this.props.tightBounds) return this.state.bounds.min;
		return (this.state.bounds.min > 0) ? this.state.bounds.min : 0;
	}

	_maxVerticalBound() : number {
		if (this.props.tightBounds) return this.state.bounds.max;
		return (this.state.bounds.max > 0) ? this.state.bounds.max : 0;
	}

	_updateAxisLayout() {
		if (this.refs.xAxis) {
			this.refs.xAxis.measure((_ox, _oy, _width, height) => {
				if (height !== this.state.xHeight) {
					this.setState({ xHeight: height });
				}
			});
		}
		if (this.refs.container) {
			this.refs.container.measure((_ox, _oy, width, height) => {
				if (height !== this.state.containerHeight) {
					this.setState({ containerHeight: height, containerWidth: width });
				}
			});
		}
	}

	render() {
		const components = { 'line': BarChart, 'bar': BarChart, 'pie': BarChart };

		const PieChart = {}; // TODO: remove
		const data = this.props.chartData;
		return (
			<View>
				{(() => {
					const Chart = components[data.type] || BarChart;
					if (this.props.showAxis && Chart !== PieChart) {
						return (
							<View ref="container" style={[ this.props.style || {}, { flex: 1, flexDirection: 'column' }]}>
								<View style={[styles.default, { flexDirection: 'row'}]}>
									<View ref="yAxis">
										<YAxis
											data={data.data}
											height={this.state.containerHeight - this.state.xHeight}
											axisColor={this.props.axisColor}
											axisLineWidth={this.props.axisLineWidth}
											tightBounds={this.props.tightBounds}
											verticalGridStep={this.props.verticalGridStep}
											minVerticalBound={this.state.bounds.min}
											maxVerticalBound={this.state.bounds.max}
											yAxisTransform={this.props.yAxisTransform}
											style={{ width: this.props.yAxisWidth }}
										/>
									</View>
									<Chart
										{...this.props}
										data={data}
										width={this.state.containerWidth - this.props.yAxisWidth}
										height={this.state.containerHeight - this.state.xHeight}
										minVerticalBound={this.state.bounds.min}
										maxVerticalBound={this.state.bounds.max}
									/>
								</View>
								{(() => {
									return (
										<View ref="xAxis">
											<XAxis
												width={this.state.containerWidth - this.props.yAxisWidth}
												data={data.data}
												xAxisLabels={this.props.xAxisLabels}
												style={{ marginLeft: this.props.yAxisWidth - 1 }}
												axisColor={this.props.axisColor}
												axisLineWidth={this.props.axisLineWidth}
											/>
										</View>
									);
								})()}
							</View>
						);
					}
					return (
						<View ref="container" style={[ this.props.style || {}, styles.default ]}>
							<Chart {...this.props} data={data} />
						</View>
					);
				})()}
			</View>
		)
	}
}

RNChart.propTypes = {
	chartData: PropTypes.shape({
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		type: PropTypes.oneOf(['line', 'bar', 'pie']),
		fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
		cornerRadius: PropTypes.number,
		lineWidth: PropTypes.number, // TODO
		highlightColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		highlightIndices: PropTypes.arrayOf(PropTypes.number), // TODO
		highlightRadius: PropTypes.number, // TODO
		widthPercent: PropTypes.number, // TODO
		showDataPoint: PropTypes.bool, // TODO
		dataPointColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		dataPointFillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		dataPointRadius: PropTypes.number, // TODO
		pieAngle: PropTypes.number, // TODO
		pieCenterRatio: PropTypes.number, // TODO
		sliceColors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
	}).isRequired,

	animationDuration: PropTypes.number, // TODO
	axisColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisLineWidth: PropTypes.number,
	axisTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisTitleFontSize: PropTypes.number,
	chartFontSize: PropTypes.number,
	chartTitle: PropTypes.string,
	chartTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	gridColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	gridLineWidth: PropTypes.number,
	hideHorizontalGridLines: PropTypes.bool,
	hideVerticalGridLines: PropTypes.bool,
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
	xAxisLabels: PropTypes.array.isRequired,
	yAxisTitle: PropTypes.string,
	yAxisTransform: PropTypes.func,
	yAxisWidth: PropTypes.number,
};
