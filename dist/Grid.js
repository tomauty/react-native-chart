Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/Grid.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');
var _util=require('./util');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var 

Grid=function(_Component){_inherits(Grid,_Component);function Grid(){_classCallCheck(this,Grid);return _possibleConstructorReturn(this,Object.getPrototypeOf(Grid).apply(this,arguments));}_createClass(Grid,[{key:'render',value:function render()
















{var _this2=this;
if(!this.props.showGrid)return null;
var horizontalRange=[];
var verticalRange=[];
var data=this.props.data||[];
var unique=(0,_util.uniqueValuesInDataSet)(data);
var horizontalSteps=unique.length<this.props.verticalGridStep?unique.length:this.props.verticalGridStep;

for(var i=horizontalSteps;i>0;i--){horizontalRange.push(i);}
for(var _i=data.length-1;_i>0;_i--){verticalRange.push(_i);}

var containerStyle={width:this.props.width,height:this.props.height,position:'absolute',left:0};

var intendedLineWidth=this.props.gridLineWidth;
if(this.props.gridLineWidth<1){
intendedLineWidth=_reactNative.StyleSheet.hairlineWidth;}


var horizontalGridStyle={
height:this.props.height/this.props.verticalGridStep,
width:this.props.width,
borderTopColor:this.props.gridColor,
borderTopWidth:intendedLineWidth};


var verticalGridStyle={
height:this.props.height+1,
width:this.props.width/data.length,
borderRightColor:this.props.gridColor,
borderRightWidth:intendedLineWidth};


return (
_react2.default.createElement(_reactNative.View,{style:containerStyle,__source:{fileName:_jsxFileName,lineNumber:55}},
function(){
if(_this2.props.hideHorizontalGridLines)return null;
return (
_react2.default.createElement(_reactNative.View,{style:{position:'absolute',flexDirection:'column',justifyContent:'space-around'},__source:{fileName:_jsxFileName,lineNumber:59}},
horizontalRange.map(function(_,i){return _react2.default.createElement(_reactNative.View,{key:i,style:horizontalGridStyle,__source:{fileName:_jsxFileName,lineNumber:60}});})));}(),



function(){
if(_this2.props.hideVerticalGridLines)return null;
return (
_react2.default.createElement(_reactNative.View,{style:{flexDirection:'row',position:'absolute',justifyContent:'space-around'},__source:{fileName:_jsxFileName,lineNumber:67}},
verticalRange.map(function(_,i){return _react2.default.createElement(_reactNative.View,{key:i,style:verticalGridStyle,__source:{fileName:_jsxFileName,lineNumber:68}});})));}()));}}]);return Grid;}(_react.Component);Grid.propTypes={showGrid:_react.PropTypes.bool,data:_react.PropTypes.array.isRequired,verticalGridStep:_react.PropTypes.number.isRequired,gridLineWidth:_react.PropTypes.number,gridColor:_react.PropTypes.oneOfType([_react.PropTypes.number,_react.PropTypes.string]),hideHorizontalGridLines:_react.PropTypes.bool,hideVerticalGridLines:_react.PropTypes.bool,height:_react.PropTypes.number.isRequired,width:_react.PropTypes.number.isRequired,type:_react.PropTypes.oneOf(['line','bar','pie']).isRequired};Grid.defaultProps={};exports.default=Grid;