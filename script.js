function getNum1() {
    return parseInt(localStorage.getItem("num1"));
}
function getNum2() {
    return parseInt(localStorage.getItem("num2"));
}
function getTabellineSelezionate() {
    const selected = localStorage.getItem("tabellineSelezionate");
    if (selected != null)
        return selected.split(",").map(Number);
    else
        return Array();
}
function setNum1(value) {
    localStorage.setItem("num1", value.toString());
}
function setNum2(value) {
    localStorage.setItem("num2", value.toString());
}
function init(random = true) {
    if (random || isNaN(getNum1()) || isNaN(getNum2())) {
        setNum1(getRandomInt(true));
        setNum2(getRandomInt(false));
    }
    document.getElementById("num1").innerHTML = getNum1().toString();
    document.getElementById("num2").innerHTML = getNum2().toString();
    document.getElementById("result").innerHTML = "";
    document.getElementById("inserito").value = "";
    document.getElementById("inserito").removeAttribute("disabled");
    document.getElementById("init-button").style.display = "none";
}
function checkResult() {
    const inserito = parseInt(document.getElementById("inserito").value);
    if (inserito == getNum1() * getNum2()) {
        document.getElementById("result").innerHTML = "😊";
        document.getElementById("inserito").setAttribute("disabled", "true");
        document.getElementById("init-button").style.display = "";
    }
    else if (!isNaN(inserito))
        document.getElementById("result").innerHTML = "😞";
}
function getRandomInt(check = false) {
    let n;
    if (check && getTabellineSelezionate().length > 0)
        n = getTabellineSelezionate()[Math.round(Math.random() * (getTabellineSelezionate().length - 1))];
    else
        n = Math.floor(Math.random() * 11);
    return n;
}
function updateSelected() {
    let inputs = document.getElementsByTagName("input");
    let tabellineSelezionate = Array();
    for (let i = 0; i < inputs.length; i++) {
        if (inputs.item(i).checked === true)
            tabellineSelezionate.push(inputs.item(i).id);
    }
    localStorage.setItem("tabellineSelezionate", tabellineSelezionate.toString());
    if (tabellineSelezionate.indexOf(getNum1()) < 0)
        localStorage.removeItem("num1");
}
function setSelected() {
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        if (getTabellineSelezionate().indexOf(parseInt(inputs.item(i).id)) > -1)
            inputs.item(i).checked = true;
    }
}
