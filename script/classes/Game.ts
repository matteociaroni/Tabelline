import {Num} from "./Num.js";
import {Attempt} from "./Attempt.js";
import {Stats} from "./Stats.js";

export class Game
{
	private num1 : Num;
	private num2 : Num;
	private status : "playing" | "solved";

	constructor()
	{
		this.num1 = new Num("num1");
		this.num2 = new Num("num2");

		if(this.status === "solved")
			this.init(true);
	}

	getNum1() : number
	{
		return this.num1.getValue();
	}

	getNum2() : number
	{
		return this.num2.getValue();
	}

	getStatus() : string
	{
		return this.status;
	}

	setNumbers(random : boolean) : void
	{
		if(random || isNaN(this.num1.getValue()) || isNaN(this.num2.getValue()))
		{
			this.num1.setValue(this.getRandomInt());
			this.num2.setValue(this.getRandomInt());
		}
	}

	init(random : boolean = true) : void
	{
		this.status = "playing";
		this.setNumbers(random);
	}

	checkResult(attemptValue : number) : boolean
	{
		if(!isNaN(attemptValue))
		{
			const isCorrect = attemptValue === this.num1.getValue() * this.num2.getValue();
			this.storeAttempt(attemptValue);

			if(isCorrect)
				this.status = "solved";

			return isCorrect;
		}
		return false;
	}

	/**
	 * @return a random integer
	 */
	getRandomInt() : number
	{
		return Math.round(Math.random() * 10);
	}

	/**
	 * Store the current attempt in localStorage
	 * @param provided the value provided by the user for the current attempt
	 */
	storeAttempt(provided : number) : void
	{
		let attempts = JSON.parse(localStorage.getItem("tentativi"));

		if(attempts == null)
			attempts = new Array<Attempt>();

		attempts.push(new Attempt(new Date(), this.num1.getValue(), this.num2.getValue(), provided));
		localStorage.setItem("tentativi", JSON.stringify(attempts));
	}

	getAttempts() : Array<Attempt>
	{
		const loaded = localStorage.getItem("tentativi");
		let attempts = Array<Attempt>();

		if(loaded != null)
			attempts = JSON.parse(loaded);

		return attempts;
	}

	getOrderedAttempts()
	{
		const attempts=this.getAttempts();

		if(attempts==null)
			return;

		let stats = new Stats();

		for(let i=0; i<attempts.length; i++)
		{
			stats.pushAttempt(Object.setPrototypeOf(attempts[i], Attempt.prototype));
		}
		return stats;
	}
}