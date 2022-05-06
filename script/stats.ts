import {GraphicalGame} from "./classes/GraphicalGame.js";

const g = new GraphicalGame();
g.showStats(window.location.hash.substring(1) == "errors" ? "errors" : "attempts");

document.getElementById("show-attempts").addEventListener("click", function()
{
	g.showStats("attempts");
});

document.getElementById("show-errors").addEventListener("click", function()
{
	g.showStats("errors");
});