export class Attempt
{
	private readonly _timestamp: Date;
	private readonly _num1: number;
	private readonly _num2: number;
	private readonly _providedValue: number;

	constructor(timestamp: Date, num1: number, num2: number, providedValue: number)
	{
		this._timestamp = timestamp;
		this._num1 = num1;
		this._num2 = num2;
		this._providedValue = providedValue;
	}

	get timestamp(): Date
	{
		return this._timestamp;
	}

	get num1(): number
	{
		return this._num1;
	}

	get num2(): number
	{
		return this._num2;
	}

	get providedValue(): number
	{
		return this._providedValue;
	}
}