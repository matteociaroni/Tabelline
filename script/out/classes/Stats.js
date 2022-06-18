import { AttemptsForTable } from "./AttemptsForTable.js";
export class Stats {
    stats;
    constructor() {
        this.stats = [];
        for (let i = 0; i <= 10; i++) {
            this.stats[i] = [];
            for (let j = 0; j <= 10; j++)
                this.stats[i][j] = new AttemptsForTable(i, j);
        }
    }
    pushAttempt(attempt) {
        this.getAttemptsForTable(attempt.num1, attempt.num2).push(attempt);
    }
    getAttemptsForTable(num1, num2) {
        return this.stats[num1][num2].attempts;
    }
}
