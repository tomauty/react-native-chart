/* @flow */
import React, {
	Animated,
	Component,
	LayoutAnimation,
	View,
	StyleSheet,
	Text,
} from 'react-native';
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
		this.state = {
		};
		(this:any)._drawBar = this._drawBar.bind(this);
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

		const width = (WIDTH / this.props.data.data.length * this.props.horizontalScale * 0.5) * widthPercent;
		const divisor = (maxBound - minBound <= 0) ? 0.00001 : (maxBound - minBound);
		const scale = HEIGHT / divisor;
		let height = HEIGHT - ((minBound * scale) + (HEIGHT - (dataPoint * scale)));
		if (height <= 0) height = 20;
		return (
			<View
				key={index}
				style={{
					borderTopLeftRadius: this.props.data.cornerRadius || 0,
					borderTopRightRadius: this.props.data.cornerRadius || 0,
					backgroundColor,
					width,
					height
				}}
			></View>
		);
	}

	render() {
		const data = this.props.data;
		return (
			<View ref="container" style={[styles.default]}>
				{this.props.drawGrid(this.props)}
				{data.data.map(this._drawBar)}
			</View>
		);
	}
}
