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
    tentativi;
    constructor() {
        this.num1 = new Num("num1");
        this.num2 = new Num("num2");
        this.tentativi = new Array();
        if (this.status === "solved")
            this.init(true);
    }
    getStatus() {
        return this.status;
    }
    getTabellineSelezionate() {
        const selected = localStorage.getItem("tabellineSelezionate");
        if (selected != "" && selected != null)
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
        const input = document.getElementById("inserito");
        input.value = "";
        input.removeAttribute("disabled");
        input.focus();
        const button = document.getElementById("button");
        button.setAttribute("value", "Controlla");
        button.classList.remove("is-success");
        button.classList.remove("is-danger");
        button.classList.add("is-info");
    }
    checkResult() {
        const inserito = parseInt(document.getElementById("inserito").value);
        const button = document.getElementById("button");
        if (!isNaN(inserito)) {
            let emojis;
            button.classList.remove("is-info");
            const corretto = inserito === this.num1.getValue() * this.num2.getValue();
            this.nuovoTentativo(corretto);
            emojis = Game.resultEmoji(corretto);
            if (corretto) {
                this.status = "solved";
                document.getElementById("inserito").setAttribute("disabled", "true");
                button.setAttribute("value", "Avanti");
                button.classList.remove("is-danger");
                button.classList.add("is-success");
            }
            else {
                button.setAttribute("value", "Riprova");
                button.classList.add("is-danger");
            }
            document.getElementById("result").innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
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
    nuovoTentativo(esito) {
        const caricato = JSON.parse(localStorage.getItem("tentativi"));
        if (caricato != null)
            this.tentativi = caricato;
        this.tentativi.push(new Tentativo(new Date(), this.num1.getValue(), this.num2.getValue(), esito));
        localStorage.setItem("tentativi", JSON.stringify(this.tentativi));
    }
    static resultEmoji(success) {
        if (success)
            return ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳"];
        else
            return ["😩", "😭", "😢", "☹️", "😞", "😩"];
    }
    loadTentativi() {
        const tabella = document.getElementById("tentativi");
        const caricato = localStorage.getItem("tentativi");
        if (caricato != null) {
            const tentativi = JSON.parse(caricato);
            for (let i = 0; i < tentativi.length; i++) {
                const riga = document.createElement("tr");
                riga.classList.add(tentativi[i]._esito ? "is-success" : "is-danger");
                const data = document.createElement("td");
                data.innerText = new Date(tentativi[i]._timestamp).toLocaleString("it-IT");
                const operazione = document.createElement("td");
                operazione.innerText = tentativi[i]._num1 + " × " + tentativi[i]._num2;
                riga.appendChild(data);
                riga.appendChild(operazione);
                tabella.appendChild(riga);
            }
        }
    }
    static loadTabelline() {
        const tabelline = document.getElementById("tabelline");
        for (let i = 0; i <= 10; i++) {
            const label = document.createElement("label");
            label.setAttribute("for", i.toString());
            label.innerText = "Tabellina " + i + " ";
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.id = i.toString();
            tabelline.appendChild(label);
            tabelline.appendChild(input);
            tabelline.appendChild(document.createElement("br"));
        }
    }
}
class Tentativo {
    _timestamp;
    _num1;
    _num2;
    _esito;
    constructor(timestamp, num1, num2, esito) {
        this._timestamp = timestamp;
        this._num1 = num1;
        this._num2 = num2;
        this._esito = esito;
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
    get esito() {
        return this._esito;
    }
}
const g = new Game();
