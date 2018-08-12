import dlv from 'dlv';

const RGX = /{{(.*?)}}/g;

export default function (str, mix) {
	return str.replace(RGX, (_, key) => dlv(mix, key) || '');
}
