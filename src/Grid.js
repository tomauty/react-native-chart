import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { uniqueValuesInDataSet } from './util';

export default class Grid extends Component {
	static propTypes = {
		showGrid: PropTypes.bool,
		data: PropTypes.array.isRequired,
		verticalGridStep: PropTypes.number.isRequired,
		gridLineWidth: PropTypes.number,
		gridColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hideHorizontalGridLines: PropTypes.bool,
		hideVerticalGridLines: PropTypes.bool,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		type: PropTypes.oneOf(['line', 'bar', 'pie']).isRequired,
	};
	static defaultProps = {

	};

	render() {
		if (!this.props.showGrid) return null;
		const horizontalRange = [];
		const verticalRange = [];
		const data = this.props.data || [];
		const unique = uniqueValuesInDataSet(data);
		const horizontalSteps = (unique.length < this.props.verticalGridStep) ? unique.length : this.props.verticalGridStep;

		for (let i = horizontalSteps; i > 0; i--) horizontalRange.push(i);
		for (let i = data.length - 1; i > 0; i--) verticalRange.push(i);

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
			width: this.props.width / data.length,
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
