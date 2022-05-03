export class AttemptsForTable {
    _num1;
    _num2;
    attempts;
    constructor(num1, num2) {
        this._num1 = num1;
        this._num2 = num2;
        this.attempts = new Array();
    }
    pushAttempt(attempt) {
        this.attempts.push(attempt);
    }
    getAttempts() {
        return this.attempts;
    }
    get num1() {
        return this._num1;
    }
    get num2() {
        return this._num2;
    }
}
