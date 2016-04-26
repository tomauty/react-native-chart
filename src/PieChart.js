/* @flow */
import React, {
	Animated,
	ART,
	Component,
	Platform,
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
const { Group, Surface, Shape, Path, Transform } = ART;

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
	}

	componentDidUpdate() {
	}

	_handlePress(e) {
		const { locationX, locationY } = e.nativeEvent;
	}

	render() {
		if (!this.props.width || !this.props.height) return <View />;

		const half = this.props.height / 2;

		// TODO: Read stroke width from props?
		const STROKE_WIDTH = 1;
		const radius = (this.props.height / 2) - STROKE_WIDTH;

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
			arcs.push(circlePath(centerX, centerY, radius, startAngle, sectionPiece + startAngle));
			colors.push(getColor(this.props.data.sliceColors, i));
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
