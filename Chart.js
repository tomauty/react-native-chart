/* @flow */
'use strict';
import React, { PropTypes, StyleSheet, View } from 'react-native';
const { processColor } = React;

import BarChart from './src/bar';
import YAxis from './src/y-axis';
import XAxis from './src/x-axis';

const styles = StyleSheet.create({
	default: {
		flex: 1,
	},
})

const processData = (d) => {
	return {
		...d,
		color: processColor(d.color),
		fillColor: processColor(d.fillColor),
		dataPointColor: processColor(d.dataPointColor),
		dataPointFillColor: processColor(d.dataPointFillColor),
		highlightColor: processColor(d.highlightColor),
		fillGradient: Array.isArray(d.fillGradient)
			? [processColor(d.fillGradient[0]), processColor(d.fillGradient[1])]
			: undefined,
		sliceColors: Array.isArray(d.sliceColors)
			? d.sliceColors.map(c => (c) ? processColor(c) : processColor('blue'))
			: undefined,
	};
};

export default class RNChart extends React.Component {
	static propTypes = {

		chartData: PropTypes.shape({
			data: PropTypes.arrayOf(PropTypes.number).isRequired,
			name: PropTypes.string,
			type: PropTypes.oneOf(['line', 'bar', 'pie']),
			fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
			cornerRadius: PropTypes.number,
			lineWidth: PropTypes.number,
			highlightColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			highlightIndices: PropTypes.arrayOf(PropTypes.number),
			highlightRadius: PropTypes.number,
			widthPercent: PropTypes.number,
			showDataPoint: PropTypes.bool,
			dataPointColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			dataPointFillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			dataPointRadius: PropTypes.number,
			pieAngle: PropTypes.number,
			pieCenterRatio: PropTypes.number,
			sliceColors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
		}).isRequired,

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

	constructor(props) {
		super(props);
		this.state = { yWidth: 0 };
		this._updateAxisLayout = this._updateAxisLayout.bind(this);
	}

	componentDidMount() {
		this.refs.yAxis.measure((ox, oy, width, height, px, py) => {
			this.setState({ yWidth: width });
		});
	}

	componentDidUpdate() {
		this.refs.yAxis.measure((ox, oy, width, height, px, py) => {
			if (width !== this.state.yWidth) {
				this.setState({ yWidth: width });
			}
		});
	}

	_updateAxisLayout() {
		this.refs.yAxis.measure((_ox, _oy, width, _height) => {
			if (width !== this.state.yWidth) {
				this.setState({ yWidth: width });
			}
		});
		this.refs.xAxis.measure((_ox, _oy, _width, height) => {
			if (height !== this.state.xHeight) {
				this.setState({ xHeight: height });
			}
		});
		this.refs.container.measure((_ox, _oy, _width, height) => {
			if (height !== this.state.containerHeight) {
				this.setState({ containerHeight: height });
			}
		});
	}

	render() {
		const convertedProps = {
			...this.props,
			axisColor: processColor(this.props.axisColor),
			axisTitleColor: processColor(this.props.axisTitleColor),
			chartTitleColor: processColor(this.props.chartTitleColor),
			gridColor: processColor(this.props.gridColor),
			labelTextColor: processColor(this.props.labelTextColor),
			chartData: (this.props.chartData) ? processData(this.props.chartData) : [],
		};

		const components = {
			'line': BarChart,
			'bar': BarChart,
			'pie': BarChart,
		};


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
									<View ref="yAxis"><YAxis data={data.data} /></View>
									<Chart {...convertedProps} data={data} />
								</View>
								{(() => {
									if (!this.state.yWidth) return null;
									return <View ref="xAxis"><XAxis data={data.data} xAxisLabels={this.props.xAxisLabels} style={{ marginLeft: this.state.yWidth - 1 }} /></View>;
								})()}
							</View>
						);
						return (
							<View ref="container" style={[ this.props.style || {}, styles.default ]}>
								<Chart {...convertedProps} data={data} />
							</View>
						);
					}
				})()}
			</View>
		)
	}
}
