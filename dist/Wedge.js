Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/Wedge.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();
























var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;} /**
 * Taken from react-art, changed for RN.
 * Copyright 2013-2014 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Wedge.art
 * @typechecks
 *
 * Example usage:
 * <Wedge
 *	 outerRadius={50}
 *	 startAngle={0}
 *	 endAngle={360}
 *	 fill="blue"
 * />
 *
 * Additional optional property:
 *	 (Int) innerRadius
 *
 */var Shape=_reactNative.ART.Shape;var Path=_reactNative.ART.Path; /**
 * Wedge is a React component for drawing circles, wedges and arcs.	Like other
 * ReactART components, it must be used in a <Surface>.
 */var Wedge=function(_Component){_inherits(Wedge,_Component);function Wedge(props){_classCallCheck(this,Wedge);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(Wedge).call(this,props));_this.circleRadians=Math.PI*2;_this.radiansPerDegree=Math.PI/180;_this._degreesToRadians=_this._degreesToRadians.bind(_this);return _this;} /**
	 * _degreesToRadians(degrees)
	 *
	 * Helper function to convert degrees to radians
	 *
	 * @param {number} degrees
	 * @return {number}
	 */_createClass(Wedge,[{key:'_degreesToRadians',value:function _degreesToRadians(
degrees){
if(degrees!==0&&degrees%360===0){ // 360, 720, etc.
return this.circleRadians;}

return degrees*this.radiansPerDegree%this.circleRadians;}


/**
	 * _createCirclePath(or, ir)
	 *
	 * Creates the ReactART Path for a complete circle.
	 *
	 * @param {number} or The outer radius of the circle
	 * @param {number} ir The inner radius, greater than zero for a ring
	 * @return {object}
	 */},{key:'_createCirclePath',value:function _createCirclePath(
or,ir){
var path=new Path();

path.move(0,or).
arc(or*2,0,or).
arc(-or*2,0,or);

if(ir){
path.move(or-ir,0).
counterArc(ir*2,0,ir).
counterArc(-ir*2,0,ir);}


path.close();

return path;}


/**
	 * _createArcPath(sa, ea, ca, or, ir)
	 *
	 * Creates the ReactART Path for an arc or wedge.
	 *
	 * @param {number} startAngle The starting degrees relative to 12 o'clock
	 * @param {number} endAngle The ending degrees relative to 12 o'clock
	 * @param {number} or The outer radius in pixels
	 * @param {number} ir The inner radius in pixels, greater than zero for an arc
	 * @return {object}
	 */},{key:'_createArcPath',value:function _createArcPath(
originX,originY,startAngle,endAngle,or,ir){
var path=new Path();

// angles in radians
var sa=this._degreesToRadians(startAngle);
var ea=this._degreesToRadians(endAngle);

// central arc angle in radians
var ca=sa>ea?this.circleRadians-sa+ea:ea-sa;

// cached sine and cosine values
var ss=Math.sin(sa);
var es=Math.sin(ea);
var sc=Math.cos(sa);
var ec=Math.cos(ea);

// cached differences
var ds=es-ss;
var dc=ec-sc;
var dr=ir-or;

// if the angle is over pi radians (180 degrees)
// we will need to let the drawing method know.
var large=ca>Math.PI;

// TODO (sema) Please improve theses comments to make the math
// more understandable.
//
// Formula for a point on a circle at a specific angle with a center
// at (0, 0):
// x = radius * Math.sin(radians)
// y = radius * Math.cos(radians)
//
// For our starting point, we offset the formula using the outer
// radius because our origin is at (top, left).
// In typical web layout fashion, we are drawing in quadrant IV
// (a.k.a. Southeast) where x is positive and y is negative.
//
// The arguments for path.arc and path.counterArc used below are:
// (endX, endY, radiusX, radiusY, largeAngle)

path.move(or+or*ss,or-or*sc) // move to starting point
.arc(or*ds,or*-dc,or,or,large) // outer arc
.line(dr*es,dr*-ec); // width of arc or wedge

if(ir){
path.counterArc(ir*-ds,ir*dc,ir,ir,large); // inner arc
}

return path;}},{key:'render',value:function render()


{
// angles are provided in degrees
var startAngle=this.props.startAngle;
var endAngle=this.props.endAngle;
// if (startAngle - endAngle === 0) {
// 	return null;
// }

// radii are provided in pixels
var innerRadius=this.props.innerRadius||0;
var outerRadius=this.props.outerRadius;var _props=

this.props;var originX=_props.originX;var originY=_props.originY;

// sorted radii
var ir=Math.min(innerRadius,outerRadius);
var or=Math.max(innerRadius,outerRadius);

var path=void 0;
if(endAngle>=startAngle+360){
path=this._createCirclePath(or,ir);}else 
{
path=this._createArcPath(originX,originY,startAngle,endAngle,or,ir);}


return _react2.default.createElement(Shape,_extends({},this.props,{d:path,__source:{fileName:_jsxFileName,lineNumber:183}}));}}]);return Wedge;}(_react.Component);Wedge.propTypes={outerRadius:_react.PropTypes.number.isRequired,startAngle:_react.PropTypes.number.isRequired,endAngle:_react.PropTypes.number.isRequired,originX:_react.PropTypes.number.isRequired,originY:_react.PropTypes.number.isRequired,innerRadius:_react.PropTypes.number};exports.default=Wedge;