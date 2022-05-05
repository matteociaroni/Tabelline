import { Game } from "./Game.js";
import { Attempt } from "./Attempt.js";
export class GraphicalGame {
    game;
    constructor() {
        this.game = new Game();
    }
    init(random = true) {
        this.game.init(random);
        document.getElementById("num1").innerHTML = this.game.getNum1().toString();
        document.getElementById("num2").innerHTML = this.game.getNum2().toString();
        document.getElementById("result").innerText = "";
        const inputNumber = document.getElementById("answer");
        inputNumber.value = "";
        inputNumber.removeAttribute("disabled");
        inputNumber.focus();
        const button = document.getElementById("button");
        button.setAttribute("value", "Controlla");
        button.classList.remove("is-success");
        button.classList.remove("is-danger");
        button.classList.add("is-info");
    }
    checkResult() {
        const inputNumber = document.getElementById("answer");
        const attemptValue = parseInt(inputNumber.value);
        if (!isNaN(attemptValue)) {
            const isCorrect = this.game.checkResult(attemptValue);
            const button = document.getElementById("button");
            button.classList.remove("is-info");
            if (isCorrect) {
                inputNumber.setAttribute("disabled", "true");
                button.setAttribute("value", "Avanti");
                button.classList.remove("is-danger");
                button.classList.add("is-success");
            }
            else {
                button.setAttribute("value", "Riprova");
                button.classList.add("is-danger");
            }
            document.getElementById("result").innerHTML = GraphicalGame.resultEmoji(isCorrect);
        }
    }
    /**
     * This method is executed when the button is pressed or when the user press the enter key
     */
    nextAction() {
        if (this.game.getStatus() === "playing")
            this.checkResult();
        else
            this.init(true);
    }
    static resultEmoji(success) {
        const successEmojis = ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳", "😸", "😺"];
        const failEmojis = ["😩", "😭", "😢", "☹️", "😞", "😩", "😿"];
        if (success)
            return successEmojis[Math.floor(Math.random() * successEmojis.length)];
        else
            return failEmojis[Math.floor(Math.random() * failEmojis.length)];
    }
    /**
     * Show all the attempts made by the user and stored in the localStorage
     */
    showAttempts(from, to) {
        const containerTable = document.getElementById("attempts");
        containerTable.innerText = "";
        const attempts = this.game.getAttempts();
        if (attempts != null) {
            for (let i = 0; i < attempts.length; i++) {
                const currentAttempt = Object.setPrototypeOf(attempts[i], Attempt.prototype);
                if ((from == null || from.toISOString() <= currentAttempt.timestamp) && (to == null || to.toISOString() > currentAttempt.timestamp)) {
                    const row = document.createElement("tr");
                    //row.classList.add(attempts[i].providedValue ==  attempts[i].num1 * attempts[i].num2 ? "is-success" : "is-danger");
                    const date = document.createElement("td");
                    date.innerText = new Date(currentAttempt.timestamp).toLocaleString("it-IT");
                    const operation = document.createElement("td");
                    operation.innerText = currentAttempt.num1 + " × " + currentAttempt.num2;
                    const answer = document.createElement("td");
                    answer.innerText = currentAttempt.providedValue.toString();
                    row.appendChild(date);
                    row.appendChild(operation);
                    row.appendChild(answer);
                    containerTable.appendChild(row);
                }
            }
        }
    }
    showStats(option) {
        const stats = this.game.getOrderedAttempts();
        const tableHead = document.getElementById("head");
        tableHead.innerHTML = "";
        tableHead.appendChild(document.createElement("th")); //fill empty cell
        //set the table head with numbers 0 to 10
        for (let i = 0; i <= 10; i++) {
            const el = document.createElement("th");
            el.innerHTML = i.toString();
            tableHead.appendChild(el);
        }
        const totalTitle1 = document.createElement("th");
        totalTitle1.innerText = option == "attempts" ? "Σ" : "";
        tableHead.appendChild(totalTitle1);
        const tableBody = document.getElementById("stats");
        tableBody.innerHTML = "";
        //these arrays are used to create the total row
        const columnsSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const columnsCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i <= 10; i++) {
            const row = document.createElement("tr");
            //create the first cell of the row
            const num1 = document.createElement("th");
            num1.innerHTML = i.toString();
            row.appendChild(num1);
            //these variables are used to create the total cell, the last cell of the row
            let sum = 0;
            let count = 0;
            for (let j = 0; j <= 10; j++) {
                const cell = document.createElement("td");
                let value = 0;
                if (option == "attempts") {
                    value = stats.getAttemptsForTable(i, j).length;
                    cell.innerHTML = value > 0 ? value.toString() : "";
                    sum += value;
                    count = 1;
                    columnsSum[j] += value;
                }
                if (option == "errors") {
                    value = 0;
                    const attempts = stats.getAttemptsForTable(i, j);
                    let countErrors = 0;
                    for (let k = 0; k < attempts.length; k++) {
                        if (attempts[k].num1 * attempts[k].num2 != attempts[k].providedValue)
                            countErrors++;
                    }
                    if (attempts.length == 0)
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
            const total = document.createElement("td");
            if (option == "attempts" && sum > 0)
                total.innerText = sum.toString();
            if (option == "errors" && count > 0)
                total.innerText = Math.round(100 * sum / count).toString() + "%";
            row.appendChild(total);
            tableBody.appendChild(row);
        }
        //set the total row
        const totalRow = document.createElement("tr");
        const totalTitle2 = document.createElement("th");
        totalTitle2.innerText = option == "attempts" ? "Σ" : "";
        totalRow.appendChild(totalTitle2);
        for (let i = 0; i <= 10; i++) {
            const cell = document.createElement("td");
            if (option == "attempts" && columnsSum[i] > 0)
                cell.innerText = columnsSum[i].toString();
            if (option == "errors" && columnsCount[i] > 0)
                cell.innerText = Math.round(100 * columnsSum[i] / columnsCount[i]).toString() + "%";
            totalRow.appendChild(cell);
        }
        //set the last cell (total of total)
        const totalCell = document.createElement("td");
        if (option == "attempts")
            totalCell.innerText = columnsSum.reduce((partial, a) => partial + a).toString();
        if (option == "errors") {
            const num = columnsSum.reduce((partial, a) => partial + a);
            const den = columnsCount.reduce((partial, a) => partial + a);
            totalCell.innerText = Math.round(100 * num / den).toString() + "%";
        }
        totalRow.appendChild(totalCell);
        tableBody.appendChild(document.createElement("tfoot").appendChild(totalRow));
    }
}
