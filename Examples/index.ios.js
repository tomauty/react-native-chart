/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MainMenu = require('./MainMenu');

var styles = React.StyleSheet.create({
	container: {
		flex: 1
	},
});

class SampleChart extends React.Component {
	render() {
		return (
				<React.NavigatorIOS
					style={styles.container}
					initialRoute={{
						title: 'Main Menu',
						component: MainMenu,
					}}
				/>
		);
	}
}

React.AppRegistry.registerComponent('SampleChart', function () { return SampleChart; });
