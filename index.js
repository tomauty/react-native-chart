'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var processColor = _reactNative2.default.processColor;

/** A native reference to the chart view */

var CHART_REF = 'chart';

var processData = function processData(chartData) {
	return chartData.map(function (d) {
		return _extends({}, d, {
			color: processColor(d.color),
			fillColor: processColor(d.fillColor),
			dataPointColor: processColor(d.dataPointColor),
			dataPointFillColor: processColor(d.dataPointFillColor),
			highlightColor: processColor(d.highlightColor),
			fillGradient: Array.isArray(d.fillGradient) ? [processColor(d.fillGradient[0]), processColor(d.fillGradient[1])] : undefined,
			sliceColors: Array.isArray(d.sliceColors) ? d.sliceColors.map(function (c) {
				return c ? processColor(c) : processColor('blue');
			}) : undefined
		});
	});
};

/** Our bridge component */

var RNChart = function (_React$Component) {
	_inherits(RNChart, _React$Component);

	function RNChart() {
		_classCallCheck(this, RNChart);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RNChart).apply(this, arguments));
	}

	_createClass(RNChart, [{
		key: 'render',


		/** Render the native component with the correct props */
		value: function render() {
			var convertedProps = _extends({}, this.props, {
				axisColor: processColor(this.props.axisColor),
				axisTitleColor: processColor(this.props.axisTitleColor),
				chartTitleColor: processColor(this.props.chartTitleColor),
				gridColor: processColor(this.props.gridColor),
				labelTextColor: processColor(this.props.labelTextColor),
				chartData: this.props.chartData ? processData(this.props.chartData) : undefined
			});
			return _reactNative2.default.createElement(RNChartView, _extends({ ref: CHART_REF }, convertedProps));
		}
	}]);

	return RNChart;
}(_reactNative2.default.Component);

/** The native chart view */


RNChart.propTypes = {

	chartData: _reactNative.PropTypes.arrayOf(_reactNative.PropTypes.shape({
		data: _reactNative.PropTypes.arrayOf(_reactNative.PropTypes.number).isRequired,
		name: _reactNative.PropTypes.string,
		type: _reactNative.PropTypes.oneOf(['line', 'bar', 'pie']),
		fillColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
		fillGradient: _reactNative.PropTypes.arrayOf(_reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string])),
		cornerRadius: _reactNative.PropTypes.number,
		lineWidth: _reactNative.PropTypes.number,
		highlightColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
		highlightIndices: _reactNative.PropTypes.arrayOf(_reactNative.PropTypes.number),
		highlightRadius: _reactNative.PropTypes.number,
		widthPercent: _reactNative.PropTypes.number,
		showDataPoint: _reactNative.PropTypes.bool,
		dataPointColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
		dataPointFillColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
		dataPointRadius: _reactNative.PropTypes.number,
		pieAngle: _reactNative.PropTypes.number,
		pieCenterRatio: _reactNative.PropTypes.number,
		sliceColors: _reactNative.PropTypes.arrayOf(_reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]))
	})).isRequired,

	animationDuration: _reactNative.PropTypes.number,
	axisColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
	axisLineWidth: _reactNative.PropTypes.number,
	axisTitleColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
	axisTitleFontSize: _reactNative.PropTypes.number,
	chartFontSize: _reactNative.PropTypes.number,
	chartTitle: _reactNative.PropTypes.string,
	chartTitleColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
	gridColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
	gridLineWidth: _reactNative.PropTypes.number,
	hideHorizontalGridLines: _reactNative.PropTypes.bool,
	hideVerticalGridLines: _reactNative.PropTypes.bool,
	labelFontSize: _reactNative.PropTypes.number,
	labelFontName: _reactNative.PropTypes.number,
	labelTextColor: _reactNative.PropTypes.oneOfType([_reactNative.PropTypes.number, _reactNative.PropTypes.string]),
	showAxis: _reactNative.PropTypes.bool,
	showGrid: _reactNative.PropTypes.bool,
	showXAxisLabels: _reactNative.PropTypes.bool,
	showYAxisLabels: _reactNative.PropTypes.bool,
	style: _reactNative.PropTypes.any,
	tightBounds: _reactNative.PropTypes.bool,
	verticalGridStep: _reactNative.PropTypes.number,
	xAxisTitle: _reactNative.PropTypes.string,
	xLabels: _reactNative.PropTypes.array.isRequired,
	yAxisTitle: _reactNative.PropTypes.string
};
exports.default = RNChart;
var RNChartView = (0, _reactNative.requireNativeComponent)('RNChartView', RNChart);
