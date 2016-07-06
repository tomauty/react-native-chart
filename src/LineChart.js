/* @flow */
import React, { Component } from 'react';
import { Animated, ART, View } from 'react-native';
const { Surface, Shape, Path } = ART;
// import Morph from 'art/morph/path';
import * as C from './constants';
import Circle from './Circle';
const AnimatedShape = Animated.createAnimatedComponent(Shape);
import Grid from './Grid';

const makeDataPoint = (x : number, y : number, data : any) => {
	return { x, y, radius: data.dataPointRadius, fill: data.dataPointFillColor, stroke: data.dataPointColor };
};

const calculateDivisor = (minBound : number, maxBound : number) : number => {
	return (maxBound - minBound <= 0) ? 0.00001 : maxBound - minBound;
};

export default class LineChart extends Component<void, any, any> {

	constructor(props : any) {
		super(props);
		this.state = { opacity: new Animated.Value(0) };
	}

	componentWillUpdate() {
		Animated.timing(this.state.opacity, { duration: 0, toValue: 0 }).start();
	}

	componentDidUpdate() {
		Animated.timing(this.state.opacity, { duration: 500, toValue: 1 }).start();
	}

	_drawLine = () => {
		const containerHeight = this.props.height;
		const containerWidth = this.props.width;
		const data = this.props.data || [];
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const divisor = calculateDivisor(minBound, maxBound);
		const scale = (containerHeight + 1) / divisor;
		const horizontalStep = containerWidth / data.length;
		const dataPoints = [];
		const firstDataPoint = data[0][1];
		let height = (minBound * scale) + (containerHeight - (firstDataPoint * scale));
		if (height < 0) height = 0;

		const path = new Path().moveTo(0, height);
		const fillPath = new Path().moveTo(0, containerHeight).lineTo(0, height);

		dataPoints.push(makeDataPoint(0, height, this.props));

		data.slice(1).forEach(([_, dataPoint], i) => {
			let _height = (minBound * scale) + (containerHeight - (dataPoint * scale));

			if (_height < 0) _height = 0;

			const x = horizontalStep * (i) + horizontalStep;
			const y = Math.round(_height);

			path.lineTo(x, y);
			fillPath.lineTo(x, y);
			dataPoints.push(makeDataPoint(x, y, this.props));
		});
		fillPath.lineTo(dataPoints[dataPoints.length - 1].x, containerHeight);
		if (this.props.fillColor) {
			fillPath.moveTo(0, containerHeight);
		}
		if (path.path.some(isNaN)) return null;
		return (
			<View>
				<View style={{ position: 'absolute' }}>
					<Surface width={containerWidth} height={containerHeight}>
						<AnimatedShape d={path} stroke={this.props.color || C.BLUE} strokeWidth={this.props.lineWidth} />
						<AnimatedShape d={fillPath} fill={this.props.fillColor} />
					</Surface>
				</View>
				<View style={{ position: 'absolute' }}>
					<Surface width={containerWidth} height={containerHeight} />
				</View>
				{(() => {
					if (!this.props.showDataPoint) return null;
					return (
						<Surface width={containerWidth} height={containerHeight}>
							{dataPoints.map((d, i) => <Circle key={i} {...d} />)}
						</Surface>
					);
				})()}
			</View>
		);
	};

	render() : any {
		return (
			<View>
				<Grid {...this.props} />
				<Animated.View style={{ opacity: this.state.opacity, backgroundColor: 'transparent' }}>
					{this._drawLine()}
				</Animated.View>
			</View>
		);
	}
}
