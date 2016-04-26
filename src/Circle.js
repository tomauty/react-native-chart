import React, { ART, Component, PropTypes } from 'react-native';
const { Path, Shape } = ART;

export default class Circle extends Component {
	static propTypes = {
		radius: PropTypes.number.isRequired,
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		onPress: PropTypes.func,
	};
	static defaultProps = {
		onPress: () => {},
		radius: 2,
	};
	render() {
		const { x, y, radius } = this.props;
		const path = new Path().moveTo(x, y - radius).arc(0, radius * 2, radius).arc(0, radius * -2, radius).close();
		return (
			<Shape d={path} stroke="black" strokeWidth={1} />
		);
	}
}
