'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/Chart.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');
var _BarChart=require('./BarChart');var _BarChart2=_interopRequireDefault(_BarChart);
var _LineChart=require('./LineChart');var _LineChart2=_interopRequireDefault(_LineChart);
var _PieChart=require('./PieChart');var _PieChart2=_interopRequireDefault(_PieChart);
var _yAxis=require('./yAxis');var _yAxis2=_interopRequireDefault(_yAxis);
var _xAxis=require('./xAxis');var _xAxis2=_interopRequireDefault(_xAxis);
var _constants=require('./constants');var C=_interopRequireWildcard(_constants);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var styles=_reactNative.StyleSheet.create({
default:{flex:1}});


var getRoundNumber=function getRoundNumber(value,gridStep){
if(value<=0)return 0;
var logValue=Math.log10(value);
var scale=Math.pow(10,Math.floor(logValue));
var n=Math.ceil(value/scale*4);

var tmp=n%gridStep;
if(tmp!==0)tmp+=gridStep-tmp;
return n*scale/4.0;};var 



Chart=function(_Component){_inherits(Chart,_Component);





























function Chart(props){_classCallCheck(this,Chart);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(Chart).call(this,
props));_this.









































































_onContainerLayout=function(e){return _this.setState({
containerHeight:Math.ceil(e.nativeEvent.layout.height)+1,
containerWidth:Math.ceil(e.nativeEvent.layout.width)});};_this.state={bounds:{min:0,max:0}};return _this;}_createClass(Chart,[{key:'componentDidMount',value:function componentDidMount(){this._computeBounds();}},{key:'shouldComponentUpdate',value:function shouldComponentUpdate(props,state){return props!==this.props||state!==this.state;}},{key:'componentDidUpdate',value:function componentDidUpdate(props){if(this.props!==props){this._computeBounds();}}},{key:'_computeBounds',value:function _computeBounds(){var min=Infinity;var max=-Infinity;var data=this.props.data||[];data.forEach(function(XYPair){var number=XYPair[1];if(number<min)min=number;if(number>max)max=number;});min=Math.round(min);max=Math.round(max); // Exit if we want tight bounds
if(this.props.tightBounds){return this.setState({bounds:{min:min,max:max}});}max=getRoundNumber(max,this.props.verticalGridStep);if(min<0){var step=void 0;if(this.props.verticalGridStep>3){step=Math.abs(max-min)/(this.props.verticalGridStep-1);}else {step=Math.max(Math.abs(max-min)/2,Math.max(Math.abs(min),Math.abs(max)));}step=getRoundNumber(step,this.props.verticalGridStep);var newMin=void 0;var newMax=void 0;if(Math.abs(min)>Math.abs(max)){var m=Math.ceil(Math.abs(min)/step);newMin=step*m*(min>0?1:-1);newMax=step*(this.props.verticalGridStep-m)*(max>0?1:-1);}else {var _m=Math.ceil(Math.abs(max)/step);newMax=step*_m*(max>0?1:-1);newMin=step*(this.props.verticalGridStep-_m)*(min>0?1:-1);}if(min<newMin){newMin-=step;newMax-=step;}if(max>newMax+step){newMin+=step;newMax+=step;}if(max<min){var tmp=max;max=min;min=tmp;}}return this.setState({bounds:{max:max,min:min}});}},{key:'_minVerticalBound',value:function _minVerticalBound()

{
if(this.props.tightBounds)return this.state.bounds.min;
return this.state.bounds.min>0?this.state.bounds.min:0;}},{key:'_maxVerticalBound',value:function _maxVerticalBound()


{
if(this.props.tightBounds)return this.state.bounds.max;
return this.state.bounds.max>0?this.state.bounds.max:0;}},{key:'render',value:function render()


{var _this2=this;
var components={'line':_LineChart2.default,'bar':_BarChart2.default,'pie':_PieChart2.default};
var axisAlign=this.props.type==='line'?'left':'center';
return (
_react2.default.createElement(_reactNative.View,{__source:{fileName:_jsxFileName,lineNumber:152}},
function(){
var ChartType=components[_this2.props.type]||_BarChart2.default;
if(_this2.props.showAxis&&Chart!==_PieChart2.default){
return (
_react2.default.createElement(_reactNative.View,{
ref:'container',
style:[_this2.props.style||{},{flex:1,flexDirection:'column'}],
onLayout:_this2._onContainerLayout,__source:{fileName:_jsxFileName,lineNumber:157}},

_react2.default.createElement(_reactNative.View,{style:[styles.default,{flexDirection:'row'}],__source:{fileName:_jsxFileName,lineNumber:162}},
_react2.default.createElement(_reactNative.View,{ref:'yAxis',__source:{fileName:_jsxFileName,lineNumber:163}},
_react2.default.createElement(_yAxis2.default,_extends({},
_this2.props,{
data:_this2.props.data,
height:_this2.state.containerHeight-_this2.props.xAxisHeight,
width:_this2.props.yAxisWidth,
minVerticalBound:_this2.state.bounds.min,
containerWidth:_this2.state.containerWidth,
maxVerticalBound:_this2.state.bounds.max,
style:{width:_this2.props.yAxisWidth},__source:{fileName:_jsxFileName,lineNumber:164}}))),


_react2.default.createElement(ChartType,_extends({},
_this2.props,{
data:_this2.props.data,
width:_this2.state.containerWidth-_this2.props.yAxisWidth,
height:_this2.state.containerHeight-_this2.props.xAxisHeight,
minVerticalBound:_this2.state.bounds.min,
maxVerticalBound:_this2.state.bounds.max,__source:{fileName:_jsxFileName,lineNumber:175}}))),


function(){
return (
_react2.default.createElement(_reactNative.View,{ref:'xAxis',__source:{fileName:_jsxFileName,lineNumber:186}},
_react2.default.createElement(_xAxis2.default,_extends({},
_this2.props,{
width:_this2.state.containerWidth-_this2.props.yAxisWidth,
data:_this2.props.data,
height:_this2.props.xAxisHeight,
align:axisAlign,
style:{marginLeft:_this2.props.yAxisWidth-1},__source:{fileName:_jsxFileName,lineNumber:187}}))));}()));}







return (
_react2.default.createElement(_reactNative.View,{
ref:'container',
onLayout:_this2._onContainerLayout,
style:[_this2.props.style||{},styles.default],__source:{fileName:_jsxFileName,lineNumber:202}},

_react2.default.createElement(ChartType,_extends({},
_this2.props,{
data:_this2.props.data,
width:_this2.state.containerWidth,
height:_this2.state.containerHeight,
minVerticalBound:_this2.state.bounds.min,
maxVerticalBound:_this2.state.bounds.max,__source:{fileName:_jsxFileName,lineNumber:207}}))));}()));}}]);return Chart;}(_react.Component);Chart.defaultProps={data:[],animated:true,animationDuration:300,axisColor:C.BLACK,axisLabelColor:C.BLACK,axisLineWidth:1,axisTitleColor:C.GREY,axisTitleFontSize:16,chartFontSize:14,dataPointRadius:3,gridColor:C.BLACK,gridLineWidth:0.5,hideHorizontalGridLines:false,hideVerticalGridLines:false,horizontalScale:1,labelFontSize:10,lineWidth:1,showAxis:true,showDataPoint:false,showGrid:true,showXAxisLabels:true,showYAxisLabels:true,tightBounds:false,verticalGridStep:4,xAxisHeight:20,yAxisWidth:30};exports.default=Chart;









