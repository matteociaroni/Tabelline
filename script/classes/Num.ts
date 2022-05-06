export class Num
{
	private readonly id : string;

	constructor(id : string)
	{
		this.id = id;
	}

	getValue() : number
	{
		return parseInt(localStorage.getItem(this.id));
	}

	setValue(value : number) : void
	{
		localStorage.setItem(this.id, value.toString());
	}
}