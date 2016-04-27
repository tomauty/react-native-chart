/* @flow */
'use strict';
import React, { Component, View, Text, PropTypes, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	xAxisContainer: {
		flexDirection: 'row',
		flex: 0,
		justifyContent: 'space-around',
	},
	axisText: {
		flex: 1,
		textAlign: 'center',
	},
});

export default class XAxis extends Component {

	static propTypes = {
		axisColor: PropTypes.any.isRequired,
		axisLabelColor: PropTypes.any.isRequired,
		axisLineWidth: PropTypes.number.isRequired,
		data: PropTypes.arrayOf(PropTypes.number),
		showXAxisLabels: PropTypes.bool.isRequired,
		style: PropTypes.any,
		width: PropTypes.number.isRequired,
		xAxisLabels: PropTypes.arrayOf(PropTypes.any),
	};

	render() {
		const labels = this.props.xAxisLabels || [];
		return (
			<View
				style={[
					styles.xAxisContainer,
					this.props.style || {},
					{
						borderTopColor: this.props.axisColor,
						borderTopWidth: this.props.axisLineWidth,
					},
				]}
			>
			{(() => {
				if (!this.props.showXAxisLabels) return null;
				return labels.map((d, i) => <Text key={i} style={[styles.axisText, { color: this.props.axisLabelColor }]}>{d}</Text>);
			})()}
			</View>
		);
	}
}
