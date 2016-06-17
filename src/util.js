/* @flow */
type Pair = [number, number];
export function uniqueValuesInDataSet(data : Pair[]) : Pair[] {
	return data.reduce((result : Pair[], d : Pair) => {
		if (result.some(p => p[1] === d[1])) return result;
		result.push(d);
		return result;
	}, []);
}
