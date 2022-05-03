import {Stats} from "./Stats";
import {Game} from "./Game.js";

export class GraphicalGame
{
	private game : Game;

	constructor()
	{
		this.game = new Game();
	}

	init(random : boolean = true) : void
	{
		this.game.init(random);

		document.getElementById("num1").innerHTML = this.game.getNum1().toString();
		document.getElementById("num2").innerHTML = this.game.getNum2().toString();
		document.getElementById("result").innerText = "";

		const inputNumber = <HTMLInputElement>document.getElementById("answer");
		inputNumber.value = "";
		inputNumber.removeAttribute("disabled");
		inputNumber.focus();

		const button = document.getElementById("button");
		button.setAttribute("value", "Controlla");
		button.classList.remove("is-success");
		button.classList.remove("is-danger");
		button.classList.add("is-info");
	}

	checkResult() : void
	{
		const inputNumber = <HTMLInputElement>document.getElementById("answer");
		const attemptValue : number = parseInt(inputNumber.value);

		if(!isNaN(attemptValue))
		{
			const isCorrect = this.game.checkResult(attemptValue);
			const button = document.getElementById("button");
			button.classList.remove("is-info");

			if(isCorrect)
			{
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
			document.getElementById("result").innerHTML = GraphicalGame.resultEmoji(isCorrect);
		}
	}

	/**
	 * This method is executed when the button is pressed or when the user press the enter key
	 */
	nextAction()
	{
		if(this.game.getStatus() === "playing")
			this.checkResult();
		else
			this.init(true);
	}

	changeTables() : void
	{
		let inputs = document.getElementsByTagName("input");
		let selectedTables = Array();
		for(let i = 0; i < inputs.length; i++)
		{
			if(inputs.item(i).checked === true)
				selectedTables.push(inputs.item(i).id);
		}

		this.game.changeTables(selectedTables);
	}

	static resultEmoji(success : boolean) : string
	{
		const successEmojis = ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳"];
		const failEmojis = ["😩", "😭", "😢", "☹️", "😞", "😩"];

		if(success)
			return successEmojis[Math.floor(Math.random() * successEmojis.length)];
		else
			return failEmojis[Math.floor(Math.random() * failEmojis.length)];
	}

	/**
	 * Show all the attempts made by the user and stored in the localStorage
	 */
	showAttempts() : void
	{
		const containerTable = document.getElementById("attempts");
		const attempts = this.game.getAttempts();

		if(attempts != null)
		{
			for(let i = 0; i < attempts.length; i++)
			{
				const row = document.createElement("tr");
				//row.classList.add(attempts[i]._providedValue ==  attempts[i]._num1 * attempts[i]._num2 ? "is-success" : "is-danger");
				const date = document.createElement("td");
				date.innerText = new Date(attempts[i]._timestamp).toLocaleString("it-IT");
				const operation = document.createElement("td");
				operation.innerText = attempts[i]._num1 + " × " + attempts[i]._num2;
				const answer = document.createElement("td");
				answer.innerText = attempts[i]._providedValue.toString();
				row.appendChild(date);
				row.appendChild(operation);
				row.appendChild(answer);
				containerTable.appendChild(row);
			}
		}
	}

	/**
	 * Check all checkboxes of the selected times tables
	 */
	setSelectedCheckboxes() : void
	{
		let inputs = document.getElementsByTagName("input");
		for(let i = 0; i < inputs.length; i++)
		{
			if(this.game.getSelectedTables().indexOf(parseInt(inputs.item(i).id)) > -1)
				inputs.item(i).checked = true;
		}
	}

	/**
	 * Show all the possible tables (with checkboxes) in the settings page
	 */
	static showTablesList()
	{
		const container = document.getElementById("tables");

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

	showStats(option : "errors" | "attempts")
	{
		const stats = this.game.getOrderedAttempt();
		const tableHead = document.getElementById("head");
		tableHead.innerHTML = "";

		const el = document.createElement("th");
		el.innerHTML = "";
		tableHead.appendChild(el);

		for(let i = 0; i <= 10; i++)
		{
			const el = document.createElement("th");
			el.innerHTML = i.toString();
			tableHead.appendChild(el);
		}

		const tableBody = document.getElementById("stats");
		tableBody.innerHTML = "";

		for(let i = 0; i <= 10; i++)
		{
			const row = document.createElement("tr");
			const num1 = document.createElement("th");
			num1.innerHTML = i.toString();
			row.appendChild(num1);

			for(let j = 0; j <= 10; j++)
			{
				const el = document.createElement("td");

				let value : string = "";

				if(option == "attempts")
					value = stats.getAttemptsForTable(i, j).length.toString();
				if(value=="0")
					value="";

				if(option == "errors")
				{
					value = "";
					const attempts=stats.getAttemptsForTable(i, j);
					let countErrors=0;
					for(let k=0; k<attempts.length; k++)
					{
						if(attempts[k]._num1*attempts[k]._num2 != attempts[k]._providedValue)
							countErrors++;
					}
					if(attempts.length==0)
						value=""
					else
						value=Math.round(100*countErrors/attempts.length)+"%";
				}

				el.innerHTML = value;
				row.appendChild(el);
			}
			tableBody.appendChild(row);
		}
	}
}