'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Image, 
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component
} = React;
var SimpleChart = require('./SimpleChart');

var styles = StyleSheet.create({
    thumb: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    }
});

class MainMenu extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows(['Simple Chart'])
        };
    }

    rowPressed(rowID) {
        this.props.navigator.push({
            title: "Simple Chart",
            component: SimpleChart,
            passProps: {}
        });
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight onPress={() => this.rowPressed(rowID)} underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <View  style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={1}>{rowData}</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
}

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }
}


module.exports = MainMenu;