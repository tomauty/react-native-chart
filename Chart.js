/* @flow */
'use strict';
import React, { Component, PropTypes, Text, LayoutAnimation, StyleSheet, View } from 'react-native';
import BarChart from './src/BarChart';
import LineChart from './src/LineChart';
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
		axisLabelColor: C.BLACK,
		axisLineWidth: 1,
		axisTitleColor: C.GREY,
		axisTitleFontSize: 16,
		chartFontSize: 14,
		gridColor: C.BLACK,
		gridLineWidth: 0.5,
		labelFontSize: 10,
		labelTextColor: C.GREY,
		hideHorizontalGridLines: false,
		hideVerticalGridLines: false,
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

	componentWillUpdate() {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}

	_drawGrid(props) {
		const range = [];
		const uniqueValuesInDataSet = props.data.data.filter((v, i, self) => self.indexOf(v) === i);
		const steps = (uniqueValuesInDataSet.length < props.verticalGridStep) ? uniqueValuesInDataSet.length : props.verticalGridStep;
		for (let i = steps; i >= 0; i--) range.push(i);

		const containerStyle = { width: props.width, height: props.height, position: 'absolute', left: 0 };
		const horizontalGridStyle = {
			height: props.height / props.verticalGridStep,
			width: props.width,
			borderTopColor: props.gridColor,
			borderTopWidth: props.gridLineWidth,
		};
		const verticalGridStyle = {
			height: props.height,
			width: props.width / props.data.data.length,
			borderRightColor: props.gridColor,
			borderRightWidth: props.gridLineWidth,
		};

		return (
			<View style={containerStyle}>
				<View style={{ position: 'absolute', flexDirection: 'column', justifyContent: 'space-around' }}>
					{range.map((_,i) => <View key={i} style={horizontalGridStyle} />)}
				</View>
				<View style={{ flexDirection: 'row', position: 'absolute', justifyContent: 'space-around' }}>
					{props.data.data.map((_,i) => <View key={i} style={verticalGridStyle} />)}
				</View>
			</View>
		)
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
		const components = { 'line': LineChart, 'bar': BarChart, 'pie': BarChart };

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
											{...this.props}
											data={data.data}
											height={this.state.containerHeight - this.state.xHeight}
											width={this.props.yAxisWidth}
											minVerticalBound={this.state.bounds.min}
											containerWidth={this.state.containerWidth}
											maxVerticalBound={this.state.bounds.max}
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
										drawGrid={this._drawGrid}
									>
								</Chart>

								</View>
								{(() => {
									return (
										<View ref="xAxis">
											<XAxis
												{...this.props}
												width={this.state.containerWidth - this.props.yAxisWidth}
												data={data.data}
												style={{ marginLeft: this.props.yAxisWidth - 1 }}
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

		// Shared properties between most types
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		type: PropTypes.oneOf(['line', 'bar', 'pie']),
		highlightColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		highlightIndices: PropTypes.arrayOf(PropTypes.number), // TODO

		// Bar chart props
		color: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		cornerRadius: PropTypes.number,
		fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
		widthPercent: PropTypes.number,

		// Line/multi-line chart props
		fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		dataPointColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		dataPointFillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
		dataPointRadius: PropTypes.number, // TODO
		highlightRadius: PropTypes.number, // TODO
		lineWidth: PropTypes.number,
		showDataPoint: PropTypes.bool, // TODO

		// Pie chart props
		pieAngle: PropTypes.number, // TODO
		pieCenterRatio: PropTypes.number, // TODO
		sliceColors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
	}).isRequired,

	animationDuration: PropTypes.number, // TODO
	axisColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	axisLabelColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
