import StrInt, {Comparison} from '../src/StrInt';

test('constructor string', () => {
	expect(new StrInt("7").toString()).toBe("7");
});
test('constructor number', () => {
	expect(new StrInt(7).toString()).toBe("7");
});
test('constructor negative number', () => {
	expect(new StrInt(-7).toString()).toBe("-7");
});
test('constructor invalid type', () => {
	expect(() => new StrInt([7])).toThrow();
});

test('negate default positive', () => {
	expect(new StrInt(5).negate().toString()).toBe("-5");
});
test('negate default negative', () => {
	expect(new StrInt(-5).negate().toString()).toBe("5");
});
test('negate provided positive', () => {
	expect(new StrInt(5).negate(true).toString()).toBe("-5");
});
test('negate provided negative', () => {
	expect(new StrInt(-5).negate(true).toString()).toBe("-5");
});

test('simple sum', () => {
	expect(new StrInt(4).add(4).toString()).toBe("8");
});
test('multi-digit sum', () => {
	expect(new StrInt(123).add(123).toString()).toBe("246");
});
test('overflow sum', () => {
	expect(new StrInt(48).add(3).toString()).toBe("51");
});
test('negative sum', () => {
	expect(new StrInt(-65).add(5).toString()).toBe("-60");
});
test('add zero', () => { // coverage test
	expect(new StrInt(845).add(0).toString()).toBe("845");
});
test('sum past zero', () => {
	expect(new StrInt(-4).add(5).toString()).toBe("1");
});
test('sum multi-digit past zero', () => {
	expect(new StrInt(-42).add(53).toString()).toBe("11");
});
test('add large number to large number', () => {
	expect(new StrInt(992).add(99).toString()).toBe("1091");
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
test('negative subtract', () => {
	expect(new StrInt(-48).subtract(3).toString()).toBe("-51");
});
test('subtract zero', () => { // coverage test
	expect(new StrInt(845).subtract(0).toString()).toBe("845");
});
test('subtract past zero', () => {
	expect(new StrInt(4).subtract(5).toString()).toBe("-1");
});
test('subtract multi-digit past zero', () => {
	expect(new StrInt(40).subtract(53).toString()).toBe("-13");
});
test('subtract large number from large number', () => {
	expect(new StrInt(996).subtract(99).toString()).toBe("897");
});

test('compare larger', () => {
	expect(new StrInt(9).compareTo(1)).toBe(Comparison.greater);
});
test('compare smaller', () => {
	expect(new StrInt(3).compareTo(7)).toBe(Comparison.lesser);
});
test('compare equal', () => {
	expect(new StrInt(81).compareTo(81)).toBe(Comparison.equal);
});
test('compare larger helper', () => {
	expect(new StrInt(9).gt(1)).toBe(true);
});
test('compare smaller helper', () => {
	expect(new StrInt(3).lt(7)).toBe(true);
});
test('compare equal helper', () => {
	expect(new StrInt(81).equals(81)).toBe(true);
});
test('compare positive to negative', () => {
	expect(new StrInt(81).compareTo(-81)).toBe(Comparison.greater);
});
test('compare negative to positive', () => {
	expect(new StrInt(-81).compareTo(81)).toBe(Comparison.lesser);
});
test('compare bigger positive to smaller positive', () => {
	expect(new StrInt(125).compareTo(76)).toBe(Comparison.greater);
});
test('compare smaller positive to bigger positive', () => {
	expect(new StrInt(52).compareTo(706)).toBe(Comparison.lesser);
});
test('compare equal length positive', () => {
	expect(new StrInt(502).compareTo(706)).toBe(Comparison.lesser);
});
test('compare bigger negative to smaller negative', () => {
	expect(new StrInt(-125).compareTo(-76)).toBe(Comparison.lesser);
});
test('compare smaller negative to bigger negative', () => {
	expect(new StrInt(-52).compareTo(-706)).toBe(Comparison.greater);
});
test('compare equal length negative', () => {
	expect(new StrInt(-502).compareTo(-706)).toBe(Comparison.greater);
});

test('multiply single digit by single digit', () => {
	expect(new StrInt(4).multiply(4).toString()).toBe("16");
});
test('multiply single digit by multi-digit', () => {
	expect(new StrInt(4).multiply(40).toString()).toBe("160");
});
test('multiply multi-digit by single digit ', () => {
	expect(new StrInt(40).multiply(4).toString()).toBe("160");
});
test('multiply multi-digit by multi-digit', () => {
	expect(new StrInt(25).multiply(25).toString()).toBe("625");
});
test('multiply large number by large number', () => {
	expect(new StrInt(99).multiply(99).toString()).toBe("9801");
});
test('multiply positive by negative', () => {
	expect(new StrInt(4).multiply(-4).toString()).toBe("-16");
});
test('multiply negative by positive', () => {
	expect(new StrInt(-4).multiply(4).toString()).toBe("-16");
});
test('multiply negative by negative', () => {
	expect(new StrInt(-4).multiply(-4).toString()).toBe("16");
});
