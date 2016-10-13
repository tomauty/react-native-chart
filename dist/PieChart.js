Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/PieChart.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();
var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');

var _constants=require('./constants');var C=_interopRequireWildcard(_constants);
var _Wedge=require('./Wedge');var _Wedge2=_interopRequireDefault(_Wedge);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Group=_reactNative.ART.Group;var Surface=_reactNative.ART.Surface;

var getColor=function getColor(colors,index){return colors[index]||colors[colors.length%index];};var 

PieChart=function(_Component){_inherits(PieChart,_Component);
function PieChart(props){_classCallCheck(this,PieChart);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(PieChart).call(this,
props));_this.












_handlePress=function(_e){
// const { locationX, locationY } = e.nativeEvent;
};_this.state={rotation:0};_this.boundingAreas={};return _this;}_createClass(PieChart,[{key:'shouldComponentUpdate',value:function shouldComponentUpdate(props){return props.data!==this.props.data||props.height!==this.props.height||props.width!==this.props.width;} // TODO: Handle press on chart by emitting event
},{key:'render',value:function render()
{
if(!this.props.width||!this.props.height)return _react2.default.createElement(_reactNative.View,{__source:{fileName:_jsxFileName,lineNumber:30}});

var COLORS=this.props.sliceColors||[
C.BLUE,
C.GREY,
C.RED,
C.YELLOW,
C.GREEN,
C.DARK_PURPLE,
C.LIGHT_PURPLE];


// TODO: Read stroke width from props?
var STROKE_WIDTH=1;
var radius=this.props.height/2-STROKE_WIDTH;

var centerX=this.props.width/2;
var centerY=this.props.height/2;

// Gather sum of all data to determine angles
var sum=0;
var data=this.props.data||[];
data.forEach(function(n){sum+=n[1]>0?n[1]:0.001;});
var sectors=data.map(function(n){return Math.floor(360*(n[1]/sum));});
var startAngle=0;

var arcs=[];
var colors=[];
sectors.forEach(function(sectionPiece,i){
var endAngle=startAngle+sectionPiece;
if(endAngle>360){
endAngle=360;}

if(endAngle-startAngle===0){
startAngle+=sectionPiece;
return;}

if(i===sectors.length-1&&endAngle<360){
endAngle=360;}

arcs.push({startAngle:startAngle,endAngle:endAngle,outerRadius:radius});
colors.push(getColor(COLORS,i));
startAngle+=sectionPiece;});

return (
_react2.default.createElement(_reactNative.TouchableWithoutFeedback,{onPress:this._handlePress,__source:{fileName:_jsxFileName,lineNumber:75}},
_react2.default.createElement(_reactNative.View,{__source:{fileName:_jsxFileName,lineNumber:76}},
_react2.default.createElement(Surface,{width:this.props.width,height:this.props.height,__source:{fileName:_jsxFileName,lineNumber:77}},
_react2.default.createElement(Group,{originX:centerX,width:this.props.width,height:this.props.height,originY:centerY,rotation:this.state.rotation,__source:{fileName:_jsxFileName,lineNumber:78}},
arcs.map(function(arc,i){
return (
_react2.default.createElement(_Wedge2.default,_extends({
stroke:colors[i],
strokeWidth:STROKE_WIDTH,
fill:colors[i],
key:i,
originX:centerX,
originY:centerY},
arc,{__source:{fileName:_jsxFileName,lineNumber:81}})));}))))));}}]);return PieChart;}(_react.Component);exports.default=PieChart;