import StrInt from '../src/StrInt';

test('simple sum', () => {
	expect(new StrInt(4).add(4).toString()).toBe("8");
});

test('multi-digit sum', () => {
	expect(new StrInt(123).add(123).toString()).toBe("246");
});

test('overflow sum', () => {
	expect(new StrInt(9).add(5).toString()).toBe("14");
});


test('simple subtract', () => {
	expect(new StrInt(9).subtract(3).toString()).toBe("6");
});

test('multi-digit subtract', () => {
	expect(new StrInt(123).subtract(23).toString()).toBe("100");
});

test('overflow subtract', () => {
	expect(new StrInt(21).subtract(3).toString()).toBe("18");
});
