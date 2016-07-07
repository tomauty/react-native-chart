Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/yAxis.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();
var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');
var _util=require('./util');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var styles=_reactNative.StyleSheet.create({
yAxisContainer:{
flexDirection:'column',
justifyContent:'space-between',
flex:1,
paddingVertical:0,
paddingRight:5,
alignItems:'flex-end'}});var 



YAxis=function(_Component){_inherits(YAxis,_Component);















function YAxis(props){_classCallCheck(this,YAxis);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(YAxis).call(this,
props));_this.



_createLabelForYAxis=function(index){
var minBound=_this.props.minVerticalBound;
var maxBound=_this.props.maxVerticalBound;

// For all same values, create a range anyway
if(minBound===maxBound){
minBound-=_this.props.verticalGridStep;
maxBound+=_this.props.verticalGridStep;}

minBound=minBound<0?0:minBound;
var label=minBound+(maxBound-minBound)/_this.props.verticalGridStep*index;
label=Math.round(label);
if(_this.props.yAxisTransform&&typeof _this.props.yAxisTransform==='function'){
label=_this.props.yAxisTransform(label);}

return (
_react2.default.createElement(_reactNative.Text,{
style:{
color:_this.props.axisLabelColor,
fontSize:_this.props.labelFontSize},

key:index,__source:{fileName:_jsxFileName,lineNumber:54}},

label));};_this.state={bounds:{min:0,max:0}};return _this;}_createClass(YAxis,[{key:'render',value:function render()




{
var range=[];
var data=this.props.data||[];
var unique=(0,_util.uniqueValuesInDataSet)(data);
var steps=unique.length<this.props.verticalGridStep?unique.length:this.props.verticalGridStep;
for(var i=steps;i>=0;i--){range.push(i);}
return (
_react2.default.createElement(_reactNative.View,{
style:[
styles.yAxisContainer,
this.props.style||{},
this.props.placement==='left'&&{borderRightColor:this.props.axisColor,borderRightWidth:this.props.axisLineWidth},
this.props.placement==='right'&&{borderLeftColor:this.props.axisColor,borderLeftWidth:this.props.axisLineWidth}],__source:{fileName:_jsxFileName,lineNumber:73}},


range.map(this._createLabelForYAxis)));}}]);return YAxis;}(_react.Component);YAxis.propTypes={axisColor:_react.PropTypes.any,axisLineWidth:_react.PropTypes.number,data:_react.PropTypes.arrayOf(_react.PropTypes.array).isRequired,height:_react.PropTypes.number.isRequired,placement:_react.PropTypes.oneOf(['left','right']),verticalGridStep:_react.PropTypes.number.isRequired,yAxisTransform:_react.PropTypes.func};YAxis.defaultProps={placement:'left'};exports.default=YAxis;