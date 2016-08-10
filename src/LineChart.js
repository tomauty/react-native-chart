/* @flow */
import React, { Component } from 'react';
import { Animated, ART, View, Platform } from 'react-native';
const { Surface, Shape, Path } = ART;
import * as C from './constants';
import Circle from './Circle';
const AnimatedShape = Animated.createAnimatedComponent(Shape);
import Grid from './Grid';

const makeDataPoint = (x : number, y : number, data : any, index : number) => {

	let color = (data.color[index]) ? data.color[index] : C.BLUE;

	let fill = ((data.dataPointFillColor) && (data.dataPointFillColor[index])) ?
		(data.dataPointFillColor[index]) :  color;

	let stroke = ((data.dataPointColor) && (data.dataPointColor[index])) ?
			(data.dataPointColor[index]) :  color;

	return {
		x,
		y,
		radius: data.dataPointRadius,
		fill: fill,
		stroke: stroke  };
};

const calculateDivisor = (minBound : number, maxBound : number) : number => {
	return (maxBound - minBound <= 0) ? 0.00001 : maxBound - minBound;
};

const heightZero = (Platform.OS === 'ios') ? 0 : 1;

export default class LineChart extends Component<void, any, any> {

	constructor(props : any) {
		super(props);
    console.log(props);
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
		const containerHeight = this.props.height;
		const containerWidth = this.props.width;
		const data = this.props.data || [[]];
		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const divisor = calculateDivisor(minBound, maxBound);
		const scale = (containerHeight + 1) / divisor;
		const horizontalStep = containerWidth / data[0].length;

		const dataPoints = [];
		const path = [];
		const fillPath = [];

		for (index = 0; index < data.length; index++) {
			let currentData = data[index] || [];
			const firstDataPoint = currentData[0][1];
			let height = (minBound * scale) + (containerHeight - (firstDataPoint * scale));
			if (height < 0) height = 0;

			path.push(new Path().moveTo(0, height));
			fillPath.push(new Path().moveTo(0, containerHeight).lineTo(0, height));

			const dataPointSet = [];
			dataPointSet.push(makeDataPoint(0, height, this.props, index));

			currentData.slice(1).forEach(([_, dataPoint], i) => {
				let _height = (minBound * scale) + (containerHeight - (dataPoint * scale));

				if (_height < 0) _height = 0;

				const x = horizontalStep * (i) + horizontalStep;
				const y = Math.round(_height);

				path[index].lineTo(x, y);
				fillPath[index].lineTo(x, y);
				dataPointSet.push(makeDataPoint(x, y, this.props, index));
			});

			dataPoints.push(dataPointSet);

			fillPath[index].lineTo(dataPointSet[dataPointSet.length - 1].x, containerHeight);
			if (this.props.fillColor) {
				fillPath[index].moveTo(0, containerHeight);
			}

			if (path[index].path.some(isNaN)) return null;
		}

		var multipleLines = dataPoints.map( (dataPointSet, index) => {
			let color = (this.props.color[index]) ? this.props.color[index] : C.BLUE;
			return (
				<AnimatedShape d={path[index]} stroke={this.props.color[index] || C.BLUE} strokeWidth={this.props.lineWidth} />
			);
		});

		var multipleFills = dataPoints.map( (dataPointSet, index) => {
			return (
				<AnimatedShape d={fillPath[index]} fill={this.props.fillColor} />
			);
		});

		return (
			<View>
				<View style={{ position: 'absolute' }}>
					<Surface width={containerWidth} height={containerHeight}>
						{ multipleLines }
						{ multipleFills }
					</Surface>
				</View>
				<View style={{ position: 'absolute' }}>
					<Surface width={containerWidth} height={containerHeight} />
				</View>
				{(() => {
					if (!this.props.showDataPoint) return null;

					var multipleDataPoints = dataPoints.map( (dataPointSet, index) => {
						let totalDataSet = dataPointSet.map((d, i) => {
							return (<Circle key={i} {...d} />);
						});
 						return totalDataSet;
					});

					return (
						<Surface width={containerWidth} height={containerHeight}>
							{ multipleDataPoints }
						</Surface>
					);
				})()}
			</View>
		);
	};

	render() : any {
		if (Platform.OS === 'ios') {
			return (
				<View style={{ overflow: 'hidden' }}>
					<Grid {...this.props} />
					<Animated.View style={{ height: this.state.height, opacity: this.state.opacity, backgroundColor: 'transparent' }}>
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
