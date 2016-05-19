"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var container = document.querySelector('.container');

// Helper fn to pad index
function digitPad(number) {
  var digit = String(number);
  if (digit.length < 2) {
    digit = "0" + digit;
  }
  return digit;
}

// Helper fns to clear data-attrs
function clearNext() {
  worldArray.forEach(function (element) {
    element.dataset.next = "";
  });
}

function critterGenocide() {
  worldArray.forEach(function (element, index) {
    var critter = World[index];
    critter.classList.remove('living');
    critter.classList.add('dead');
    critter.dataset.alive = 'false';
    critter.dataset.next = '';
    liveNeighbors();
  });
}

// Build the grid
function buildGrid(rows, cols) {
  var grid = "<div class='grid'>";
  for (var i = 0; i < rows; i += 1) {
    grid += "<div class='row row-" + i + "'>";
    for (var j = 0; j < cols; j += 1) {
      grid += "<span class='critter'";
      grid += "data-critter-row='" + i + "' ";
      grid += "data-critter-col='" + j + "' ";
      grid += "data-alive='false' ";
      grid += "data-livingneighbors=0 ";
      grid += "data-next=''>";
      grid += "</span>";
    }
    grid += "</div>";
  }
  grid += "</div>";
  return grid;
}

container.innerHTML = buildGrid(10, 10);

// Get all critters and an array to work with them
var World = document.querySelectorAll('.critter');
var worldArray = [].concat(_toConsumableArray(World));

console.log(World.length);

// Randomly populate world
function populateWorld() {
  worldArray.forEach(function (current) {
    var i = Math.round(Math.random() * 10);
    if (i < 3) {
      current.dataset.alive = 'true';
    }
  });
}

// Give every item a class - living or dead
function classifyLifeDeath() {
  worldArray.forEach(function (current) {
    if (current.dataset.alive === 'true') {
      current.classList.add('living');
    } else {
      current.classList.add('dead');
    }
  });
}

function reclassify() {
  worldArray.forEach(function (current) {
    if (current.dataset.alive === 'true') {
      current.classList.add('living');
      current.classList.remove('dead');
    } else {
      current.classList.add('dead');
      current.classList.remove('living');
    }
  });
}
// Count up each item's live neighbors
function liveNeighbors() {
  worldArray.forEach(function (current, index) {
    var neighbors = 0;
    current.dataset.livingneighbors = '0';
    if (!!World[index + 1] && World[index + 1].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index - 1] && World[index - 1].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index + 9] && World[index + 9].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index - 9] && World[index - 9].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index + 10] && World[index + 10].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index - 10] && World[index - 10].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index + 11] && World[index + 11].dataset.alive === 'true') {
      neighbors += 1;
    }
    if (!!World[index - 11] && World[index - 11].dataset.alive === 'true') {
      neighbors += 1;
    }
    World[index].dataset.livingneighbors = "" + neighbors;
  });
}

// Stage life and death for next cycle
function stageLifeDeath() {
  worldArray.forEach(function (current, index) {
    // Underpopulation deaths
    if (World[index].dataset.alive === 'true' && Number(World[index].dataset.livingneighbors) < 2) {
      World[index].dataset.next = "dead";
    }
    // Persistence
    if (World[index].dataset.alive === 'true' && (Number(World[index].dataset.livingneighbors) === 2 || Number(World[index].dataset.livingneighbors) === 3)) {
      World[index].dataset.next = "alive";
    }
    // Overpopulation deaths
    if (World[index].dataset.alive === 'true' && Number(World[index].dataset.livingneighbors) > 3) {
      World[index].dataset.next = "dead";
    }
    // Rebirth by reproduction
    if (World[index].dataset.alive === 'false' && Number(World[index].dataset.livingneighbors) == '3') {
      World[index].dataset.next = "alive";
    }
    // Persistent death
    // else {
    //   World[index].dataset.next = "dead";
    // }
  });
}

function iterate() {
  console.log('clicked');
  worldArray.forEach(function (current, index) {
    if (World[index].dataset.next === "alive") {
      var idx = digitPad(index);
      document.querySelector("[data-critter=\"" + idx + "\"]").classList.add('living');
      document.querySelector("[data-critter=\"" + idx + "\"]").classList.remove('dead');
      World[index].dataset.alive = 'true';
    }
    if (World[index].dataset.next === "dead") {
      var _idx = digitPad(index);
      document.querySelector("[data-critter=\"" + _idx + "\"]").classList.add('dead');
      document.querySelector("[data-critter=\"" + _idx + "\"]").classList.remove('living');
      World[index].dataset.alive = 'false';
    }
  });
  clearNext();
  liveNeighbors();
  stageLifeDeath();
}

var itr = document.querySelector('[data-action="iterator"]');

itr.addEventListener('click', function (evt) {
  evt.preventDefault();
  iterate();
});

var repopulate = document.querySelector('[data-action="repopulate"]');

repopulate.addEventListener('click', function (evt) {
  evt.preventDefault();
  critterGenocide();
  populateWorld();
  reclassify();
  liveNeighbors();
  stageLifeDeath();
});

populateWorld();
classifyLifeDeath();
liveNeighbors();
stageLifeDeath();

// function testForEach() {
//   worldArray.forEach(function(current) {
//     if (current.dataset.critter == "45") {
//       current.style.background = "blue";
//     }
//   });
// }
// testForEach();

// worldArray[value].dataset.critter.slice(0, 1);
// worldArray[value].dataset.critter.slice(1);

function testNeighbors() {
  worldArray.forEach(function (current, index) {
    if (current === World[45]) {
      var i = String(index).slice(0, 1);
      var j = String(index).slice(1);
      if (World[index + 1].dataset.critterRow == Number(i) && World[index + 1].dataset.critterCol == Number(j) + 1) {
        World[index + 1].style.background = "cyan";
      }
    }
  });
}

testNeighbors();