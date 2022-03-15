import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fn from '../src/index.js';

test('exports', () => {
	assert.is(typeof fn, 'function', '~> a function');
});

test('basic :: object', () => {
	let x = 'Hello, {{name}}!';
	let y = { name: 'world' };
	assert.is(fn(x, y), 'Hello, world!');
	assert.equal(x, 'Hello, {{name}}!', '~> input string intact');
	assert.equal(y, { name: 'world' }, '~> input object intact');
});

test('basic :: array', () => {
	let x = 'Hello, {{0}}!';
	let y = ['world'];
	assert.is(fn(x, y), 'Hello, world!');
	assert.equal(x, 'Hello, {{0}}!', '~> input string intact');
	assert.equal(y, ['world'], '~> input array intact');
});

test('repeats', () => {
	assert.is(fn('{{0}}{{0}}{{0}}', ['🎉']), '🎉🎉🎉');
	assert.is(fn('{{x}}{{x}}{{x}}', { x: 'hi~' }), 'hi~hi~hi~');
});

test('invalid key ~> empty string', () => {
	let obj = { a:1, b:2 };
	assert.is(fn('{{a}}{{d}}{{b}}', obj), '12');
	assert.is(fn('{{d}}', obj), '');
	let arr = [1, 2];
	assert.is(fn('{{0}}{{9}}{{1}}', arr), '12');
	assert.is(fn('{{9}}', arr), '');
});

test('null keys', () => {
	let obj = { a:null, b:undefined };
	assert.is(fn('{{a}}~{{b}}', obj), '~');
	let arr = [ null, , undefined ];
	assert.is(fn('{{0}}~{{1}}~{{2}}', arr), '~~');
});

test('nested keys', () => {
	let obj = {
		name: 'John',
		foo: {
			bar: {
				baz: 'Smith'
			}
		}
	};
	let arr = ['John', [[['Smith']]]];
	assert.is(fn('{{name}} {{foo.bar.baz}}', obj), 'John Smith');
	assert.is(fn('{{0}} {{1.0.0}}', arr), 'John Smith');
});

test('nested keys (invalid)', () => {
	let obj = { foo:123 };
	assert.is(fn('{{foo.bar}}', obj), '');
	assert.is(fn('{{foo.bar.baz}}', obj), '');
	let arr = [123];
	assert.is(fn('{{0.1}}', arr), '');
	assert.is(fn('{{0.1.2}}', arr), '');
});

test('trim keys (whitespace)', () => {
	let obj = { foo:123, bar:{ baz:456 } };
	assert.is(fn('{{ foo }}', obj), '123');
	assert.is(fn('{{ bar.baz }}', obj), '456');
	let arr = [123, [456]];
	assert.is(fn('{{ 0 }}', arr), '123');
	assert.is(fn('{{ 1.0 }}', arr), '456');
});

test('multiline string', () => {
	let obj = { foo:123, bar:456 };
	assert.is(fn('\nApples: {{foo}}\n\nOranges: {{bar}}', obj), '\nApples: 123\n\nOranges: 456');
	assert.is(fn(`
		Apples: {{foo}}
		Oranges: {{bar}}
	`, obj), '\n\t\tApples: 123\n\t\tOranges: 456\n\t');
});

test('mixed datatype', () => {
	let arr = [4, 5, 6];
	arr.foo = 'hello';
	arr.bar = 'world';
	assert.is(fn('{{foo}}, {{bar}}! {{0}}{{1}}{{2}}', arr), 'hello, world! 456');
});

test('allows "0" value', () => {
	assert.is(fn('{{0}} & {{1}}', [0, -1]), '0 & -1');
});

test('currying', () => {
	let x = fn.bind(null, 'Hello, {{name}}');
	let arr = ['Jack', 'Jill', 'John'].map(name => x({ name }));
	assert.equal(arr, ['Hello, Jack', 'Hello, Jill', 'Hello, John']);
});

test.run();
