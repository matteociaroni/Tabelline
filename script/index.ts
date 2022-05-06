import {GraphicalGame} from "./classes/GraphicalGame.js";

const g = new GraphicalGame();
g.init(false);

document.addEventListener("keypress", function(event)
{
	if(event.key === "Enter")
		g.nextAction();
});

document.getElementById("button").addEventListener("click", function()
{
	g.nextAction();
})