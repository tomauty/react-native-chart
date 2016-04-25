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


export default class RNChart extends Component<void, any, any> {
	static propTypes = {

		chartData: PropTypes.shape({
			data: PropTypes.arrayOf(PropTypes.number).isRequired,
			type: PropTypes.oneOf(['line', 'bar', 'pie']),
			fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO
			fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
			cornerRadius: PropTypes.number, // TODO
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
		xLabels: PropTypes.array.isRequired,
		yAxisTitle: PropTypes.string,
	};

	static defaultProps : any = {
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
	};

	constructor(props : any) {
		super(props);
		this.state = { yWidth: 0 };
	}
	componentDidMount() { this._updateAxisLayout(); }
	componentDidUpdate() { this._updateAxisLayout(); }

	_updateAxisLayout() {
		if (this.refs.yAxis) {
			this.refs.yAxis.measure((_ox, _oy, width, _height) => {
				if (width !== this.state.yWidth) {
					this.setState({ yWidth: width });
				}
			});
		}
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
		const convertedProps = { ...this.props, chartData: this.props.chartData || [] };
		const components = { 'line': BarChart, 'bar': BarChart, 'pie': BarChart };

		const PieChart = {}; // TODO: remove
		const data = convertedProps.chartData;
		return (
			<View>
				{(() => {
					const Chart = components[data.type] || BarChart;
					if (convertedProps.showAxis && Chart !== PieChart) {
						return (
							<View ref="container" style={[ this.props.style || {}, { flex: 1, flexDirection: 'column' }]}>
								<View style={[styles.default, { flexDirection: 'row'}]}>
									<View ref="yAxis">
										<YAxis
											data={data.data}
											height={this.state.containerHeight - this.state.xHeight}
											axisColor={this.props.axisColor}
											axisLineWidth={convertedProps.axisLineWidth}
											tightBounds={convertedProps.tightBounds}
											verticalGridStep={convertedProps.verticalGridStep}
										/>
									</View>
									<Chart {...convertedProps} data={data} />
								</View>
								{(() => {
									if (!this.state.yWidth) return null;
									return (
										<View ref="xAxis">
											<XAxis
												width={this.state.containerWidth - this.state.yWidth}
												data={data.data}
												xAxisLabels={this.props.xAxisLabels}
												style={{ marginLeft: this.state.yWidth - 1 }}
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
							<Chart {...convertedProps} data={data} />
						</View>
					);
				})()}
			</View>
		)
	}
}
