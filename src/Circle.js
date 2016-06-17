/* @flow */
import React, { Component, PropTypes } from 'react';
import { ART } from 'react-native';
const { Path, Shape } = ART;
import * as C from './constants';

export default class Circle extends Component {
	static propTypes = {
		radius: PropTypes.number.isRequired,
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		onPress: PropTypes.func,
		fill: PropTypes.string,
		stroke: PropTypes.string,
	};
	static defaultProps = {
		onPress: () => {},
		radius: 2,
		fill: C.BLACK,
		stroke: C.BLACK,
	};
	render() {
		const { x, y, radius } = this.props;
		const path = new Path().moveTo(x, y - radius).arc(0, radius * 2, radius).arc(0, radius * -2, radius).close();
		return (
			<Shape d={path} stroke={this.props.stroke} fill={this.props.fill} strokeWidth={1} />
		);
	}
}
