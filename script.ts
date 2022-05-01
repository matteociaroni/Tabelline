class Num
{
	private id : string

	constructor(id : string)
	{
		this.id=id
	}

	getValue() : number
	{
		return parseInt(localStorage.getItem(this.id));
	}

	setValue(value : number) : void
	{
		localStorage.setItem(this.id, value.toString());
	}
}

class Game
{
	private num1 : Num
	private num2 : Num

	constructor()
	{
		this.num1=new Num("num1")
		this.num2=new Num("num2")
	}

	getTabellineSelezionate() : number[]
	{
		const selected = localStorage.getItem("tabellineSelezionate");
		if(selected != null)
			return selected.split(",").map(Number);
		else
			return Array();
	}

	setNumbers(random : boolean) : void
	{
		if(random || isNaN(this.num1.getValue()) || isNaN(this.num2.getValue()))
		{
			this.num1.setValue(this.getRandomInt(true));
			this.num2.setValue(this.getRandomInt(false));
		}
	}

	init(random : boolean = true) : void
	{
		this.setNumbers(random);

		document.getElementById("num1").innerHTML = this.num1.getValue().toString();
		document.getElementById("num2").innerHTML = this.num2.getValue().toString();
		document.getElementById("result").innerHTML = "";
		(<HTMLInputElement>document.getElementById("inserito")).value = "";
		document.getElementById("inserito").removeAttribute("disabled");
		document.getElementById("init-button").style.display = "none";
	}

	checkResult() : void
	{
		const inserito : number = parseInt((<HTMLInputElement>document.getElementById("inserito")).value);

		if(inserito == this.num1.getValue() * this.num2.getValue())
		{
			document.getElementById("result").innerHTML = "😊";
			document.getElementById("inserito").setAttribute("disabled", "true");
			document.getElementById("init-button").style.display = "";
		}
		else if(!isNaN(inserito))
			document.getElementById("result").innerHTML = "😞";
	}

	getRandomInt(check : boolean = false) : number
	{
		let n : number;

		if(check && this.getTabellineSelezionate().length > 0)
			n = this.getTabellineSelezionate()[Math.round(Math.random() * (this.getTabellineSelezionate().length - 1))];
		else
			n = Math.floor(Math.random() * 11);

		return n;
	}

	changeTabelline() : void
	{
		let inputs = document.getElementsByTagName("input");
		let tabellineSelezionate = Array();
		for (let i = 0; i < inputs.length; i++)
		{
			if(inputs.item(i).checked === true)
				tabellineSelezionate.push(inputs.item(i).id);
		}
		localStorage.setItem("tabellineSelezionate", tabellineSelezionate.toString());

		if(tabellineSelezionate.indexOf(this.num1.getValue()) < 0)
			localStorage.removeItem("num1");
	}

	setTabellineCheckboxes() : void
	{
		let inputs = document.getElementsByTagName("input");
		for (let i = 0; i < inputs.length; i++)
		{
			if(this.getTabellineSelezionate().indexOf(parseInt(inputs.item(i).id)) > -1)
				inputs.item(i).checked = true;
		}
	}
}

const g=new Game();