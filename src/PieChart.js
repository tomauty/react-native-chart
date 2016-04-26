/* @flow */
import React, { ART, Component, View, TouchableWithoutFeedback } from 'react-native';
const { Group, Surface, Shape, Path } = ART;
import * as C from './constants';

const circlePath = (cx : number, cy : number, r : number, startDegree : number, endDegree : number) : Path => {
	const p = new Path();
	p.path.push(0, cx, cy);
	p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, endDegree * Math.PI / 180, 1);
	return p;
};
const getColor = (colors : Array<string>, index : number) => colors[index] || colors[colors.length % index];

export default class PieChart extends Component<void, any, any> {
	constructor(props : any) {
		super(props);
		this.state = { rotation: 0 };
		(this:any).boundingAreas = {};
	}

	_handlePress(_e) {
		// const { locationX, locationY } = e.nativeEvent;
	}

	render() {
		if (!this.props.width || !this.props.height) return <View />;

		const COLORS = this.props.data.sliceColors || [
			C.BLUE,
			C.BLACK,
			C.GREY,
			C.RED,
			C.YELLOW,
			C.GREEN,
			C.DARK_PURPLE,
			C.LIGHT_PURPLE,
		];

		// TODO: Read stroke width from props?
		const STROKE_WIDTH = 1;
		const radius = (this.props.height / 2) - STROKE_WIDTH;

		const centerX = this.props.width / 2;
		const centerY = this.props.height / 2;

		// Gather sum of all data to determine angles
		let sum = 0;
		const data = this.props.data.data || [];
		data.forEach(n => {
			sum += (n > 0) ? n : 0.001;
		});
		const sectors = data.map(n => Math.ceil(360 * (n/sum)));
		let startAngle = 0;

		const arcs = [];
		const colors = [];
		sectors.forEach((sectionPiece, i) => {
			arcs.push(circlePath(centerX, centerY, radius, startAngle, sectionPiece + startAngle));
			colors.push(getColor(COLORS, i));
			startAngle += sectionPiece;
		});

		return (
			<TouchableWithoutFeedback onPress={this._handlePress}>
				<View>
					<Surface width={this.props.width} height={this.props.height}>
						<Group originX={centerX} originY={centerY} rotation={this.state.rotation}>
							{arcs.map((arc, i) => {
								return (
									<Shape
										key={i}
										d={arc}
										stroke={colors[i]}
										strokeWidth={STROKE_WIDTH}
										fill={colors[i]}
									/>
								);
							})}
						</Group>
					</Surface>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}
