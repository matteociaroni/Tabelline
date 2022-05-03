import {Num} from "./Num.js";
import {Attempt} from "./Attempt.js";

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

	getSelectedTables() : Array<number>
	{
		const loaded = localStorage.getItem("tabellineSelezionate");
		if(loaded != "" && loaded != null)
			return loaded.split(",").map(Number);
		else
			return Array();
	}

	setNumbers(random : boolean) : void
	{
		if(random || isNaN(this.num1.getValue()) || isNaN(this.num2.getValue()))
		{
			this.num1.setValue(this.getRandomInt(true));
			this.num2.setValue(this.getRandomInt(false));
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
	 * @param check specifies if the number must be included in the currently selected times tables
	 */
	getRandomInt(check : boolean = false) : number
	{
		let n : number;

		if(check && this.getSelectedTables().length > 0)
			n = this.getSelectedTables()[Math.round(Math.random() * (this.getSelectedTables().length - 1))];
		else
			n = Math.round(Math.random() * 10);

		return n;
	}

	/**
	 * This method is executed when the user press the save button in the settings page.
	 *
	 * Change the selected times tables in localStorage.
	 */
	changeTables(selectedTables : number[]) : void
	{
		localStorage.setItem("tabellineSelezionate", selectedTables.toString());

		if(selectedTables.indexOf(this.num1.getValue()) < 0)
			localStorage.removeItem("num1");
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
}