Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/BarChart.js';var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[typeof Symbol==='function'?Symbol.iterator:'@@iterator'](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally {try{if(!_n&&_i["return"])_i["return"]();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if((typeof Symbol==='function'?Symbol.iterator:'@@iterator') in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();
var _reactNative=require('react-native');
var _react=require('react');var _react2=_interopRequireDefault(_react);
var _constants=require('./constants');var C=_interopRequireWildcard(_constants);
var _Grid=require('./Grid');var _Grid2=_interopRequireDefault(_Grid);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var styles=_reactNative.StyleSheet.create({
default:{
flex:1,
alignItems:'flex-end',
flexDirection:'row',
justifyContent:'space-around'}});var 



BarChart=function(_Component){_inherits(BarChart,_Component);
function BarChart(props){_classCallCheck(this,BarChart);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(BarChart).call(this,
props));_this.



_handlePress=function(e,dataPoint,index){
if(_this.props.data.onDataPointPress){
_this.props.data.onDataPointPress(e,dataPoint,index);}};_this.



_drawBar=function(_dataPoint,index){var _dataPoint2=_slicedToArray(
_dataPoint,2);var _x=_dataPoint2[0];var dataPoint=_dataPoint2[1];
var backgroundColor=_this.props.color||C.BLUE;
var HEIGHT=_this.props.height;
var WIDTH=_this.props.width;
var widthPercent=_this.props.widthPercent||0.5;
if(widthPercent>1)widthPercent=1;
if(widthPercent<0)widthPercent=0;

var minBound=_this.props.minVerticalBound;
var maxBound=_this.props.maxVerticalBound;

// For all same values, create a range anyway
if(minBound===maxBound){
minBound-=_this.props.verticalGridStep;
maxBound+=_this.props.verticalGridStep;}


var data=_this.props.data||[];
var width=WIDTH/data.length*_this.props.horizontalScale*0.5*widthPercent;
var divisor=maxBound-minBound<=0?0.00001:maxBound-minBound;
var scale=HEIGHT/divisor;
var height=HEIGHT-(minBound*scale+(HEIGHT-dataPoint*scale));
if(height<=0)height=20;
return (
_react2.default.createElement(_reactNative.TouchableWithoutFeedback,{
key:index,
onPress:function onPress(e){return _this._handlePress(e,dataPoint,index);},__source:{fileName:_jsxFileName,lineNumber:53}},

_react2.default.createElement(_reactNative.View,{
style:{
borderTopLeftRadius:_this.props.cornerRadius||0,
borderTopRightRadius:_this.props.cornerRadius||0,
backgroundColor:backgroundColor,
width:width,
height:height},__source:{fileName:_jsxFileName,lineNumber:57}})));};_this.state={};return _this;}_createClass(BarChart,[{key:'render',value:function render()






{
var data=this.props.data||[];
return (
_react2.default.createElement(_reactNative.View,{ref:'container',style:[styles.default],__source:{fileName:_jsxFileName,lineNumber:73}},
_react2.default.createElement(_Grid2.default,_extends({},this.props,{__source:{fileName:_jsxFileName,lineNumber:74}})),
data.map(this._drawBar)));}}]);return BarChart;}(_react.Component);exports.default=BarChart;