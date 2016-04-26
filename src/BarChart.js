/* @flow */
import React, { Component, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as C from './constants';

const styles = StyleSheet.create({
	default: {
		flex: 1,
		alignItems: 'flex-end',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default class BarChart extends Component<void, any, any> {
	constructor(props : any) {
		super(props);
		this.state = { };
		(this:any)._drawBar = this._drawBar.bind(this);
		(this:any)._handlePress = this._handlePress.bind(this);
	}

	_handlePress(e : Object, dataPoint : number, index : number) {
		if (this.props.data.onDataPointPress) {
			this.props.data.onDataPointPress(e, dataPoint, index);
		}
	}

	_drawBar(dataPoint : number, index : number) {
		const backgroundColor = this.props.data.color || C.BLUE;
		const HEIGHT = this.props.height;
		const WIDTH = this.props.width;
		let widthPercent = this.props.data.widthPercent || 0.5;
		if (widthPercent > 1) widthPercent = 1;
		if (widthPercent < 0) widthPercent = 0;

		let minBound = this.props.minVerticalBound;
		let maxBound = this.props.maxVerticalBound;

		// For all same values, create a range anyway
		if (minBound === maxBound) {
			minBound -= this.props.verticalGridStep;
			maxBound += this.props.verticalGridStep;
		}

		const data = this.props.data.data || [];
		const width = (WIDTH / data.length * this.props.horizontalScale * 0.5) * widthPercent;
		const divisor = (maxBound - minBound <= 0) ? 0.00001 : (maxBound - minBound);
		const scale = HEIGHT / divisor;
		let height = HEIGHT - ((minBound * scale) + (HEIGHT - (dataPoint * scale)));
		if (height <= 0) height = 20;
		return (
			<TouchableWithoutFeedback
				key={index}
				onPress={(e) => this._handlePress(e, dataPoint, index)}
			>
				<View
					style={{
						borderTopLeftRadius: this.props.data.cornerRadius || 0,
						borderTopRightRadius: this.props.data.cornerRadius || 0,
						backgroundColor,
						width,
						height,
					}}
				/>
			</TouchableWithoutFeedback>
		);
	}

	render() {
		const data = this.props.data.data || [];
		return (
			<View ref="container" style={[styles.default]}>
				{this.props.drawGrid(this.props)}
				{data.map(this._drawBar)}
			</View>
		);
	}
}
