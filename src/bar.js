import React, { Animated, Component, View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
	default: {
		flex: 1,
	},
});

export default class BarChart extends Component {

	constructor(props) {
		super(props);
		this.state = { height: 0, width: 0 };
	}

	static defaultProps = {
	};

	render() {
		console.log(this.props);

		const HEIGHT = this.state.height;
		const WIDTH = this.state.width;

		return (
			<View ref="container" style={[ styles.default ]}>
			</View>
		)
	}
}
