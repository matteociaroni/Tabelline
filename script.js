class Num {
    id;
    constructor(id) {
        this.id = id;
    }
    getValue() {
        return parseInt(localStorage.getItem(this.id));
    }
    setValue(value) {
        localStorage.setItem(this.id, value.toString());
    }
}
class Game {
    num1;
    num2;
    status;
    constructor() {
        this.num1 = new Num("num1");
        this.num2 = new Num("num2");
        if (this.status === "solved")
            this.init(true);
    }
    getStatus() {
        return this.status;
    }
    getTabellineSelezionate() {
        const selected = localStorage.getItem("tabellineSelezionate");
        if (selected != "")
            return selected.split(",").map(Number);
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
        document.getElementById("num1").innerHTML = this.num1.getValue().toString();
        document.getElementById("num2").innerHTML = this.num2.getValue().toString();
        document.getElementById("result").innerHTML = "";
        document.getElementById("inserito").value = "";
        document.getElementById("inserito").removeAttribute("disabled");
        document.getElementById("inserito").focus();
        const button = document.getElementById("button");
        button.setAttribute("value", "Controlla");
        button.classList.remove("is-success");
        button.classList.remove("is-danger");
        button.classList.add("is-info");
    }
    checkResult() {
        const inserito = parseInt(document.getElementById("inserito").value);
        const button = document.getElementById("button");
        if (inserito === this.num1.getValue() * this.num2.getValue()) {
            this.status = "solved";
            const emojis = Game.resultEmoji(true);
            document.getElementById("result").innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            document.getElementById("inserito").setAttribute("disabled", "true");
            button.setAttribute("value", "Avanti");
            button.classList.remove("is-info");
            button.classList.remove("is-danger");
            button.classList.add("is-success");
        }
        else if (!isNaN(inserito)) {
            const emojis = Game.resultEmoji(false);
            document.getElementById("result").innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            button.setAttribute("value", "Riprova");
            button.classList.remove("is-info");
            button.classList.add("is-danger");
        }
    }
    getRandomInt(check = false) {
        let n;
        if (check && this.getTabellineSelezionate().length > 0)
            n = this.getTabellineSelezionate()[Math.round(Math.random() * (this.getTabellineSelezionate().length - 1))];
        else
            n = Math.round(Math.random() * 10);
        return n;
    }
    changeTabelline() {
        let inputs = document.getElementsByTagName("input");
        let tabellineSelezionate = Array();
        for (let i = 0; i < inputs.length; i++) {
            if (inputs.item(i).checked === true)
                tabellineSelezionate.push(inputs.item(i).id);
        }
        localStorage.setItem("tabellineSelezionate", tabellineSelezionate.toString());
        if (tabellineSelezionate.indexOf(this.num1.getValue()) < 0)
            localStorage.removeItem("num1");
    }
    setTabellineCheckboxes() {
        let inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (this.getTabellineSelezionate().indexOf(parseInt(inputs.item(i).id)) > -1)
                inputs.item(i).checked = true;
        }
    }
    nextAction() {
        if (g.getStatus() === "playing")
            g.checkResult();
        else
            g.init(true);
    }
    static resultEmoji(success) {
        if (success)
            return ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳"];
        else
            return ["😩", "😭", "😢", "☹️", "😞", "😩"];
    }
}
const g = new Game();
