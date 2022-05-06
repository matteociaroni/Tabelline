import { AttemptsForTable } from "./AttemptsForTable.js";
export class Stats {
    stats;
    constructor() {
        this.stats = new Array();
        for (let i = 0; i <= 10; i++)
            for (let j = 0; j <= 10; j++)
                this.stats.push(new AttemptsForTable(i, j));
    }
    pushAttempt(attempt) {
        this.getAttemptsForTable(attempt.num1, attempt.num2).push(attempt);
    }
    getAttemptsForTable(num1, num2) {
        for (let i = 0; i < this.stats.length; i++) {
            if (this.stats[i].num1 == num1 && this.stats[i].num2 == num2)
                return this.stats[i].attempts;
        }
    }
}
