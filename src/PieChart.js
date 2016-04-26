/* @flow */
import React, { Animated, ART, Component, Platform, View, StyleSheet, Text } from 'react-native';
const { Group, Surface, Shape, Path } = ART;

const circlePath = (cx : number, cy : number, r : number, startDegree : number, endDegree : number) : Path => {
	const p = new Path();
	p.path.push(0, cx, cy);
	p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, endDegree * Math.PI / 180, 1);
	return p;
};

const getColor = (colors : Array<string>, index : number) => {
	if (colors[index]) return colors[index];
	return colors[colors.length % index];
}

export default class PieChart extends Component<void, any, any> {
	constructor(props : any) {
		super(props);
		this.state = {};
	}

	render() {

		const half = this.props.height / 2;

		const centerX = this.props.width / 2;
		const centerY = this.props.height / 2;

		// Gather sum of all data to determine angles
		let sum = 0;
		this.props.data.data.forEach(n => sum += (n > 0) ? n : 0.001);
		const sectors = this.props.data.data.map(n => Math.ceil(360 * (n/sum)));

		let startAngle = 0;
		let endAngle = 0;

		const arcs = [];
		const colors = [];
		sectors.forEach((sectionPiece, i) => {
			arcs.push(circlePath(centerX, centerY, half, startAngle, sectionPiece))
			colors.push(getColor(this.props.data.sliceColors, i));
			startAngle += sectionPiece
		});

		return (
			<View>
				<Surface width={this.props.width} height={this.props.height}>
					{arcs.map((arc,i) => <Shape key={i} d={arc} stroke={colors[i]} strokeWidth={1} fill={colors[i]} />)}
				</Surface>
				{/*{sectors.map(s => <Text>{s}</Text>)}*/}
			</View>
		)
	}
}
