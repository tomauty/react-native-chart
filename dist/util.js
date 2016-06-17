Object.defineProperty(exports,"__esModule",{value:true});exports.

uniqueValuesInDataSet=uniqueValuesInDataSet;function uniqueValuesInDataSet(data){
return data.reduce(function(result,d){
if(result.some(function(p){return p[1]===d[1];}))return result;
result.push(d);
return result;},
[]);}