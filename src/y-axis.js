import React, { Component, View, Text, PropTypes, StyleSheet } from 'react-native';

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

export default class YAxis extends Component {

	static propTypes = {
		placement: PropTypes.oneOf(['left', 'right']),
		axisColor: PropTypes.any,
		data: PropTypes.arrayOf(PropTypes.number).isRequired,
		height: PropTypes.number.isRequired,
		axisLineWidth: PropTypes.number,
	}

	static defaultProps = {
		placement: 'left',
		axisLineWidth: 1,
		axisColor: '#999',
	};

	render() {
		return (
			<View style={[
					styles.yAxisContainer,
					this.props.style || {},
					this.props.placement === 'left' && { borderRightColor: this.props.axisColor, borderRightWidth: this.props.axisLineWidth },
					this.props.placement === 'right' && { borderLeftColor: this.props.axisColor, borderLeftWidth: this.props.axisLineWidth },
			]}>
			{(() => {
				return this.props.data.map((d, i) => <Text key={i} style={styles.axisText}>{d}</Text>);
			})()}
			</View>
		)
	}
}
