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
        const successEmojis = ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳"];
        const failEmojis = ["😩", "😭", "😢", "☹️", "😞", "😩"];
        if (success)
            return successEmojis[Math.floor(Math.random() * successEmojis.length)];
        else
            return failEmojis[Math.floor(Math.random() * failEmojis.length)];
    }
    /**
     * Show all the attempts made by the user and stored in the localStorage
     */
    showAttempts() {
        const containerTable = document.getElementById("attempts");
        const attempts = this.game.getAttempts();
        if (attempts != null) {
            for (let i = 0; i < attempts.length; i++) {
                const currentAttempt = Object.setPrototypeOf(attempts[i], Attempt.prototype);
                const row = document.createElement("tr");
                //row.classList.add(attempts[i]._providedValue ==  attempts[i]._num1 * attempts[i]._num2 ? "is-success" : "is-danger");
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
    showStats(option) {
        const stats = this.game.getOrderedAttempts();
        const tableHead = document.getElementById("head");
        tableHead.innerHTML = "";
        const el = document.createElement("th");
        el.innerHTML = "";
        tableHead.appendChild(el);
        for (let i = 0; i <= 10; i++) {
            const el = document.createElement("th");
            el.innerHTML = i.toString();
            tableHead.appendChild(el);
        }
        const tableBody = document.getElementById("stats");
        tableBody.innerHTML = "";
        for (let i = 0; i <= 10; i++) {
            const row = document.createElement("tr");
            const num1 = document.createElement("th");
            num1.innerHTML = i.toString();
            row.appendChild(num1);
            for (let j = 0; j <= 10; j++) {
                const el = document.createElement("td");
                let value = "";
                if (option == "attempts")
                    value = stats.getAttemptsForTable(i, j).length.toString();
                if (value == "0")
                    value = "";
                if (option == "errors") {
                    value = "";
                    const attempts = stats.getAttemptsForTable(i, j);
                    let countErrors = 0;
                    for (let k = 0; k < attempts.length; k++) {
                        if (attempts[k].num1 * attempts[k].num2 != attempts[k].providedValue)
                            countErrors++;
                    }
                    if (attempts.length == 0)
                        value = "";
                    else
                        value = Math.round(100 * countErrors / attempts.length) + "%";
                }
                el.innerHTML = value;
                row.appendChild(el);
            }
            tableBody.appendChild(row);
        }
    }
}
