const container = document.querySelector('.container');

// Helper fn to pad index
// function digitPad(number) {
//   let digit = String(number);
//   if (digit.length < 2) {
//     digit = "0" + digit;
//   }
//   return digit;
// }

// Helper fns to clear data-attrs
function clearNext() {
  worldArray.forEach(function(element) {
    element.dataset.next = "";
  });
}


function critterGenocide() {
  worldArray.forEach(function(element, index) {
    let critter = World[index];
    critter.classList.remove('living');
    critter.classList.add('dead');
    critter.dataset.alive = 'false';
    critter.dataset.next = '';
    liveNeighbors();
  });
}

// Build the grid
function buildGrid(rows, cols) {
  let grid = "<div class='grid'>";
  for (let i = 0; i < rows; i += 1) {
    grid += `<div class='row row-${i}'>`;
    for (let j = 0; j < cols; j += 1) {
      grid += "<span class='critter'";
      grid += `data-critter-row='${i}' `;
      grid += `data-critter-col='${j}' `;
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
const World = document.querySelectorAll('.critter');
var worldArray = [...World];

console.log(World.length);

// Randomly populate world
function populateWorld() {
  worldArray.forEach(function(current) {
    let i = Math.round(Math.random() * 10);
    if (i < 3) {
      current.dataset.alive = 'true';
    }
  });
}


// Give every item a class - living or dead
function classifyLifeDeath() {
  worldArray.forEach(function(current) {
    if (current.dataset.alive === 'true') {
      current.classList.add('living');
    } else {
      current.classList.add('dead');
    }
  });
}

function reclassify() {
  worldArray.forEach(function(current) {
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
  worldArray.forEach(function(current, index) {
    let neighbors = 0; // counter
    current.dataset.livingneighbors = '0'; // reset
    const row = String(index)
      .slice(0, 1); // for test
    const col = String(index)
      .slice(1); // for test
    // simplify direction...ing
    const n = World[index - 10];
    const ne = World[index - 9];
    const e = World[index + 1];
    const se = World[index + 11];
    const s = World[index + 10];
    const sw = World[index + 9];
    const w = World[index - 1];
    const nw = World[index - 11];
    if (Boolean(n) && (n.dataset.alive === 'true') && (n.dataset.critterRow == (Number(row) - 1)) && (n.dataset.critterCol == Number(col))) {
      neighbors += 1;
    }
    if (Boolean(ne) && (ne.dataset.alive === 'true') && (ne.dataset.critterRow == (Number(row) - 1)) && (ne.dataset.critterCol == (Number(col) + 1))) {
      neighbors += 1;
    }
    if (Boolean(e) && (e.dataset.alive === 'true') && (e.dataset.critterRow == Number(row)) && (e.dataset.critterCol == (Number(col) + 1))) {
      neighbors += 1;
    }
    if (Boolean(se) && (se.dataset.alive === 'true') && (se.dataset.critterRow == (Number(row) + 1)) && (se.dataset.critterCol == (Number(col) + 1))) {
      neighbors += 1;
    }
    if (Boolean(s) && (s.dataset.alive === 'true') && (s.dataset.critterRow == (Number(row) + 1)) && (s.dataset.critterCol == Number(col))) {
      neighbors += 1;
    }
    if (Boolean(sw) && (sw.dataset.alive === 'true') && (sw.dataset.critterRow == (Number(row) + 1)) && (sw.dataset.critterCol == (Number(col) - 1))) {
      neighbors += 1;
    }
    if (Boolean(w) && (w.dataset.alive === 'true') && (w.dataset.critterRow == Number(row)) && (w.dataset.critterCol == (Number(col) - 1))) {
      neighbors += 1;
    }
    if (Boolean(nw) && (nw.dataset.alive === 'true') && (nw.dataset.critterRow == (Number(row) - 1)) && (nw.dataset.critterCol == (Number(col) -1))) {
      neighbors += 1;
    }
    World[index].dataset.livingneighbors = `${neighbors}`;
  });
}

// Stage life and death for next cycle
function stageLifeDeath() {
  worldArray.forEach(function(current) {
    // Underpopulation deaths
    if (current.dataset.alive === 'true' && Number(current.dataset.livingneighbors) < 2) {
      current.dataset.next = "dead";
    }
    // Persistence
    if (current.dataset.alive === 'true' && (Number(current.dataset.livingneighbors) === 2 || Number(current.dataset.livingneighbors) === 3)) {
      current.dataset.next = "alive";
    }
    // Overpopulation deaths
    if (current.dataset.alive === 'true' && Number(current.dataset.livingneighbors) > 3) {
      current.dataset.next = "dead";
    }
    // Rebirth by reproduction
    if (current.dataset.alive === 'false' && Number(current.dataset.livingneighbors) == '3') {
      current.dataset.next = "alive";
    }
    // Persistent death
    // else {
    //   World[index].dataset.next = "dead";
    // }
  });
}

function iterate() {
  console.log('clicked');
  worldArray.forEach(function(current) {
    if (current.dataset.next === "alive") {
      current.classList.add('living');
      current.classList.remove('dead');
      current.dataset.alive = 'true';
    }
    if (current.dataset.next === "dead") {
      current.classList.add('dead');
      current.classList.remove('living');
      current.dataset.alive = 'false';
    }
  });
  clearNext();
  liveNeighbors();
  stageLifeDeath();
}

const itr = document.querySelector('[data-action="iterator"]');

itr.addEventListener('click', function(evt) {
  evt.preventDefault();
  iterate();
});

const repopulate = document.querySelector('[data-action="repopulate"]');

repopulate.addEventListener('click', function(evt) {
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

// function testNeighbors() {
//   worldArray.forEach(function(current, index) {
//     if (current === World[45]) {
//       const i = String(index)
//         .slice(0, 1);
//       const j = String(index)
//         .slice(1);
//       if ((World[index + 1].dataset.critterRow == Number(i)) && (World[index + 1].dataset.critterCol == (Number(j) + 1))) {
//         World[index + 1].style.background = "cyan";
//       }
//     }
//   });
// }
//
// testNeighbors();
