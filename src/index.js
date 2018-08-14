const RGX = /{{\s*(.*?)\s*}}/g;
const get = (obj, key) => obj && obj[key];

export default function (str, mix) {
	return str.replace(RGX, (x, key) => {
		x = key.split('.').reduce(get, mix);
		return x != null ? x : '';
	});
}
