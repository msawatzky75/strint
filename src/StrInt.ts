type Target = StrInt | string | number
export default class StrInt implements IComparable<Target> {
	value: string;
	positive: boolean;

	constructor(num?: any) {
		this.value = "0";
		this.positive = true;
		if (typeof num === 'string') {
			if (/^\d+$/.test(num as string)) {
				this.value = num;
			}
		} else if (typeof num === 'number') {
			if (num < 0) {
				this.positive = false;
			}
			this.value = Math.abs(num).toString();
		} else if (num instanceof StrInt) {
			this.value = num.value;
			this.positive = num.positive;
		} else if (num) {
			throw new Error('Invalid type.');
		}
	}

	private getDigit(digit: number): string {
		return this.value.charAt(this.value.length - (1 + digit));
	}

	// Insert {value} at {this.value.length - (1 + digit)}
	private setDigit(digit: number, value: string | number) {
		if (value.toString().length > 1) {
			throw new Error('Replacement value too long');
		}

		const index = this.value.length - (1 + digit);
		const rep = value.toString();
		if (digit === this.value.length) {
			this.value = rep + this.value;
		} else {
			this.value = this.value.substring(0, index) + rep + this.value.substring(index + rep.length);
		}
	}

	negate(negative?: boolean): StrInt {
		if (negative !== undefined) {
			this.positive = !negative;
		} else {
			this.positive = !this.positive;
		}
		return this;
	}

	abs(): StrInt {
		return new StrInt(this.value);
	}

	add(target: Target): StrInt {
		const other = new StrInt(target);

		// skip zeros, they dont change the value, and cause issues.
		if (other.value === '0') {
			return this;
		}

		if (other.positive !== this.positive) {
			return this.subtract(other.negate());
		}

		for (let i = 0; i < other.value.length; i++) {
			let result = Number(this.getDigit(i)) + Number(other.getDigit(i));
			if (result.toString() === this.getDigit(i))
				continue;

			this.setDigit(i, result % 10);

			// if there is carryover, add it.
			if (result > 9)
				this.add(new StrInt(result - (result % 10)).negate(!other.positive));
		}

		return this;
	}

	subtract(target: Target): StrInt {
		const other = new StrInt(target);

		if (other.value === '0') {
			return this;
		}

		if (other.positive !== this.positive) {
			return this.add(other.negate());
		}

		for (let i = 0; i < other.value.length; i++) {
			let result = Number(this.getDigit(i)) - Number(other.getDigit(i));
			if (result.toString() === this.getDigit(i))
				continue;

			if (this.abs().lt(other.abs())) {
				this.negate();
				let temp = this.value;
				this.value = other.value;
				other.value = temp;
				this.setDigit(i, Math.abs(result));
			} else {
				this.setDigit(i, result < 0 ? 10 + result : result);
				if (result < 0) {
					this.subtract(new StrInt(Math.pow(10, other.value.length - i)).negate(!other.positive));
				}
			}
		}

		return this;
	}

	compareTo(target: Target): Comparison {
		const other = new StrInt(target);
		if (this.positive && !other.positive) {
			return Comparison.greater;
		} else if (other.positive && !this.positive) {
			return Comparison.lesser;
		}
		// we can now assume they have the same sign
		// if both are positive
		if (this.positive && (other.positive == this.positive)) {
			if (this.value.length > other.value.length) {
				return Comparison.greater;
			} else if (this.value.length < other.value.length) {
				return Comparison.lesser;
			} else { // both are same length
				return compareValue(this, other);
			}
		} else { // Both are negative
			if (this.value.length < other.value.length) {
				return Comparison.greater;
			} else if (this.value.length > other.value.length) {
				return Comparison.lesser;
			} else { // both are same length
				// this will be inverted, we need this because both are negative
				return compareValue(other, this);
			}
		}
		function compareValue(value1: StrInt, value2: StrInt): Comparison {
			for (let i = value1.value.length - 1; i >= 0; i--) {
				if (Number(value1.getDigit(i)) > Number(value2.getDigit(i))) {
					return Comparison.greater;
				} else if (Number(value1.getDigit(i)) < Number(value2.getDigit(i))) {
					return Comparison.lesser;
				}
			}
			return Comparison.equal;
		}
	}

	gt(target: Target): boolean {
		return this.compareTo(target) === Comparison.greater;
	}

	lt(target: Target): boolean {
		return this.compareTo(target) === Comparison.lesser;
	}

	equals(target: Target): boolean {
		return this.compareTo(target) === Comparison.equal;
	}

	toString(): string {
		return `${this.positive ? '' : '-'}${this.value}`;
	}
}

export interface IComparable<T = any> {
	compareTo: (other: T) => Comparison
}
export enum Comparison {
	lesser = -1,
	equal = 0,
	greater = 1,
}
