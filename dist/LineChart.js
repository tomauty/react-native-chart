Object.defineProperty(exports,"__esModule",{value:true});var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[typeof Symbol==='function'?Symbol.iterator:'@@iterator'](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if((typeof Symbol==='function'?Symbol.iterator:'@@iterator')in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();
var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');

var _constants=require('./constants');var C=_interopRequireWildcard(_constants);
var _Circle=require('./Circle');var _Circle2=_interopRequireDefault(_Circle);

var _Grid=require('./Grid');var _Grid2=_interopRequireDefault(_Grid);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Surface=_reactNative.ART.Surface;var Shape=_reactNative.ART.Shape;var Path=_reactNative.ART.Path;var AnimatedShape=_reactNative.Animated.createAnimatedComponent(Shape);

var makeDataPoint=function makeDataPoint(x,y,data,index){

var color=data.color[index]?data.color[index]:C.BLUE;

var fill=data.dataPointFillColor&&data.dataPointFillColor[index]?
data.dataPointFillColor[index]:color;

var stroke=data.dataPointColor&&data.dataPointColor[index]?
data.dataPointColor[index]:color;

return{
x:x,
y:y,
radius:data.dataPointRadius,
fill:fill,
stroke:stroke};
};

var calculateDivisor=function calculateDivisor(minBound,maxBound){
return maxBound-minBound<=0?0.00001:maxBound-minBound;
};

var heightZero=_reactNative.Platform.OS==='ios'?0:1;var

LineChart=function(_Component){_inherits(LineChart,_Component);

function LineChart(props){_classCallCheck(this,LineChart);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(LineChart).call(this,
props));_this.




















_drawLine=function(){
var containerHeight=_this.props.height;
var containerWidth=_this.props.width;
var data=_this.props.data||[[]];
var minBound=_this.props.minVerticalBound;
var maxBound=_this.props.maxVerticalBound;

// For all same values, create a range anyway
if(minBound===maxBound){
minBound-=_this.props.verticalGridStep;
maxBound+=_this.props.verticalGridStep;
}

var divisor=calculateDivisor(minBound,maxBound);
var scale=(containerHeight+1)/divisor;
var horizontalStep=containerWidth/data[0].length;

var dataPoints=[];
var path=[];
var fillPath=[];var _loop=function _loop(){


var currentData=data[index]||[];
var firstDataPoint=currentData[0][1];
var height=minBound*scale+(containerHeight-firstDataPoint*scale);
if(height<0)height=0;

path.push(new Path().moveTo(0,height));
fillPath.push(new Path().moveTo(0,containerHeight).lineTo(0,height));

var dataPointSet=[];
dataPointSet.push(makeDataPoint(0,height,_this.props,index));

currentData.slice(1).forEach(function(_ref,i){var _ref2=_slicedToArray(_ref,2);var _=_ref2[0];var dataPoint=_ref2[1];
var _height=minBound*scale+(containerHeight-dataPoint*scale);

if(_height<0)_height=0;

var x=horizontalStep*i+horizontalStep;
var y=Math.round(_height);

path[index].lineTo(x,y);
fillPath[index].lineTo(x,y);
dataPointSet.push(makeDataPoint(x,y,_this.props,index));
});

dataPoints.push(dataPointSet);

fillPath[index].lineTo(dataPointSet[dataPointSet.length-1].x,containerHeight);
if(_this.props.fillColor){
fillPath[index].moveTo(0,containerHeight);
}

if(path[index].path.some(isNaN))return{v:null};};for(index=0;index<data.length;index++){var _ret=_loop();if(typeof _ret==="object")return _ret.v;
}

var multipleLines=dataPoints.map(function(dataPointSet,index){
var color=_this.props.color[index]?_this.props.color[index]:C.BLUE;
return(
_react2.default.createElement(AnimatedShape,{d:path[index],stroke:_this.props.color[index]||C.BLUE,strokeWidth:_this.props.lineWidth}));

});

var multipleFills=dataPoints.map(function(dataPointSet,index){
return(
_react2.default.createElement(AnimatedShape,{d:fillPath[index],fill:_this.props.fillColor}));

});

return(
_react2.default.createElement(_reactNative.View,null,
_react2.default.createElement(_reactNative.View,{style:{position:'absolute'}},
_react2.default.createElement(Surface,{width:containerWidth,height:containerHeight},
multipleLines,
multipleFills)),


_react2.default.createElement(_reactNative.View,{style:{position:'absolute'}},
_react2.default.createElement(Surface,{width:containerWidth,height:containerHeight})),

function(){
if(!_this.props.showDataPoint)return null;

var multipleDataPoints=dataPoints.map(function(dataPointSet,index){
var totalDataSet=dataPointSet.map(function(d,i){
return _react2.default.createElement(_Circle2.default,_extends({key:i},d));
});
return totalDataSet;
});

return(
_react2.default.createElement(Surface,{width:containerWidth,height:containerHeight},
multipleDataPoints));


}()));


};console.log(props);var heightValue=props.animated?heightZero:props.height;var opacityValue=props.animated?0:1;_this.state={height:new _reactNative.Animated.Value(heightValue),opacity:new _reactNative.Animated.Value(opacityValue)};return _this;}_createClass(LineChart,[{key:'componentWillUpdate',value:function componentWillUpdate(){if(this.props.animated){_reactNative.Animated.timing(this.state.opacity,{duration:0,toValue:0}).start();_reactNative.Animated.timing(this.state.height,{duration:0,toValue:heightZero}).start();}}},{key:'componentDidUpdate',value:function componentDidUpdate(){if(this.props.animated){_reactNative.Animated.timing(this.state.height,{duration:this.props.animationDuration,toValue:this.props.height}).start();_reactNative.Animated.timing(this.state.opacity,{duration:this.props.animationDuration,toValue:1}).start();}}},{key:'render',value:function render()

{
if(_reactNative.Platform.OS==='ios'){
return(
_react2.default.createElement(_reactNative.View,{style:{overflow:'hidden'}},
_react2.default.createElement(_Grid2.default,this.props),
_react2.default.createElement(_reactNative.Animated.View,{style:{height:this.state.height,opacity:this.state.opacity,backgroundColor:'transparent'}},
this._drawLine())));



}
return(
_react2.default.createElement(_reactNative.View,null,
_react2.default.createElement(_Grid2.default,this.props),
_react2.default.createElement(_reactNative.View,{style:{height:this.props.height}},
this._drawLine())));



}}]);return LineChart;}(_react.Component);exports.default=LineChart;