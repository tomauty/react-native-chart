/* @flow */
'use strict';
import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { uniqueValuesInDataSets } from './util';

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
		data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.array)).isRequired,
		showXAxisLabels: PropTypes.bool.isRequired,
		style: PropTypes.any,
		width: PropTypes.number.isRequired,
		align: PropTypes.string,
		labelFontSize: PropTypes.number.isRequired,
		xAxisTransform: PropTypes.func,
		horizontalGridStep: PropTypes.number,
	};
	static defaultProps = {
		align: 'center',
	};

	render() {
		const data = uniqueValuesInDataSets(this.props.data || [[]], 0);
		let transform = (d) => d;
		if (this.props.xAxisTransform && typeof this.props.xAxisTransform === 'function') {
			transform = this.props.xAxisTransform;
		}
		return (
			<View
				style={[
					styles.xAxisContainer,
					{
						borderTopColor: this.props.axisColor,
						borderTopWidth: this.props.axisLineWidth,
					},
					this.props.style,
				]}
			>
			{(() => {
				if (!this.props.showXAxisLabels) return null;
				return data.map((d, i) => {
					let stepsBetweenVerticalLines = this.props.horizontalGridStep ? Math.round((data.length) / this.props.horizontalGridStep + 1) : 1;
					if (stepsBetweenVerticalLines < 1) stepsBetweenVerticalLines = 1;
					if (i % stepsBetweenVerticalLines !== 0) return null;
					const item = transform(d);
					if (typeof item !== 'number' && !item) return null;
					return (
						<Text
							key={i}
							style={[
								styles.axisText,
								{
									textAlign: this.props.align,
									color: this.props.axisLabelColor,
									fontSize: this.props.labelFontSize,
								},
							]}
						>{item}</Text>
				);
				});

			})()}
			</View>
		);
	}
}
