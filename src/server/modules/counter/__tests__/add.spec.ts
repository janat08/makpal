const add = (a:number,b:number):number => {
	return a + b;
};

test('test ts module adds 1 + 2 to equal 3', () => {
	expect(add(1, 2)).toBe(3);
});

test('test ts module adds 1 + 2 to equal 4', () => {
	expect(add(1, 2)).toBe(4);
});