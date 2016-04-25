/* @flow */
import React, { Component, View, Text, PropTypes, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	yAxisContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
		paddingRight: 5,
		alignItems: 'flex-end',
	},
	axisText: {
		textAlign: 'right',
	},
});

export default class YAxis extends Component<void, any, any> {

	static propTypes = {
		axisColor: PropTypes.any,
		axisLineWidth: PropTypes.number,
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		height: PropTypes.number.isRequired,
		placement: PropTypes.oneOf(['left', 'right']),
		verticalGridStep: PropTypes.number.isRequired,
		yAxisTransform: PropTypes.func,
	}

	static defaultProps : any = {
		placement: 'left',
	};

	constructor(props : any) {
		super(props);
		this.state = { bounds: { min: 0, max: 0 } };
		(this:any)._createLabelForYAxis = this._createLabelForYAxis.bind(this);
	}

	_createLabelForYAxis(index : number) {
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;
		const height = this.props.height;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}
		let label = minBound + (maxBound - minBound) / this.props.verticalGridStep * index;
		label = Math.round(label);
		if (this.props.yAxisTransform && typeof this.props.yAxisTransform === 'function') {
			label = this.props.yAxisTransform(label);
		}
		if (this.props.hideHorizontalGridLines || !this.props.showGrid) {
			return <Text style={{ color: this.props.axisLabelColor }} key={index}>{label}</Text>;
		}
		return (
			<View key={index}>
				<Text style={{ color: this.props.axisLabelColor }}>{label}</Text>
				<View style={{
					position: 'absolute',
					left: this.props.width,
					width: this.props.containerWidth - this.props.width,
					height: this.props.gridLineWidth,
					backgroundColor: this.props.gridColor,
				}} />
			</View>
		);
	}

	render() {
		const range = [];
		const uniqueValuesInDataSet = this.props.data.filter((v, i, self) => self.indexOf(v) === i);
		const steps = (uniqueValuesInDataSet.length < this.props.verticalGridStep) ? uniqueValuesInDataSet.length : this.props.verticalGridStep;
		for (let i = steps; i >= 0; i--) range.push(i);
		return (
			<View style={[
				styles.yAxisContainer,
				this.props.style || {},
				this.props.placement === 'left' && { borderRightColor: this.props.axisColor, borderRightWidth: this.props.axisLineWidth },
				this.props.placement === 'right' && { borderLeftColor: this.props.axisColor, borderLeftWidth: this.props.axisLineWidth },
			]}>
				{range.map(this._createLabelForYAxis)}
			</View>
		)
	}
}
