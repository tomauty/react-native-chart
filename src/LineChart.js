/* @flow */
import React, { Component } from 'react';
import { Animated, View, Platform } from 'react-native';
import Svg, { Circle, Defs, Polyline, LinearGradient, Stop } from 'react-native-svg';
import * as C from './constants';
import Grid from './Grid';

const calculateDivisor = (minBound : number, maxBound : number) : number => {
	return (maxBound - minBound <= 0) ? 0.00001 : maxBound - minBound;
};

const addPoints = (x : number, y : number, array : Array<number>) => {
	array.push(x);
	array.push(y);
};

const heightZero = (Platform.OS === 'ios') ? 0 : 1;

export default class LineChart extends Component<void, any, any> {

	constructor(props : any) {
		super(props);
		const heightValue = (props.animated) ? heightZero : props.height;
		const opacityValue = (props.animated) ? 0 : 1;
		this.state = { height: new Animated.Value(heightValue), opacity: new Animated.Value(opacityValue) };
	}

	componentWillUpdate() {
		if (this.props.animated) {
			Animated.timing(this.state.opacity, { duration: 0, toValue: 0 }).start();
			Animated.timing(this.state.height, { duration: 0, toValue: heightZero }).start();
		}
	}

	componentDidUpdate() {
		if (this.props.animated) {
			Animated.timing(this.state.height, { duration: this.props.animationDuration, toValue: this.props.height }).start();
			Animated.timing(this.state.opacity, { duration: this.props.animationDuration, toValue: 1 }).start();
		}
	}

	_drawLine = () => {
		let containerHeight = this.props.height;
		let containerWidth = this.props.width;

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
		const horizontalStep = containerWidth / (data.length - 1);

		const svgPoints = [];
		const svgFill = [];
		const dataPoints = [];
		const firstDataPoint = data[0][1];
		let height = (minBound * scale) + (containerHeight - (firstDataPoint * scale));
		if (height < 0) height = 0;

		const dataPointSize = this.props.dataPointRadius + this.props.dataPointStrokeWidth;
		let minStart = 0;
		if (this.props.showDataPoint) {
			minStart = this.props.dataPointRadius + 1;
			height = height + (2 * dataPointSize);
		}

		addPoints(0, height, svgPoints);
		addPoints(0, height, svgFill); // Fill should always be 0
		dataPoints.push({ cx: minStart, cy: height, r: this.props.dataPointRadius });

		let x;
		let y;
		let gradientTop = height;
		data.slice(1).forEach(([_, dataPoint], i) => {
			let _height = (minBound * scale) + (containerHeight - (dataPoint * scale));

			if (_height < 0) _height = 0;

			x = horizontalStep * (i) + horizontalStep;
			y = Math.round(_height);

			if (y < gradientTop) {
				gradientTop = y;
			}
			if (this.props.showDataPoint) {
				if (y < dataPointSize) {
					y = dataPointSize;
				}
				if (y === containerHeight) {
					y = containerHeight - dataPointSize;
				}
				if (x === containerWidth) {
					x = containerWidth - dataPointSize;
				}
			}
			addPoints(x, y, svgPoints);
			addPoints(x, y, svgFill);
			dataPoints.push({ cx: x, cy: y, r: this.props.dataPointRadius });
		});
		addPoints(x, containerHeight, svgFill);
		if (this.props.fillColor || this.props.fillGradient) {
			addPoints(0, containerHeight, svgFill);
		}
		if (svgPoints.some(isNaN)) return null;
		return (
			<Svg width={containerWidth} height={containerHeight}>
				<Defs>
					{!!this.props.fillGradient && (
						<LinearGradient id="chartGradient" x1="0" x2="0" y1={gradientTop} y2={containerHeight}>
							{this.props.fillGradient.map((f, i) => (
								<Stop key={i} offset={i.toString()} stopColor={f.color || f} stopOpacity={f.opacity.toString() || '1'} />
							))}
						</LinearGradient>
					)}
				</Defs>
				<Polyline
					points={svgPoints.toString()}
					fill="transparent"
					stroke={this.props.color || C.BLUE}
					strokeWidth={this.props.lineWidth}
				/>
				{this.props.fillColor && (
					<Polyline
						points={svgFill.toString()}
						fill={this.props.fillColor}
						stroke={this.props.color || C.BLUE}
						strokeWidth={this.props.lineWidth}
					/>
				)}
				{this.props.fillGradient && (
					<Polyline points={svgFill.toString()} fill="url(#chartGradient)" />
				)}
				{!!this.props.showDataPoint && dataPoints.map((d, i) => (
					<Circle
						{...d}
						key={i}
						fill={this.props.dataPointFillColor}
						stroke={this.props.dataPointColor}
						strokeWidth={this.props.dataPointStrokeWidth}
					/>
				))}
			</Svg>
		);
	};

	render() : any {
		if (Platform.OS === 'ios') {
			return (
				<View style={{ overflow: 'hidden' }}>
					<Grid {...this.props} />
					<Animated.View style={{
						height: this.state.height,
						opacity: this.state.opacity,
						backgroundColor: 'transparent',
					}}>
						{this._drawLine()}
					</Animated.View>
				</View>
			);
		}
		return (
			<View>
				<Grid {...this.props} />
				<View style={{ height: this.props.height }}>
					{this._drawLine()}
				</View>
			</View>
		);
	}
}
