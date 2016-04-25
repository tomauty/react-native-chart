/* @flow */
import React, { Component, View, Text, PropTypes, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	yAxisContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
		paddingVertical: 5,
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
		const minBound = this.props.minVerticalBound;
		const maxBound = this.props.maxVerticalBound;
		const height = this.props.height;

		let label = minBound + (maxBound - minBound) / this.props.verticalGridStep * (index + 1);
		label = Math.round(label);
		if (this.props.yAxisTransform && typeof this.props.yAxisTransform === 'function') {
			label = this.props.yAxisTransform(label);
		}
		return (
			<Text key={index}>{label}</Text>
		);
	}

	render() {
		const range = [];
		for (let i = this.props.verticalGridStep; i >= 0; i--) range.push(i);
		return (
			<View style={[
				styles.yAxisContainer,
				this.props.style || {},
				this.props.placement === 'left' && { borderRightColor: this.props.axisColor, borderRightWidth: this.props.axisLineWidth },
				this.props.placement === 'right' && { borderLeftColor: this.props.axisColor, borderLeftWidth: this.props.axisLineWidth },
			]}>
				{(() => {
					return range.map(this._createLabelForYAxis);
				})()}
			</View>
		)
	}
}
