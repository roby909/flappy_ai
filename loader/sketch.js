// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// P5 exported functions (eslint flags)
/* exported preload, setup, draw, keyPressed */

// Exported sprites (eslint flags)
/* exported birdSprite, pipeBodySprite, pipePeakSprite */


var bird;
var brainJSON;
var pipes;
var parallax = 0.025;
var score = 0;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
var gameoverFrame = 0;
var isOver = false;
var slider;
var counter = 0;

var touched = false;
var prevTouched = touched;


function preload() {
  brainJSON = loadJSON("bird.json");
  pipeBodySprite = loadImage('graphics/pipe_marshmallow_fix.png');
  pipePeakSprite = loadImage('graphics/pipe_marshmallow_fix.png');
  birdSprite = loadImage('graphics/yellowbird-midflap.png');
  bgImg = loadImage('graphics/background.png');
}

function setup() {
  createCanvas(1280, 720);
  slider = createSlider(1, 100, 1);
  reset();
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 90 == 0) {
      pipes.push(new Pipe());
    }

    counter++;
    

    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      if (pipes[i].hits(bird)) {
        console.log("Collision");
      }
      
      if (pipes[i].pass(bird)) {
        score++;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    
    if (bird.offscreen())  {
      console.log("bottom");
    }
      
    bird.think(pipes);
    bird.update();
  }

  // All the drawing stuff
  background(0);

  // Draw our background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  if (pipes[0])
    bgX -= pipes[0].speed * parallax;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if (bgX <= -bgImg.width + width) {
    //image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }
  
  bird.show();

  for (let pipe of pipes) {
    pipe.show();
  }

  showScores();

}

function showScores() {
  textSize(32);
  text('score: ' + score, 1, 32);  
}

function gameover() {
  textSize(64);
  textAlign(CENTER, CENTER);
  text('GAMEOVER', width / 2, height / 2);
  textAlign(LEFT, BASELINE);  
  isOver = true;
  noLoop();
}

function reset() {
  isOver = false;
  score = 0;
  bgX = 0;
  pipes = [];

  birdBrain = NeuralNetwork.deserialize(brainJSON);
  bird = new Bird(birdBrain);

  gameoverFrame = frameCount - 1;
  loop();
}

// function keyPressed() {
//   if (key === ' ') {
//     bird.up();
//     if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
//   }
// }

function touchStarted() {
  if (isOver) reset();
}