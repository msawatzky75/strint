type Target = StrInt | string | number
export default class StrInt implements IComparable<Target> {
	value: string;
	positive: boolean;

	static abs(val: StrInt): StrInt {
		return new StrInt(val).negate(false);
	}

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

	// digit is an index, starting at the one's position of the number
	private setDigit(digit: number, value: string | number) {
		const index = this.value.length - (1 + digit);
		const rep = value.toString();
		if (digit === this.value.length - 1 && rep.length > 1) {
			console.log('set in front', rep, digit == this.value.length - 1 ? 'front' : 'not front', rep + this.value.substring(1));
			this.value = rep + this.value.substring(1);
		} else {
			this.value = this.value.substring(0, index) + (Number(rep) % 10).toString() + this.value.substring(index + 1);
		}
	}

	// Insert {value} at {this.value.length - (1 + digit)}
	negate(negative?: boolean): StrInt {
		if (negative !== undefined) {
			this.positive = !negative;
		} else {
			this.positive = !this.positive;
		}
		return this;
	}

	add(target: Target): StrInt {
		const other = new StrInt(target);

		// skip zeros, they dont change the value, and cause issues.
		if (other.value === '0') {
			return this;
		}

		if (this.positive !== other.positive) {
			return this.subtract(other.negate());
		}

		for (let i = 0; i < other.value.length; i++) {
			let result = Number(this.getDigit(i)) + Number(other.getDigit(i));
			if (result.toString() === this.getDigit(i))
				continue;

			this.setDigit(i, result % 10);
			this.negate(!other.positive);
			if (result > 9) {
				this.add(new StrInt("1".padEnd(i + 2, "0")).negate(!other.positive));
			}
		}

		return this;
	}

	subtract(target: Target): StrInt {
		const other = new StrInt(target);

		if (other.value === '0') {
			return this;
		}

		if (this.positive !== other.positive) {
			return this.add(other.negate());
		}

		// swap values if the other is bigger
		if (StrInt.abs(this).lt(StrInt.abs(other))) {
			let temp = this.value;
			this.value = other.value;
			other.value = temp;
			this.negate();
			other.negate();
		}

		for (let i = 0; i < other.value.length; i++) {
			let result = Number(this.getDigit(i)) - Number(other.getDigit(i));
			if (result.toString() === this.getDigit(i))
				continue;

			if (result < 0) {
				this.setDigit(i, 10 + result);
				this.subtract("1".padEnd(i + 2, "0")).negate(!other.positive);
			} else {
				this.setDigit(i, result);
			}
		}

		return this;
	}

	multiply(target: Target): StrInt {
		const other = new StrInt(target);
		const product = new StrInt();

		for (let i = 0; i < this.value.length; i++) {
			let itrSum = new StrInt();
			for (let j = 0; j < other.value.length; j++) {
				itrSum.add(Number(this.getDigit(i)) * Number(other.getDigit(j)) * Math.pow(10, j));
			}
			itrSum = new StrInt(itrSum.value + Math.pow(10, i).toString().substring(1));
			product.add(itrSum);
		}
		return product.negate(!this.positive && other.positive || this.positive && !other.positive);
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

	toJSON(): object {
		return {
			value: this.value,
			positive: this.positive,
		};
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