Chart.propTypes={
// Shared properties between most types
data:_react.PropTypes.arrayOf(_react.PropTypes.array).isRequired,
type:_react.PropTypes.oneOf(['line','bar','pie']).isRequired,
highlightColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]), // TODO
highlightIndices:_react.PropTypes.arrayOf(_react.PropTypes.number), // TODO
onDataPointPress:_react.PropTypes.func,

// Bar chart props
color:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
cornerRadius:_react.PropTypes.number,
// fillGradient: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // TODO
widthPercent:_react.PropTypes.number,

// Line/multi-line chart props
fillColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
dataPointColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
dataPointFillColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
dataPointRadius:_react.PropTypes.number,
// highlightRadius: PropTypes.number, // TODO
lineWidth:_react.PropTypes.number,
showDataPoint:_react.PropTypes.bool, // TODO

// Pie chart props
// pieCenterRatio: PropTypes.number, // TODO
sliceColors:_react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string])),
animationDuration:_react.PropTypes.number,
axisColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
axisLabelColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
axisLineWidth:_react.PropTypes.number,
// axisTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
// axisTitleFontSize: PropTypes.number,
// chartFontSize: PropTypes.number,
// chartTitle: PropTypes.string,
// chartTitleColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
gridColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),
gridLineWidth:_react.PropTypes.number,
hideHorizontalGridLines:_react.PropTypes.bool,
hideVerticalGridLines:_react.PropTypes.bool,
// labelFontSize: PropTypes.number,
showAxis:_react.PropTypes.bool,
showGrid:_react.PropTypes.bool,
showXAxisLabels:_react.PropTypes.bool,
showYAxisLabels:_react.PropTypes.bool,
style:_react.PropTypes.any,
tightBounds:_react.PropTypes.bool,
verticalGridStep:_react.PropTypes.number,
// xAxisTitle: PropTypes.string,
xAxisHeight:_react.PropTypes.number,
xAxisTransform:_react.PropTypes.func,
// yAxisTitle: PropTypes.string,
yAxisTransform:_react.PropTypes.func,
yAxisWidth:_react.PropTypes.number};