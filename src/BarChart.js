/* @flow */
import React, { Animated, Component, LayoutAnimation, View, StyleSheet, Text } from 'react-native';

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
			containerHeight: new Animated.Value(0),
		};
		(this:any)._drawBar = this._drawBar.bind(this);
	}

	_drawBar(dataPoint : number, index : number) {
		// LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
		return (
			<View
				key={index}
				style={{ backgroundColor: this.props.data.color, width: 20, height: 40 }}
			/>
		)
	}

	render() {
		const data = this.props.data;
		const HEIGHT = this.props.height;
		const WIDTH = this.props.width;
		const widthPercent = data.widthPercent || 0.5;
		return (
			<View ref="container" style={[ styles.default ]}>
				{data.data.map(this._drawBar)}
			</View>
		)
	}
}
