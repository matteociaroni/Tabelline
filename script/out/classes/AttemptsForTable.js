export class AttemptsForTable {
    _num1;
    _num2;
    _attempts;
    constructor(num1, num2) {
        this._num1 = num1;
        this._num2 = num2;
        this._attempts = new Array();
    }
    pushAttempt(attempt) {
        this._attempts.push(attempt);
    }
    get attempts() {
        return this._attempts;
    }
    get num1() {
        return this._num1;
    }
    get num2() {
        return this._num2;
    }
}
