const test = require('tape');
const fn = require('../dist/templite');

test('exports', t => {
	t.is(typeof fn, 'function', '~> a function');
	t.end();
});

test('basic :: object', t => {
	let x = 'Hello, {{name}}!';
	let y = { name: 'world' };
	t.is(fn(x, y), 'Hello, world!');
	t.same(x, 'Hello, {{name}}!', '~> input string intact');
	t.same(y, { name: 'world' }, '~> input object intact');
	t.end();
});

test('basic :: array', t => {
	let x = 'Hello, {{0}}!';
	let y = ['world'];
	t.is(fn(x, y), 'Hello, world!');
	t.same(x, 'Hello, {{0}}!', '~> input string intact');
	t.same(y, ['world'], '~> input array intact');
	t.end();
});

test('repeats', t => {
	t.is(fn('{{0}}{{0}}{{0}}', ['🎉']), '🎉🎉🎉');
	t.is(fn('{{x}}{{x}}{{x}}', { x: 'hi~' }), 'hi~hi~hi~');
	t.end();
});

test('invalid key ~> empty string', t => {
	let obj = { a:1, b:2 };
	t.is(fn('{{a}}{{d}}{{b}}', obj), '12');
	t.is(fn('{{d}}', obj), '');
	let arr = [1, 2];
	t.is(fn('{{0}}{{9}}{{1}}', arr), '12');
	t.is(fn('{{9}}', arr), '');
	t.end();
});

test('null keys', t => {
	let obj = { a:null, b:undefined };
	t.is(fn('{{a}}~{{b}}', obj), '~');
	let arr = [ null, , undefined ];
	t.is(fn('{{0}}~{{1}}~{{2}}', arr), '~~');
	t.end();
});

test('nested keys', t => {
	let obj = {
		name: 'John',
		foo: {
			bar: {
				baz: 'Smith'
			}
		}
	};
	let arr = ['John', [[['Smith']]]];
	t.is(fn('{{name}} {{foo.bar.baz}}', obj), 'John Smith');
	t.is(fn('{{0}} {{1.0.0}}', arr), 'John Smith');
	t.end();
});

test('multiline string', t => {
	let obj = { foo:123, bar:456 };
	t.is(fn('\nApples: {{foo}}\n\nOranges: {{bar}}', obj), '\nApples: 123\n\nOranges: 456');
	t.is(fn(`
		Apples: {{foo}}
		Oranges: {{bar}}
	`, obj), '\n\t\tApples: 123\n\t\tOranges: 456\n\t');
	t.end();
});

test('mixed datatype', t => {
	let arr = [4, 5, 6];
	arr.foo = 'hello';
	arr.bar = 'world';
	t.is(fn('{{foo}}, {{bar}}! {{0}}{{1}}{{2}}', arr), 'hello, world! 456');
	t.end();
});

test('allows "0" value', t => {
	t.is(fn('{{0}} & {{1}}', [0, -1]), '0 & -1');
	t.end();
});
