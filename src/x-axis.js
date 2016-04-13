import React, { Component, View, Text, PropTypes, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	xAxisContainer: {
		flexDirection: 'row',
		flex: 0,
		justifyContent: 'space-between',
		paddingHorizontal: 5,
	},
});

export default class XAxis extends Component {

	static propTypes = {
		axisColor: PropTypes.any,
		xAxisLabels: PropTypes.arrayOf(PropTypes.any),
		data: PropTypes.arrayOf(PropTypes.number),
		width: PropTypes.number.isRequired,
		axisLineWidth: PropTypes.number,
	}

	static defaultProps = {
		axisColor: '#999',
		axisLineWidth: 1,
	};

	constructor(props) {
		super(props);
	}

	render() {
		const labels = this.props.xAxisLabels || this.props.data || [];
		return (
			<View style={[
					styles.xAxisContainer,
					this.props.style || {},
					{
						borderTopColor: this.props.axisColor,
						borderTopWidth: this.props.axisLineWidth
					},
			]}>
			{(() => {
				return labels.map((d, i) => <Text key={i} style={styles.axisText}>{d}</Text>);
			})()}
			</View>
		)
	}
}
