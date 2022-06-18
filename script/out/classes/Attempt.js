export class Attempt
{
	constructor(timestamp, num1, num2, providedValue)
	{
		this._timestamp=timestamp;
		this._num1=num1;
		this._num2=num2;
		this._providedValue=providedValue;
	}

	_timestamp;

	get timestamp()
	{
		return this._timestamp;
	}

	_num1;

	get num1()
	{
		return this._num1;
	}

	_num2;

	get num2()
	{
		return this._num2;
	}

	_providedValue;

	get providedValue()
	{
		return this._providedValue;
	}
}
