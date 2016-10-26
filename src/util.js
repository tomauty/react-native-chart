/* @flow */
type Pair = [number, number];
export function uniqueValuesInDataSet(data : Pair[]) : Pair[] {
	return data.reduce((result : Pair[], d : Pair) => {
		if (result.some(p => p[1] === d[1])) return result;
		result.push(d);
		return result;
	}, []);
}

export function uniqueValuesInDataSets(data : [Pair[]], index : number) : Pair[] {
	let values = [];
	data.forEach(Graph => {
		Graph.forEach(XYPair => {
			if (values.indexOf(XYPair[index]) === -1) {
				values.push(XYPair[index])
			}
		})
	});
	values.sort(function(a, b) {
	  return a - b;
	});
	return values
}
