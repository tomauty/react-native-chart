/* @flow */
import React, { Component, View, Text, PropTypes, StyleSheet } from 'react-native';


const getRoundNumber = (value, gridStep) => {
	if (value <= 0) return 0;
	const logValue = Math.log10(value);
	const scale = Math.pow(10, Math.floor(logValue));
	const n = Math.ceil(value / scale * 4);

	let tmp = n % gridStep;
	if (tmp !== 0) tmp += (gridStep - tmp);
	return n * scale / 4.0;
}

const styles = StyleSheet.create({
	yAxisContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
		paddingVertical: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
	},
	axisText: {
		textAlign: 'right',
	},
});

export default class YAxis extends Component<void, any, any> {

	static propTypes = {
		axisColor: PropTypes.any,
		axisLineWidth: PropTypes.number,
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		height: PropTypes.number.isRequired,
		placement: PropTypes.oneOf(['left', 'right']),
		verticalGridStep: PropTypes.number.isRequired,
	}

	static defaultProps : any = {
		placement: 'left',
	};

	constructor(props : any) {
		super(props);
		this.state = { bounds: { min: 0, max: 0 } };
		(this:any)._computeBounds = this._computeBounds.bind(this);
		(this:any)._minVerticalBound = this._minVerticalBound.bind(this);
		(this:any)._maxVerticalBound = this._maxVerticalBound.bind(this);
		(this:any)._createLabelForYAxis = this._createLabelForYAxis.bind(this);
	}

	componentDidMount() { this._computeBounds(); }
	componentDidUpdate(props : any) {
		if (props !== this.props) {
			this._computeBounds();
		}
	}

	_computeBounds() {
		let min = Infinity;
		let max = -Infinity;

		this.props.data.forEach(number => {
			if (number < min) min = number;
			if (number > max) max = number;
		});

		min = Math.round(min);
		max = Math.round(max);

		// Exit if we want tight bounds
		if (this.props.tightBounds) {
			return this.setState({ bounds: { min, max } });
		}

		max = getRoundNumber(max, this.props.verticalGridStep);
		if (min < 0) {
			let step;

			if (this.props.verticalGridStep > 3) {
				step = Math.abs(max - min) / (this.props.verticalGridStep - 1);
			} else {
				step = Math.max(Math.abs(max - min) / 2, Math.max(Math.abs(min), Math.abs(max)));
			}
			step = getRoundNumber(step, this.props.verticalGridStep);
			let newMin, newMax;

			if (Math.abs(min) > Math.abs(max)) {
				const m = Math.ceil(Math.abs(min) / step);
				newMin = step * m * (min > 0 ? 1 : -1);
				newMax = step * (this.props.verticalGridStep - m) * (max > 0 ? 1 : -1);
			} else {
				const m = Math.ceil(Math.abs(max) / step);
				newMax = step * m * (max > 0 ? 1 : -1);
				newMin = step * (this.props.verticalGridStep - m) * (min > 0 ? 1 : -1);
			}
			if (min < newMin) {
				newMin -= step;
				newMax -= step;
			}
			if (max > newMax + step) {
				newMin += step;
				newMax += step;
			}
			if (max < min) {
				const tmp = max;
				max = min;
				min = tmp;
			}
		}
		this.setState({ bounds: { max, min }});
	}

	_minVerticalBound() : number {
		if (this.props.tightBounds) return this.state.bounds.min;
		return (this.state.bounds.min > 0) ? this.state.bounds.min : 0;
	}

	_maxVerticalBound() : number {
		if (this.props.tightBounds) return this.state.bounds.max;
		return (this.state.bounds.max > 0) ? this.state.bounds.max : 0;
	}

	_createLabelForYAxis(index : number) {
		const minBound = this._minVerticalBound();
		const maxBound = this._maxVerticalBound();
		const height = this.props.height;

		let label = minBound + (maxBound - minBound) / this.props.verticalGridStep * (index + 1);
		label = Math.round(label);
		return (
			<Text key={index}>{label}</Text>
		);
	}

	render() {
		const range = [];
		for (let i = this.props.verticalGridStep; i >= 0; i--) range.push(i);
		return (
			<View style={[
				styles.yAxisContainer,
				this.props.style || {},
				this.props.placement === 'left' && { borderRightColor: this.props.axisColor, borderRightWidth: this.props.axisLineWidth },
				this.props.placement === 'right' && { borderLeftColor: this.props.axisColor, borderLeftWidth: this.props.axisLineWidth },
			]}>
				{(() => {
					return range.map(this._createLabelForYAxis);
				})()}
			</View>
		)
	}
}
