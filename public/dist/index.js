"use strict";

var container = document.querySelector('.container');

function buildGrid(rows, cols) {
  var grid = "";
  for (var i = 0; i < rows; i += 1) {
    for (var j = 0; j < cols; j += 1) {
      grid += "<span class='critter'";
      grid += "data-critter=" + i + j + " ";
      grid += "data-alive='false' ";
      grid += "data-next=' '></span>";
    }
    grid += "<br/>";
  }
  return grid;
}

container.innerHTML = buildGrid(10, 10);

var World = document.querySelectorAll('.critter');
var world21 = document.querySelector("[data-critter='21']");
var world212 = World[21];

console.log("world212.dataset.alive is: " + world21.dataset.alive);
console.log("world212 is: " + world212);
console.log("before world21.dataset.alive is: " + world21.dataset.alive);

world21.dataset.alive = false;

console.log("after world21.dataset.critter is: " + world21.dataset.alive);

World.forEach(function (current) {
  var i = Math.round(Math.random()) + 1;
  if (i > 1) {
    current.dataset.alive = 'true';
  }
});

document.querySelectorAll("[data-alive='true']").style.background = "red";

/* TODO:
// 1. Grab the container.
// 2. Run buildGrid(x,y)
3. Render critter
4. Profit.

*/