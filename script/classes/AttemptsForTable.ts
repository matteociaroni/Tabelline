import {Attempt} from "./Attempt";

export class AttemptsForTable
{
	private readonly _num1 : number;
	private readonly _num2 : number;
	private readonly _attempts : Array<Attempt>;

	constructor(num1 : number, num2 : number)
	{
		this._num1=num1;
		this._num2=num2;
		this._attempts=new Array<Attempt>();
	}

	pushAttempt(attempt : Attempt) : void
	{
		this._attempts.push(attempt);
	}

	get attempts() : Array<Attempt>
	{
		return this._attempts;
	}

	get num1() : number
	{
		return this._num1;
	}

	get num2() : number
	{
		return this._num2;
	}
}