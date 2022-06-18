export class Num
{
	id;

	constructor(id)
	{
		this.id=id;
	}

	getValue()
	{
		return parseInt(localStorage.getItem(this.id));
	}

	setValue(value)
	{
		localStorage.setItem(this.id, value.toString());
	}
}
