

function nextGeneration() {
  calculateFitness();

  for (let i = 0; i < POP_SIZE; i++) {
    population[i] = pickOne();
  }
  for (let i = 0; i < savedPop.length; i++) {
    savedPop[i].dispose()
  }
  savedPop = [];
  genCount++;
  console.log('\n=========================\nStarting generation ' + genCount);
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedPop[index].fitness;
    index++;
  }
  index--;
  let spaceship = savedPop[index];
  let child = new Spaceship(spaceship.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  let highestScore = -Infinity;
  let highestFitness = -Infinity;
  for (let spaceship of savedPop) {
    spaceship.calculateFitness();
    sum += spaceship.fitness;
  }
  for (let spaceship of savedPop) {
    if (spaceship.score > highestScore) {
      highestScore = spaceship.score;
    }
    if (spaceship.fitness > highestFitness) {
      highestFitness = spaceship.fitness;
    }
    spaceship.fitness = spaceship.fitness / sum; // Normalize fitness values
  }
  console.log("Highest score: " + highestScore)
  console.log("Highest fitness: " + highestFitness)
}
