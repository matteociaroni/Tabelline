let num1, num2;
let tabellineSelezionate;

function init(random=true)
{
	if(random)
	{
		num1=getRandomInt(true).toString();
		num2=getRandomInt(false).toString();
	}

	document.getElementById("num1").innerHTML=num1;
	document.getElementById("num2").innerHTML=num2;
	document.getElementById("result").innerHTML="";
	document.getElementById("inserito").value="";
	document.getElementById("inserito").disabled="";
	document.getElementById("init-button").style.display="none";
	localStorage.setItem("num1", num1);
	localStorage.setItem("num2", num2);
}

function checkResult()
{
	const inserito=parseInt(document.getElementById("inserito").value);

	if(inserito===num1*num2)
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
	const tabelline=localStorage.getItem("tabellineSelezionate");
	if(tabelline!=null)
		tabellineSelezionate=tabelline.split(",");

	let n;
	if(check && tabellineSelezionate.length>1)
		n=tabellineSelezionate[Math.floor(Math.random()*(tabellineSelezionate.length-1))];
	else
		n=Math.floor(Math.random()*11);

	return n;
}

function restore()
{
	const oldNum1=localStorage.getItem("num1");
	const oldNum2=localStorage.getItem("num2");
	const tabelline=localStorage.getItem("tabellineSelezionate");
	if(tabelline!=null)
		tabellineSelezionate=tabelline.split(",");

	if(oldNum1!=null && oldNum2!=null)
	{
		num1=oldNum1;
		num2=oldNum2;
		init(false);
	}
	else
		init(true);


}

function updateSelected()
{
	let inputs=document.getElementsByTagName("input");
	tabellineSelezionate=Array();
	for(let i=0; i<inputs.length; i++)
	{
		if(inputs.item(i).checked===true)
		{
			tabellineSelezionate.push(inputs.item(i).id);
		}
	}
	localStorage.setItem("tabellineSelezionate", tabellineSelezionate);
}

function setSelected()
{
	const tabelline=localStorage.getItem("tabellineSelezionate");
	if(tabelline!=null)
		tabellineSelezionate=tabelline;

	let inputs=document.getElementsByTagName("input");
	for(let i=0; i<inputs.length; i++)
	{
		if(tabellineSelezionate.indexOf(inputs.item(i).id)>-1)
		{
			inputs.item(i).checked=true;
		}
	}
}