import {GraphicalGame} from "./classes/GraphicalGame.js";

(<HTMLInputElement>document.getElementById("date-from")).value = new Date().toISOString().substring(0, 10);

const g = new GraphicalGame();
update();

document.getElementById("date-from").addEventListener("change", function ()
{
	update();
});

document.getElementById("date-to").addEventListener("change", function ()
{
	update();
});

function update()
{
	let from: Date = new Date((<HTMLInputElement>document.getElementById("date-from")).value);
	let to: Date = new Date((<HTMLInputElement>document.getElementById("date-to")).value);
	to.setDate(to.getDate() + 1);

	if(isNaN(from.getDate()))
		from = null;

	if(isNaN(to.getDate()))
		to = null;

	g.showAttempts(from, to);
}