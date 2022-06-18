export class AttemptsForTable
{
	constructor(num1, num2)
	{
		this._num1=num1;
		this._num2=num2;
		this._attempts=new Array();
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

	_attempts;

	get attempts()
	{
		return this._attempts;
	}

	pushAttempt(attempt)
	{
		this._attempts.push(attempt);
	}
}
