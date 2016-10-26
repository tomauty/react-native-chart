import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { uniqueValuesInDataSets } from './util';

export default class Grid extends Component {
	static propTypes = {
		showGrid: PropTypes.bool,
		data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.array)).isRequired,
		verticalGridStep: PropTypes.number.isRequired,
		horizontalGridStep: PropTypes.number,
		gridLineWidth: PropTypes.number,
		gridColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hideHorizontalGridLines: PropTypes.bool,
		hideVerticalGridLines: PropTypes.bool,
		height: PropTypes.number,
		width: PropTypes.number,
		type: PropTypes.oneOf(['line', 'bar', 'pie']).isRequired,
	};
	static defaultProps = {

	};

	render() {
		if (!this.props.showGrid) return null;
		const horizontalRange = [];
		const verticalRange = [];
		const xData = uniqueValuesInDataSets(this.props.data || [[]], 0);
		const yData = uniqueValuesInDataSets(this.props.data || [[]], 1);
		const horizontalSteps = (yData.length < this.props.verticalGridStep) ? yData.length : this.props.verticalGridStep;
		let stepsBetweenVerticalLines = this.props.horizontalGridStep ? Math.round(xData.length / this.props.horizontalGridStep) : 1;
		if (stepsBetweenVerticalLines < 1) stepsBetweenVerticalLines = 1;

		for (let i = horizontalSteps; i > 0; i--) horizontalRange.push(i);
		for (let i = xData.length - 1; i > 0; i -= stepsBetweenVerticalLines) verticalRange.push(i);

		const containerStyle = { width: this.props.width, height: this.props.height, position: 'absolute', left: 0 };

		let intendedLineWidth = this.props.gridLineWidth;
		if (this.props.gridLineWidth < 1) {
			intendedLineWidth = StyleSheet.hairlineWidth;
		}

		const horizontalGridStyle = {
			height: this.props.height / this.props.verticalGridStep,
			width: this.props.width,
			borderTopColor: this.props.gridColor,
			borderTopWidth: intendedLineWidth,
		};

		const verticalGridStyle = {
			height: this.props.height + 1,
			width: (this.props.width / (xData.length - 1)) * stepsBetweenVerticalLines,
			borderRightColor: this.props.gridColor,
			borderRightWidth: intendedLineWidth,
		};

		return (
			<View style={containerStyle}>
				{(() => {
					if (this.props.hideHorizontalGridLines) return null;
					return (
						<View style={{ position: 'absolute', flexDirection: 'column', justifyContent: 'space-around' }}>
							{horizontalRange.map((_, i) => <View key={i} style={horizontalGridStyle} />)}
						</View>
					);
				})()}
				{(() => {
					if (this.props.hideVerticalGridLines) return null;
					return (
						<View style={{ flexDirection: 'row', position: 'absolute', justifyContent: 'space-around' }}>
							{verticalRange.map((_, i) => <View key={i} style={verticalGridStyle} />)}
						</View>
					);
				})()}
			</View>
		);
	}
}
