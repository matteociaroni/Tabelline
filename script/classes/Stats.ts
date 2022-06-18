import {AttemptsForTable} from "./AttemptsForTable.js";
import {Attempt} from "./Attempt.js";

export class Stats
{
	private readonly stats: AttemptsForTable[][];

	constructor()
	{
		this.stats = [];

		for (let i = 0; i <= 10; i++)
		{
			this.stats[i] = [];
			for (let j = 0; j <= 10; j++)
				this.stats[i][j] = new AttemptsForTable(i, j);
		}
	}

	pushAttempt(attempt: Attempt): void
	{
		this.getAttemptsForTable(attempt.num1, attempt.num2).push(attempt as Attempt);
	}

	getAttemptsForTable(num1: number, num2: number): Array<Attempt>
	{
		return this.stats[num1][num2].attempts;
	}
}