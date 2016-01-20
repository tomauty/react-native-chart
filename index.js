'use strict';
import React, {
  PropTypes,
  StyleSheet,
  requireNativeComponent,
} from 'react-native';

import merge from 'merge';

/** A native reference to the chart view */
const CHART_REF = 'chart';

/** A base styles object that the user can override by passing in their own styles */
const styles = StyleSheet.create({
  base: {},
});

/** Our bridge component */

export default class RNChart extends React.Component {
  static propTypes = {
      // TODO: define what these objects look like
    chartData: PropTypes.array.isRequired,
    xLabels: PropTypes.array.isRequired,
    animationDuration: PropTypes.number,
    showGrid: PropTypes.bool,
    verticalGridStep: PropTypes.number,
      // TODO: allow strings and use processColor to convert
    gridColor: PropTypes.number,
    gridLineWidth: PropTypes.number,
    showAxis: PropTypes.bool,
    showXAxisLabels: PropTypes.bool,
    showYAxisLabels: PropTypes.bool,
    axisLineWidth: PropTypes.number,
    labelFontSize: PropTypes.number,
      // TODO: allow strings and use processColor to convert
    labelTextColor: PropTypes.number,
    style: PropTypes.any,
  };

  /** Pass the props to the native component */
  setNativeProps(props) {
    this.refs[CHART_REF].setNativeProps(props);
  }

  /** Render the native component with the correct props */
  render() {
    const style = [styles.base, this.props.style];
    const nativeProps = merge(this.props, {
      style,
      chartData: this.props.chartData,
    });

    return <RNChartView ref={CHART_REF} {... nativeProps} />;
  }
}

/** The native chart view */
const RNChartView = requireNativeComponent('RNChartView', RNChart);
