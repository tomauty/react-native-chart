Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/Circle.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();
var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');

var _constants=require('./constants');var C=_interopRequireWildcard(_constants);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Path=_reactNative.ART.Path;var Shape=_reactNative.ART.Shape;var 

Circle=function(_Component){_inherits(Circle,_Component);function Circle(){_classCallCheck(this,Circle);return _possibleConstructorReturn(this,Object.getPrototypeOf(Circle).apply(this,arguments));}_createClass(Circle,[{key:'render',value:function render()














{var _props=
this.props;var x=_props.x;var y=_props.y;var radius=_props.radius;
var path=new Path().moveTo(x,y-radius).arc(0,radius*2,radius).arc(0,radius*-2,radius).close();
return (
_react2.default.createElement(Shape,{d:path,stroke:this.props.stroke,fill:this.props.fill,strokeWidth:1,__source:{fileName:_jsxFileName,lineNumber:26}}));}}]);return Circle;}(_react.Component);Circle.propTypes={radius:_react.PropTypes.number.isRequired,x:_react.PropTypes.number.isRequired,y:_react.PropTypes.number.isRequired,onPress:_react.PropTypes.func,fill:_react.PropTypes.string,stroke:_react.PropTypes.string};Circle.defaultProps={onPress:function onPress(){},radius:2,fill:C.BLACK,stroke:C.BLACK};exports.default=Circle;