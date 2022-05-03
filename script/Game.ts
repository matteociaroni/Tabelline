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

	getStatus() : string
	{
		return this.status;
	}

	getSelectedTables() : number[]
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

		document.getElementById("num1").innerHTML = this.num1.getValue().toString();
		document.getElementById("num2").innerHTML = this.num2.getValue().toString();
		document.getElementById("result").innerText = "";

		const inputNumber=<HTMLInputElement>document.getElementById("inserito");
		inputNumber.value = "";
		inputNumber.removeAttribute("disabled");
		inputNumber.focus();

		const button=document.getElementById("button");
		button.setAttribute("value", "Controlla");
		button.classList.remove("is-success");
		button.classList.remove("is-danger");
		button.classList.add("is-info");
	}

	checkResult() : void
	{
		const inputNumber=<HTMLInputElement>document.getElementById("inserito");
		const attemptValue : number = parseInt(inputNumber.value);

		if(!isNaN(attemptValue))
		{
			const isCorrect = attemptValue === this.num1.getValue() * this.num2.getValue();
			const button=document.getElementById("button");
			button.classList.remove("is-info");

			this.storeAttempt(attemptValue);

			if(isCorrect)
			{
				this.status = "solved";
				inputNumber.setAttribute("disabled", "true");

				button.setAttribute("value", "Avanti");
				button.classList.remove("is-danger");
				button.classList.add("is-success");
			}
			else
			{
				button.setAttribute("value", "Riprova");
				button.classList.add("is-danger");
			}
			document.getElementById("result").innerHTML = Game.resultEmoji(isCorrect);
		}
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
	changeTables() : void
	{
		let inputs = document.getElementsByTagName("input");
		let selectedTables = Array();
		for(let i = 0; i < inputs.length; i++)
		{
			if(inputs.item(i).checked === true)
				selectedTables.push(inputs.item(i).id);
		}
		localStorage.setItem("tabellineSelezionate", selectedTables.toString());

		if(selectedTables.indexOf(this.num1.getValue()) < 0)
			localStorage.removeItem("num1");
	}

	/**
	 * Check all checkboxes of the selected times tables
	 */
	setSelectedCheckboxes() : void
	{
		let inputs = document.getElementsByTagName("input");
		for(let i = 0; i < inputs.length; i++)
		{
			if(this.getSelectedTables().indexOf(parseInt(inputs.item(i).id)) > -1)
				inputs.item(i).checked = true;
		}
	}

	/**
	 * This method is executed when the button is pressed or when the user press the enter key
	 */
	nextAction()
	{
		if(this.getStatus() === "playing")
			this.checkResult();
		else
			this.init(true);
	}

	/**
	 * Store the current attempt in localStorage
	 * @param provided the value provided by the user for the current attempt
	 */
	storeAttempt(provided : number) : void
	{
		const loaded = JSON.parse(localStorage.getItem("tentativi"));

		if(loaded != null)
		{
			const attempts = loaded;

			attempts.push(new Attempt(new Date(), this.num1.getValue(), this.num2.getValue(), provided));
			localStorage.setItem("tentativi", JSON.stringify(attempts));
		}
	}

	static resultEmoji(success : boolean) : string
	{
		const successEmojis=["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳"];
		const failEmojis=["😩", "😭", "😢", "☹️", "😞", "😩"];

		if(success)
			return successEmojis[Math.floor(Math.random() * successEmojis.length)];
		else
			return failEmojis[Math.floor(Math.random() * failEmojis.length)];
	}

	/**
	 * Show all the attempts made by the user and stored in the localStorage
	 */
	showAttempts()
	{
		const containerTable = document.getElementById("tentativi");
		const loaded = localStorage.getItem("tentativi");
		if(loaded != null)
		{
			const attempts = JSON.parse(loaded);

			for(let i = 0; i < attempts.length; i++)
			{
				const row = document.createElement("tr");
				row.classList.add(attempts[i]._esito ? "is-success" : "is-danger");
				const date = document.createElement("td");
				date.innerText = new Date(attempts[i]._timestamp).toLocaleString("it-IT");
				const operation = document.createElement("td");
				operation.innerText = attempts[i]._num1 + " × " + attempts[i]._num2;
				row.appendChild(date);
				row.appendChild(operation);
				containerTable.appendChild(row);
			}
		}
	}

	/**
	 * Show all the possible tables (with checkboxes) in the settings page
	 */
	static showTablesList()
	{
		const container = document.getElementById("tabelline");

		for(let i = 0; i <= 10; i++)
		{
			const label = document.createElement("label");
			label.setAttribute("for", i.toString());
			label.innerText = "Tabellina " + i + " ";
			const input = document.createElement("input");
			input.setAttribute("type", "checkbox");
			input.id = i.toString();
			container.appendChild(label);
			container.appendChild(input);
			container.appendChild(document.createElement("br"));
		}
	}
}