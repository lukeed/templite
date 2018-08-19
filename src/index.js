const RGX = /{{(.*?)}}/g;
const CYCLE_RGX = /{{#each (.*?)}}(.*?){{\/each}}/g;
function processCycles(str, mix) {
	return str.replace(CYCLE_RGX, (x, key, y) => {
		return mix[key].reduce((acc, _, index)=>{
			acc += y.replace('{{this',`{{${key}.${index}`);
			return acc;
		},'');
	});
}

export default function (str, mix) {
	return processCycles(str, mix)
		.replace(RGX, (x, key, y) => {
			x = 0;
			y = mix;
			key = key.trim().split('.');
			while (y && x < key.length) {
				y = y[key[x++]];
			}
			return y != null ? y : '';
		});
}
