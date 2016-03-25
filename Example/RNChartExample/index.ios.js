/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
	AppRegistry,
	Component,
	Dimensions,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import Chart from 'react-native-chart';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
	},
	chart: {
		marginVertical: 20,
		width: width - 40,
		height: 200,
		alignSelf: 'center',
	},
});

const colors = {
	primary: '#374e5c',
	primaryDark: '#24333c',
	primaryLight: '#4a697c',
	secondary: '#df8165',
	tertiary: '#4dc4e6',
	grey: '#999999',
	white: '#f5f5f5',
	yellow: 'rgba(255, 205, 0, 0.9)',
	positive: '#90c456',
	positiveLight: '#20c406',
	positiveDark: '#77ab3c',
	gradientBottom: '#63759B',
	gradientTop: '#374e5c',
	navbar: '#425563',
	sidebar: '#313f49',
	lightGrey: '#cccccc',
	headingBackground: 'rgba(255,255,255,0.15)',
	headingBackgroundLight: 'rgba(255,255,255,0.35)',
	opaqueHeading: 'rgba(180, 180, 180, 1)',
};

const chartRange = [1];
const chartColors = {
	bar: colors.primary,
	line: colors.tertiary,
	pie: colors.primary,
};
const sliceColors = [
	colors.tertiary,
	colors.positive,
	colors.yellow,
	colors.secondary,
	colors.gradientBottom,
	colors.primaryLight,
	colors.yellow,
	colors.secondary,
	colors.gradientBottom,
	colors.primaryLight,
];


const generateXLabels = () => {
	return chartRange.map(_ => (Math.floor(Math.random() * 100) + 1).toString());
};

const generateChartData = (type) => {
	const charts = [
		{
			type,
			color: chartColors[type],
			widthPercent: 0.5,
			data: chartRange.map(_ => Math.floor(Math.random() * 100) + 1),
			sliceColors,
		},
	];
	return charts;
};

class RNChartExample extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lineChart: generateChartData('line'),
			barChart: generateChartData('bar'),
			pieChart: generateChartData('pie'),
			xLabels: generateXLabels(),
		};
	}
	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={{ width, marginTop: 50, flex: 1 }}>
					<Chart style={styles.chart} chartData={this.state.lineChart} xLabels={this.state.xLabels} />
					<Chart style={styles.chart} chartData={this.state.barChart} xLabels={this.state.xLabels} />
					<Chart style={styles.chart} chartData={this.state.pieChart} xLabels={this.state.xLabels} />
				</ScrollView>
			</View>
		);
	}
}

AppRegistry.registerComponent('RNChartExample', () => RNChartExample);
