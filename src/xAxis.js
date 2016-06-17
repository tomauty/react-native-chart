/* @flow */
'use strict';
import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	xAxisContainer: {
		flexDirection: 'row',
		flex: 0,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
	},
	axisText: {
		flex: 1,
		backgroundColor: 'transparent',
	},
});

export default class XAxis extends Component {

	static propTypes = {
		axisColor: PropTypes.any.isRequired,
		axisLabelColor: PropTypes.any.isRequired,
		axisLineWidth: PropTypes.number.isRequired,
		data: PropTypes.arrayOf(PropTypes.array),
		showXAxisLabels: PropTypes.bool.isRequired,
		style: PropTypes.any,
		width: PropTypes.number.isRequired,
		align: PropTypes.string,
	};
	static defaultProps = {
		align: 'center',
	};

	render() {
		const data = this.props.data || [];
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
				return data.map((d, i) => {
					return (
						<Text
							key={i}
							style={[
								styles.axisText,
								{
									textAlign: this.props.align,
									color: this.props.axisLabelColor,
								},
							]}
						>{d[0]}</Text>
				);
				});
			})()}
			</View>
		);
	}
}
