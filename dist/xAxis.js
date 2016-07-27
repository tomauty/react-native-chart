'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/xAxis.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var styles=_reactNative.StyleSheet.create({
xAxisContainer:{
flexDirection:'row',
flex:0,
backgroundColor:'transparent',
justifyContent:'space-between'},

axisText:{
flex:1,
backgroundColor:'transparent'}});var 



XAxis=function(_Component){_inherits(XAxis,_Component);function XAxis(){_classCallCheck(this,XAxis);return _possibleConstructorReturn(this,Object.getPrototypeOf(XAxis).apply(this,arguments));}_createClass(XAxis,[{key:'render',value:function render()

















{var _this2=this;
var data=this.props.data||[];
var transform=function transform(d){return d;};
if(this.props.xAxisTransform&&typeof this.props.xAxisTransform==='function'){
transform=this.props.xAxisTransform;}

return (
_react2.default.createElement(_reactNative.View,{
style:[
styles.xAxisContainer,
{
borderTopColor:this.props.axisColor,
borderTopWidth:this.props.axisLineWidth},

this.props.style],__source:{fileName:_jsxFileName,lineNumber:44}},


function(){
if(!_this2.props.showXAxisLabels)return null;
return data.map(function(d,i){
var item=transform(d[0]);
if(typeof item!=='number'&&!item)return null;
return (
_react2.default.createElement(_reactNative.Text,{
key:i,
style:[
styles.axisText,
{
textAlign:_this2.props.align,
color:_this2.props.axisLabelColor,
fontSize:_this2.props.labelFontSize}],__source:{fileName:_jsxFileName,lineNumber:60}},


item));});}()));}}]);return XAxis;}(_react.Component);XAxis.propTypes={axisColor:_react.PropTypes.any.isRequired,axisLabelColor:_react.PropTypes.any.isRequired,axisLineWidth:_react.PropTypes.number.isRequired,data:_react.PropTypes.arrayOf(_react.PropTypes.array),showXAxisLabels:_react.PropTypes.bool.isRequired,style:_react.PropTypes.any,width:_react.PropTypes.number.isRequired,align:_react.PropTypes.string,labelFontSize:_react.PropTypes.number.isRequired,xAxisTransform:_react.PropTypes.func};XAxis.defaultProps={align:'center'};exports.default=XAxis;