function getNum1()
{
	return localStorage.getItem("num1");
}

function getNum2()
{
	return localStorage.getItem("num2");
}

function getTabellineSelezionate()
{
	const selected=localStorage.getItem("tabellineSelezionate");
	if(selected!=null)
		return selected.split(",");
	else
		return Array();
}

function setNum1(value)
{
	localStorage.setItem("num1", value);
}

function setNum2(value)
{
	localStorage.setItem("num2", value);
}

function init(random=true)
{
	if(random || getNum1()==null || getNum2()==null)
	{
		setNum1(getRandomInt(true))
		setNum2(getRandomInt(false))
	}

	document.getElementById("num1").innerHTML=getNum1().toString();
	document.getElementById("num2").innerHTML=getNum2().toString();
	document.getElementById("result").innerHTML="";
	document.getElementById("inserito").value="";
	document.getElementById("inserito").disabled="";
	document.getElementById("init-button").style.display="none";
}

function checkResult()
{
	const inserito=parseInt(document.getElementById("inserito").value);

	if(inserito===getNum1()*getNum2())
	{
		document.getElementById("result").innerHTML="😊";
		document.getElementById("inserito").disabled="true";
		document.getElementById("init-button").style.display="";
	}
	else if(inserito!=null)
		document.getElementById("result").innerHTML="😞";
}

function getRandomInt(check=false)
{
	let n;
	if(check && getTabellineSelezionate().length>1)
		n=getTabellineSelezionate()[Math.floor(Math.random()*(getTabellineSelezionate().length-1))];
	else
		n=Math.floor(Math.random()*11);

	return n;
}

function updateSelected()
{
	let inputs=document.getElementsByTagName("input");
	let tabellineSelezionate=Array();
	for(let i=0; i<inputs.length; i++)
	{
		if(inputs.item(i).checked===true)
			tabellineSelezionate.push(inputs.item(i).id);
	}
	localStorage.setItem("tabellineSelezionate", tabellineSelezionate);
	if(tabellineSelezionate.indexOf(getNum1())<0)
		localStorage.removeItem("num1");
}

function setSelected()
{
	let inputs=document.getElementsByTagName("input");
	for(let i=0; i<inputs.length; i++)
	{
		if(getTabellineSelezionate().indexOf(inputs.item(i).id)>-1)
			inputs.item(i).checked=true;
	}
}