import {Game} from "./Game.js";
import {Attempt} from "./Attempt.js";
import {Stats} from "./Stats";

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

		const inputNumber : HTMLInputElement = <HTMLInputElement>document.getElementById("answer");
		inputNumber.value = "";
		inputNumber.removeAttribute("disabled");
		inputNumber.focus();

		const button : HTMLElement = document.getElementById("button");
		button.setAttribute("value", "Controlla");
		button.classList.remove("is-success");
		button.classList.remove("is-danger");
		button.classList.add("is-info");
	}

	checkResult() : void
	{
		const inputNumber : HTMLInputElement = <HTMLInputElement>document.getElementById("answer");
		const attemptValue : number = parseInt(inputNumber.value);

		if(!isNaN(attemptValue))
		{
			const isCorrect : boolean = this.game.checkResult(attemptValue);
			const button : HTMLElement = document.getElementById("button");
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
	nextAction() : void
	{
		if(this.game.getStatus() === "playing")
			this.checkResult();
		else
			this.init(true);
	}

	static resultEmoji(success : boolean) : string
	{
		const successEmojis : Array<string> = ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳", "😸", "😺"];
		const failEmojis : Array<string> = ["😩", "😭", "😢", "☹️", "😞", "😩", "😿"];

		if(success)
			return successEmojis[Math.floor(Math.random() * successEmojis.length)];
		else
			return failEmojis[Math.floor(Math.random() * failEmojis.length)];
	}

	/**
	 * Show all the attempts made by the user and stored in the localStorage
	 */
	showAttempts(from : Date, to : Date) : void
	{
		const containerTable : HTMLElement = document.getElementById("attempts");
		containerTable.innerText = "";
		const attempts : Array<Attempt> = this.game.getAttempts();

		if(attempts != null)
		{
			let count : number = 0;
			let fails : number = 0;

			for(let i = 0; i < attempts.length; i++)
			{
				const currentAttempt : Attempt = Object.setPrototypeOf(attempts[i], Attempt.prototype);

				if((from == null || from.toISOString() <= currentAttempt.timestamp.toString()) && (to == null || to.toISOString() > currentAttempt.timestamp.toString()))
				{
					const row : HTMLTableRowElement = document.createElement("tr");
					//row.classList.add(attempts[i].providedValue ==  attempts[i].num1 * attempts[i].num2 ? "is-success" : "is-danger");
					const date : HTMLTableCellElement = document.createElement("td");
					date.innerText = new Date(currentAttempt.timestamp).toLocaleString("it-IT");
					const operation : HTMLTableCellElement = document.createElement("td");
					operation.innerText = currentAttempt.num1 + " × " + currentAttempt.num2;
					const answer : HTMLTableCellElement = document.createElement("td");
					answer.innerText = currentAttempt.providedValue.toString();
					row.appendChild(date);
					row.appendChild(operation);
					row.appendChild(answer);
					containerTable.appendChild(row);
					count++;
					if(attempts[i].providedValue != attempts[i].num1 * attempts[i].num2)
						fails++;
				}
			}
			const totalRow : HTMLTableRowElement = document.createElement("tr");
			const countCell : HTMLTableCellElement = document.createElement("td");
			countCell.innerText = "Totale: " + count;
			const successesAndFails : HTMLTableCellElement = document.createElement("td");
			successesAndFails.innerText = "Corretti: " + (count - fails) + " - Errati: " + fails;
			successesAndFails.colSpan = 2;
			totalRow.appendChild(countCell);
			totalRow.appendChild(successesAndFails);
			containerTable.appendChild(totalRow);
		}
	}

	showStats(option : "errors" | "attempts") : void
	{
		const stats : Stats = this.game.getOrderedAttempts();
		const tableHead : HTMLElement = document.getElementById("head");
		tableHead.innerHTML = "";
		tableHead.appendChild(document.createElement("th")); //fill empty cell

		//set the table head with numbers 0 to 10
		for(let i = 0; i <= 10; i++)
		{
			const el : HTMLTableCellElement = document.createElement("th");
			el.innerHTML = i.toString();
			tableHead.appendChild(el);
		}

		const totalTitle1 : HTMLTableCellElement = document.createElement("th");
		totalTitle1.innerText = option == "attempts" ? "Σ" : "";
		tableHead.appendChild(totalTitle1);

		const tableBody : HTMLElement = document.getElementById("stats");
		tableBody.innerHTML = "";

		//these arrays are used to create the total row
		const columnsSum : Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		const columnsCount : Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for(let i = 0; i <= 10; i++)
		{
			const row : HTMLTableRowElement = document.createElement("tr");

			//create the first cell of the row
			const num1 : HTMLTableCellElement = document.createElement("th");
			num1.innerHTML = i.toString();
			row.appendChild(num1);

			//these variables are used to create the total cell, the last cell of the row
			let sum : number = 0;
			let count : number = 0;

			for(let j = 0; j <= 10; j++)
			{
				const cell : HTMLTableCellElement = document.createElement("td");
				let value : number = 0;

				if(option == "attempts")
				{
					value = stats.getAttemptsForTable(i, j).length;
					cell.innerHTML = value > 0 ? value.toString() : "";
					sum += value;
					count = 1;
					columnsSum[j] += value;
				}

				if(option == "errors")
				{
					value = 0;
					const attempts : Array<Attempt> = stats.getAttemptsForTable(i, j);
					let countErrors : number = 0;
					for(let k = 0; k < attempts.length; k++)
					{
						if(attempts[k].num1 * attempts[k].num2 != attempts[k].providedValue)
							countErrors++;
					}
					if(attempts.length == 0)
						value = 0;
					else
						value = Math.round(100 * countErrors / attempts.length);

					cell.innerHTML = attempts.length > 0 ? value.toString() + "%" : "";
					sum += countErrors;
					count += attempts.length;
					columnsSum[j] += countErrors;
					columnsCount[j] += attempts.length;
				}
				row.appendChild(cell);
			}

			//set the totale cell at the end of the row
			const total : HTMLTableCellElement = document.createElement("td");
			if(option == "attempts" && sum > 0)
				total.innerText = sum.toString();
			if(option == "errors" && count > 0)
				total.innerText = Math.round(100 * sum / count).toString() + "%";
			row.appendChild(total);
			tableBody.appendChild(row);
		}

		//set the total row
		const totalRow : HTMLTableRowElement = document.createElement("tr");

		const totalTitle2 : HTMLTableCellElement = document.createElement("th");
		totalTitle2.innerText = option == "attempts" ? "Σ" : "";
		totalRow.appendChild(totalTitle2);

		for(let i = 0; i <= 10; i++)
		{
			const cell : HTMLTableCellElement = document.createElement("td");

			if(option == "attempts" && columnsSum[i] > 0)
				cell.innerText = columnsSum[i].toString();

			if(option == "errors" && columnsCount[i] > 0)
				cell.innerText = Math.round(100 * columnsSum[i] / columnsCount[i]).toString() + "%";

			totalRow.appendChild(cell);
		}

		//set the last cell (total of total)
		const totalCell : HTMLTableCellElement = document.createElement("td");
		if(option == "attempts")
			totalCell.innerText = columnsSum.reduce((partial, a) => partial + a).toString();
		if(option == "errors")
		{
			const num : number = columnsSum.reduce((partial, a) => partial + a);
			const den : number = columnsCount.reduce((partial, a) => partial + a);
			totalCell.innerText = Math.round(100 * num / den).toString() + "%";
		}
		totalRow.appendChild(totalCell);
		tableBody.appendChild(document.createElement("tfoot").appendChild(totalRow));
	}
}