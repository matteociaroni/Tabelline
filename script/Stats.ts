import {AttemptsForTable} from "./AttemptsForTable.js";
import {Attempt} from "./Attempt.js";

export class Stats
{
	private stats : Array<AttemptsForTable>;

	constructor()
	{
		this.stats = new Array<AttemptsForTable>();

		for(let i = 0; i <= 10; i++)
			for(let j = 0; j <= 10; j++)
				this.stats.push(new AttemptsForTable(i, j));
	}

	pushAttempt(attempt : Attempt) : void
	{
		this.getAttemptsForTable(attempt._num1, attempt._num2).push(attempt as Attempt);
	}

	getAttemptsForTable(num1 : number, num2 : number) : Array<Attempt>
	{
		for(let i = 0; i < this.stats.length; i++)
		{
			if(this.stats[i].num1 == num1 && this.stats[i].num2 == num2)
				return this.stats[i].getAttempts();
		}
	}
}