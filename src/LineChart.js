/* @flow */
import React, { Animated, ART, Component, LayoutAnimation, View, StyleSheet, Text } from 'react-native';
const { Surface, Shape, Path } = ART;
import * as C from './constants';

const styles = StyleSheet.create({
	default: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default class LineChart extends Component<void, any, any> {

	constructor(props : any) {
		super(props);
		this.state = {
		};
		(this:any)._drawLine = this._drawLine.bind(this);
	}

	_drawLine() {
		const HEIGHT = this.props.height;
		const WIDTH = this.props.width;
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const divisor = (maxBound - minBound <= 0) ? 0.00001 : (maxBound - minBound);
		const scale = HEIGHT / divisor;
		const horizontalStep = WIDTH / this.props.data.data.length;

		const firstDataPoint = this.props.data.data[0];
		let height = HEIGHT - ((minBound * scale) + (HEIGHT - (firstDataPoint * scale)));
		if (height <= 0) height = 20;
		const path = new Path();

		this.props.data.data.slice(1).map((dataPoint, i) => {
			let height = HEIGHT - ((minBound * scale) + (HEIGHT - (dataPoint * scale)));
			if (height <= 0) height = 20;
			path.lineTo(horizontalStep * i, Math.round(height));
		});
		if (path.path.some(isNaN)) return null;
		return (
			<Surface width={WIDTH} height={HEIGHT}>
				<Shape d={path} stroke="black" strokeWidth={this.props.lineWidth} />
			</Surface>
		);
	}

	render() {
		const data = this.props.data;
		return (
			<View ref="container" style={[ styles.default ]}>
				{this._drawLine()}
			</View>
		)
	}
}
