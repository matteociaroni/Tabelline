import { Game } from "./Game.js";
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
        const inputNumber = document.getElementById("inserito");
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
        const inputNumber = document.getElementById("inserito");
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
    changeTables() {
        let inputs = document.getElementsByTagName("input");
        let selectedTables = Array();
        for (let i = 0; i < inputs.length; i++) {
            if (inputs.item(i).checked === true)
                selectedTables.push(inputs.item(i).id);
        }
        this.game.changeTables(selectedTables);
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
        const containerTable = document.getElementById("tentativi");
        const attempts = this.game.getAttempts();
        if (attempts != null) {
            for (let i = 0; i < attempts.length; i++) {
                const row = document.createElement("tr");
                //row.classList.add(attempts[i]._result ? "is-success" : "is-danger");
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
    setSelectedCheckboxes() {
        let inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (this.game.getSelectedTables().indexOf(parseInt(inputs.item(i).id)) > -1)
                inputs.item(i).checked = true;
        }
    }
    /**
     * Show all the possible tables (with checkboxes) in the settings page
     */
    static showTablesList() {
        const container = document.getElementById("tabelline");
        for (let i = 0; i <= 10; i++) {
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
