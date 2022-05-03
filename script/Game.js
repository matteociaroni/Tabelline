import { Num } from "./Num.js";
import { Attempt } from "./Attempt.js";
import { Stats } from "./Stats.js";
export class Game {
    num1;
    num2;
    status;
    constructor() {
        this.num1 = new Num("num1");
        this.num2 = new Num("num2");
        if (this.status === "solved")
            this.init(true);
    }
    getNum1() {
        return this.num1.getValue();
    }
    getNum2() {
        return this.num2.getValue();
    }
    getStatus() {
        return this.status;
    }
    getSelectedTables() {
        const loaded = localStorage.getItem("tabellineSelezionate");
        if (loaded != "" && loaded != null)
            return loaded.split(",").map(Number);
        else
            return Array();
    }
    setNumbers(random) {
        if (random || isNaN(this.num1.getValue()) || isNaN(this.num2.getValue())) {
            this.num1.setValue(this.getRandomInt(true));
            this.num2.setValue(this.getRandomInt(false));
        }
    }
    init(random = true) {
        this.status = "playing";
        this.setNumbers(random);
    }
    checkResult(attemptValue) {
        if (!isNaN(attemptValue)) {
            const isCorrect = attemptValue === this.num1.getValue() * this.num2.getValue();
            this.storeAttempt(attemptValue);
            if (isCorrect)
                this.status = "solved";
            return isCorrect;
        }
        return false;
    }
    /**
     * @return a random integer
     * @param check specifies if the number must be included in the currently selected times tables
     */
    getRandomInt(check = false) {
        let n;
        if (check && this.getSelectedTables().length > 0)
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
    changeTables(selectedTables) {
        localStorage.setItem("tabellineSelezionate", selectedTables.toString());
        if (selectedTables.indexOf(this.num1.getValue()) < 0)
            localStorage.removeItem("num1");
    }
    /**
     * Store the current attempt in localStorage
     * @param provided the value provided by the user for the current attempt
     */
    storeAttempt(provided) {
        let attempts = JSON.parse(localStorage.getItem("tentativi"));
        if (attempts == null)
            attempts = new Array();
        attempts.push(new Attempt(new Date(), this.num1.getValue(), this.num2.getValue(), provided));
        localStorage.setItem("tentativi", JSON.stringify(attempts));
    }
    getAttempts() {
        const loaded = localStorage.getItem("tentativi");
        let attempts = Array();
        if (loaded != null)
            attempts = JSON.parse(loaded);
        return attempts;
    }
    getOrderedAttempt() {
        const attempts = this.getAttempts();
        if (attempts == null)
            return;
        let stats = new Stats();
        for (let i = 0; i < attempts.length; i++) {
            stats.pushAttempt(attempts[i]);
        }
        return stats;
    }
}
