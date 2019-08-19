export default class StrInt {
	value: string;
	positive: boolean;

	constructor(num: any) {
		this.positive = true;
		if (typeof num === 'string') {
			if (/^\d+$/.test(num as string)) {
				this.value = num;
			}
		} else if (typeof num === 'number') {
			if (num < 0) {
				this.positive = false;
			}
			this.value = num.toString();
		} else if (num instanceof StrInt) {
			this.value = num.value;
			this.positive = num.positive;
		} else if (num) {
			throw new Error(`Invalid type ${typeof num}`);
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

	negate(): StrInt {
		this.positive = !this.positive;
		return this;
	}

	add(target: StrInt | string | number): StrInt {
		const other = new StrInt(target);

		// skip zeros, they dont change the value, and cause issues.
		if (other.value === '0') {
			return this;
		}
		if (other.positive != this.positive) {
			return this.subtract(other);
		}

		for (let i = 0; i < other.value.length; i++) {
			let result = Number(other.getDigit(i)) + Number(this.getDigit(i));
			if (result.toString() === this.getDigit(i)) {
				continue;
			}

			this.setDigit(i, result % 10);

			// if there is carryover, add it.
			if (result > 9) {
				this.add(result - (result % 10));
			}
		}

		return this;
	}

	subtract(target: StrInt | string | number): StrInt {
		const other = new StrInt(target);

		if (other.value === '0') {
			return this;
		}
		if (other.positive != this.positive) {
			return this.add(other);
		}

		for (let i = 0; i < other.value.length; i++) {
			let result = Number(this.getDigit(i)) - Number(other.getDigit(i));
			if (result.toString() === this.getDigit(i)) {
				continue;
			}

			this.setDigit(i, result < 0 ? 10 + result : result);
			if (result < 0) {
				this.subtract(Math.abs(result * Math.pow(10, other.value.length - i)));
			}
		}

		return this;
	}

	toString(): string {
		return this.value;
	}
}
