/* @flow */
import React, { Animated, ART, Component, View } from 'react-native';
const { Surface, Shape, Path } = ART;
// import Morph from 'art/morph/path';
import * as C from './constants';
import Circle from './Circle';
const AnimatedShape = Animated.createAnimatedComponent(Shape);

const makeDataPoint = (x : number, y : number, data : any) => {
	return { x, y, radius: data.dataPointRadius, fill: data.dataPointFillColor, stroke: data.dataPointColor };
};

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
		const data = this.props.data.data || [];
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const divisor = (maxBound - minBound <= 0) ? 0.00001 : (maxBound - minBound);
		const scale = HEIGHT / divisor;
		const horizontalStep = WIDTH / data.length;

		const PATHS = [];
		const dataPoints = [];

		const firstDataPoint = data[0];
		const height = HEIGHT - ((minBound * scale) + (HEIGHT - (firstDataPoint * scale)));
		const path = new Path().moveTo(0, height);
		dataPoints.push(makeDataPoint(0, height, this.props.data));
		PATHS.push(path);

		data.slice(1).forEach((dataPoint, i) => {
			let _height = HEIGHT - ((minBound * scale) + (HEIGHT - (dataPoint * scale)));
			if (height <= 0) _height = 20;
			const x = horizontalStep * (i + 1) + horizontalStep;
			const y = Math.round(_height);
			PATHS.push(path.lineTo(x, y));
			dataPoints.push(makeDataPoint(x, y, this.props.data));
		});
		if (path.path.some(isNaN)) return null;
		return (
			<View>
				<View style={{ position: 'absolute' }}>
					<Surface width={WIDTH} height={HEIGHT}>
						<AnimatedShape
							d={path}
							fill={this.props.data.fillColor}
							stroke={this.props.data.color || C.BLUE}
							strokeWidth={this.props.lineWidth}
						/>
					</Surface>
				</View>
				{(() => {
					if (!this.props.data.showDataPoint) return null;
					return (
						<Surface width={WIDTH} height={HEIGHT}>
							{dataPoints.map((d, i) => <Circle key={i} {...d} />)}
						</Surface>
					);
				})()}
			</View>
		);
	}

	render() : any {
		return (
			<View>
				{this.props.drawGrid(this.props)}
				<Animated.View style={{ opacity: this.state.opacity, backgroundColor: 'transparent' }}>
					{this._drawLine()}
				</Animated.View>
			</View>
		);
	}
}
