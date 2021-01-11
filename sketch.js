
const BOUNDS = 20;

const POP_SIZE = 20;
let population = [];
let savedPop = [];
const SIGHT = 350;
const LIFESPAN = 170;
const MUTATION_RATE = 0.08;
const RANGE = 70;
const REWARD = 40;

const NUM_ASTEROIDS = 50;
let asteroids = [];

let cyclesSlider;
let showBullets = true;
let showRays = true;
let genCount = 1;

function setup() {
  createCanvas(1280, 720);
  cyclesSlider = createSlider(1, 50, 2);

  generateAsteroids();

  for (let i = 0; i < POP_SIZE; i++) {
    population.push(new Spaceship());
  }
  console.log('=========================\nStarting generation ' + genCount);
}

function draw() {
  background(20); // Move this back to where it belongs
  let cycles = cyclesSlider.value();

  for (let n = 0; n < cycles; n++) {
    for (let i = population.length-1; i >= 0; i--) {
      let spaceship = population[i];
      spaceship.checkDeath(asteroids);
      if (spaceship.dead) {
        savedPop.push(population.splice(i, 1)[0]);
      } else {
        spaceship.cast(asteroids);
        spaceship.update();
      }
    }

    if (population.length === 0) {
      nextGeneration();
      generateAsteroids();
    }
  }

  for (let obstacle of asteroids) {
    obstacle.show();
  }
  for (let spaceship of population) {
    spaceship.show();
  }
}

function generateAsteroids() {
  asteroids = [];
  for (let i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Obstacle(random(BOUNDS, width-BOUNDS), random(BOUNDS, height-BOUNDS)));
  }
}


loopBool = true;
function keyPressed() {
  if (key === " ") {
    if (loopBool) {
      noLoop();
      loopBool = !loopBool;
    } else {
      loop();
      loopBool = !loopBool;
    }
  } else if (key == 'b') {
    showBullets = !showBullets;
  } else if (key == 'r') {
    showRays = !showRays;
  }
}
