/* @flow */
import React, { Animated, ART, Component, LayoutAnimation, View, StyleSheet, Text } from 'react-native';
const { Surface, Shape, Path } = ART;
import Morph from 'art/morph/path';
import * as C from './constants';

const AnimatedShape = Animated.createAnimatedComponent(Shape);

export default class LineChart extends Component<void, any, any> {

	constructor(props : any) {
		super(props);
		this.state = { opacity: new Animated.Value(0) };
		(this:any)._drawLine = this._drawLine.bind(this);
	}

	componentWillUpdate() {
		Animated.timing(this.state.opacity, { duration: 0, toValue: 0 }).start();
	}

	componentDidUpdate() {
		Animated.timing(this.state.opacity, { duration: 500, toValue: 1 }).start();
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

		const PATHS = [];

		const firstDataPoint = this.props.data.data[0];
		let height = HEIGHT - ((minBound * scale) + (HEIGHT - (firstDataPoint * scale)));
		const path = new Path().moveTo(0, height);
		PATHS.push(path);

		this.props.data.data.slice(1).map((dataPoint, i) => {
			let height = HEIGHT - ((minBound * scale) + (HEIGHT - (dataPoint * scale)));
			if (height <= 0) height = 20;
			PATHS.push(path.lineTo(horizontalStep * (i + 1) + horizontalStep, Math.round(height)));
		});

		if (path.path.some(isNaN)) return null;

		return (
			<Surface width={WIDTH} height={HEIGHT}>
				<AnimatedShape
					d={path}
					stroke={this.props.data.color || C.BLUE}
					strokeWidth={this.props.lineWidth}
				/>
			</Surface>
		);
	}

	render() {
		const data = this.props.data;
		return (
			<Animated.View ref="container" style={{ opacity: this.state.opacity }}>
				{this._drawLine()}
			</Animated.View>
		)
	}
}
