class Num
{
	private readonly id : string;

	constructor(id : string)
	{
		this.id = id;
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
	private num1 : Num;
	private num2 : Num;
	private status : "playing" | "solved";
	private tentativi : Array<Tentativo>;

	constructor()
	{
		this.num1 = new Num("num1");
		this.num2 = new Num("num2");
		this.tentativi=new Array<Tentativo>();

		if(this.status === "solved")
			this.init(true);
	}

	getStatus() : string
	{
		return this.status;
	}

	getTabellineSelezionate() : number[]
	{
		const selected = localStorage.getItem("tabellineSelezionate");
		if(selected != "")
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
		this.status = "playing";
		this.setNumbers(random);

		document.getElementById("num1").innerHTML = this.num1.getValue().toString();
		document.getElementById("num2").innerHTML = this.num2.getValue().toString();
		document.getElementById("result").innerHTML = "";

		const input=(<HTMLInputElement>document.getElementById("inserito"));
		input.value = "";
		input.removeAttribute("disabled");
		input.focus();

		const button = document.getElementById("button");
		button.setAttribute("value", "Controlla");
		button.classList.remove("is-success");
		button.classList.remove("is-danger");
		button.classList.add("is-info");
	}

	checkResult() : void
	{
		const inserito : number = parseInt((<HTMLInputElement>document.getElementById("inserito")).value);
		const button = document.getElementById("button");

		if(!isNaN(inserito))
		{
			let emojis;
			button.classList.remove("is-info");
			const corretto=inserito === this.num1.getValue() * this.num2.getValue();
			this.nuovoTentativo(corretto);
			emojis=Game.resultEmoji(corretto);

			if(corretto)
			{
				this.status = "solved";
				document.getElementById("inserito").setAttribute("disabled", "true");

				button.setAttribute("value", "Avanti");
				button.classList.remove("is-danger");
				button.classList.add("is-success");
			}
			else
			{
				button.setAttribute("value", "Riprova");
				button.classList.add("is-danger");
			}
			document.getElementById("result").innerHTML = emojis[Math.floor(Math.random()*emojis.length)];
		}
	}

	getRandomInt(check : boolean = false) : number
	{
		let n : number;

		if(check && this.getTabellineSelezionate().length > 0)
			n = this.getTabellineSelezionate()[Math.round(Math.random() * (this.getTabellineSelezionate().length - 1))];
		else
			n = Math.round(Math.random() * 10);

		return n;
	}

	changeTabelline() : void
	{
		let inputs = document.getElementsByTagName("input");
		let tabellineSelezionate = Array();
		for(let i = 0; i < inputs.length; i++)
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
		for(let i = 0; i < inputs.length; i++)
		{
			if(this.getTabellineSelezionate().indexOf(parseInt(inputs.item(i).id)) > -1)
				inputs.item(i).checked = true;
		}
	}

	nextAction()
	{
		if(g.getStatus() === "playing")
			g.checkResult();
		else
			g.init(true);
	}

	nuovoTentativo(esito : boolean) : void
	{
		const caricato=JSON.parse(localStorage.getItem("tentativi"));

		if(caricato != null)
			this.tentativi=caricato;

		this.tentativi.push(new Tentativo(new Date(), this.num1.getValue(), this.num2.getValue(), esito));
		localStorage.setItem("tentativi", JSON.stringify(this.tentativi));
	}

	static resultEmoji(success : boolean) : string[]
	{
		if(success)
			return ["🏆", "🥇", "🏅", "😃", "😄", "😊", "😀", "🎊", "🎉", "🥳"];
		else
			return ["😩", "😭", "😢", "☹️", "😞", "😩"];
	}

	loadTentativi()
	{
		const tabella=document.getElementById("tentativi");
		const caricato=localStorage.getItem("tentativi");
		if(caricato!=null)
		{
			const tentativi=JSON.parse(caricato);

			for(let i=0; i<tentativi.length;  i++)
			{
				const riga=document.createElement("tr");
				riga.classList.add(tentativi[i]._esito ? "is-success" : "is-danger");
				const data=document.createElement("td");
				data.innerText=new Date(tentativi[i]._timestamp).toLocaleString("it-IT");
				const operazione=document.createElement("td");
				operazione.innerText=tentativi[i]._num1+" × "+tentativi[i]._num2;
				riga.appendChild(data);
				riga.appendChild(operazione);
				tabella.appendChild(riga);
			}
		}
	}

	static loadTabelline()
	{
		const tabelline=document.getElementById("tabelline");

		for(let i=0; i<=10;  i++)
		{
			const label=document.createElement("label");
			label.setAttribute("for", i.toString());
			label.innerText="Tabellina "+i+" ";
			const input=document.createElement("input");
			input.setAttribute("type", "checkbox");
			input.id=i.toString();
			tabelline.appendChild(label);
			tabelline.appendChild(input);
			tabelline.appendChild(document.createElement("br"));
		}
	}
}

class Tentativo
{
	private readonly _timestamp : Date
	private readonly _num1 : number;
	private readonly _num2 : number;
	private readonly _esito : boolean

	constructor(timestamp : Date, num1 : number, num2 : number, esito : boolean)
	{
		this._timestamp=timestamp;
		this._num1=num1;
		this._num2=num2;
		this._esito=esito;
	}

	get timestamp() : Date
	{
		return this._timestamp;
	}

	get num1() : number
	{
		return this._num1;
	}

	get num2() : number
	{
		return this._num2;
	}

	get esito() : boolean
	{
		return this._esito;
	}
}

const g = new Game();