export class Attempt {
    _timestamp;
    _num1;
    _num2;
    _providedValue;
    constructor(timestamp, num1, num2, providedValue) {
        this._timestamp = timestamp;
        this._num1 = num1;
        this._num2 = num2;
        this._providedValue = providedValue;
    }
    get timestamp() {
        return this._timestamp;
    }
    get num1() {
        return this._num1;
    }
    get num2() {
        return this._num2;
    }
    get providedValue() {
        return this._providedValue;
    }
}
