import React, {
  AppRegistry,
	Dimensions,
  Component,
  StyleSheet,
	TouchableOpacity,
  Text,
	ScrollView,
  View
} from 'react-native';

import Chart from './Chart';

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

const chartRange = [1, 2, 3, 4, 5, 6];
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
	return {
		type,
		color: chartColors[type],
		widthPercent: 0.7,
		// data: [5,5,5,5,5],
		data: chartRange.map(_ => Math.floor(Math.random() * 100) + 1),
		sliceColors,
	};
};

class rnchart20 extends Component {
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
      <ScrollView contentContainerStyle={styles.container}>
				<Chart
					showAxis
					style={styles.chart}
					axisColor={colors.grey}
					chartData={this.state.barChart}
					xAxisLabels={this.state.xLabels}
					axisLabelColor={colors.grey}
					showYAxisLabels
					showXAxisLabels
				/>
				<Chart
					showAxis
					style={styles.chart}
					chartData={this.state.lineChart}
					xAxisLabels={this.state.xLabels}
					showYAxisLabels
					showXAxisLabels
					axisColor={colors.grey}
					axisLabelColor={colors.grey}
				/>
				<TouchableOpacity onPress={() => {
						this.setState({ barChart: generateChartData('bar'), lineChart: generateChartData('line')})
					}}>
					<Text style={{ borderWidth: 1, padding: 10 }}>Update Data</Text>
				</TouchableOpacity>
			</ScrollView>
    );
  }
}

AppRegistry.registerComponent('rnchart20', () => rnchart20);
