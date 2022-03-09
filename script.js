let num1, num2;

function init(random=true)
{
	if(random)
	{
		num1=getRandomInt().toString();
		num2=getRandomInt().toString();
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

function getRandomInt()
{
	return Math.floor(Math.random()*10);
}

function restore()
{
	const oldNum1=localStorage.getItem("num1");
	const oldNum2=localStorage.getItem("num2");
	if(oldNum1!=null && oldNum2!=null)
	{
		num1=oldNum1;
		num2=oldNum2;
		init(false);
	}
	else
		init(true);
}