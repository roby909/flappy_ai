var generation = 1;

function nextGeneration() {
    generation++;
    console.log("next generation");
    calculateFitness();

    for (let i = 0; i < TOTAL; i++) {
        birds[i] = pickOne();
    }

    savedBirds = [];
}

function pickOne() {    
    var index = 0;
    var r = random(1);

    while (r > 0) {
        r = r - savedBirds[index].fitness;
        index++;
    }
    index--;

    let bird = savedBirds[index];
    let child = new Bird(bird.brain);
    child.mutate(0.1);
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (let bird of savedBirds) {
        sum += bird.score;
    }

    /*let highestScore = 0;
    for (let bird of savedBirds) {
        if (bird.score > highestScore) {
            highestScore = bird.score;
        }
    }   */ 
    
    for (let bird of savedBirds) {
        bird.fitness = bird.score / sum;
    }
}