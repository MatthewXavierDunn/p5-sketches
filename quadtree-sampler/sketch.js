var quadTree;
var mouseHeld = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
  
  quadTree = new QuadTree(0, 0, width , height, 10);
  
  background(255);
  strokeWeight(1);
  stroke(0);
}

function draw() {
  background(255);
  
  if (mouseIsPressed) {
    if (!mouseHeld) {
      mouseHeld = true;
      new Particle(mouseX, mouseY, Constants.START_LENGTH);
    }
  } else {
    mouseHeld = false;
  }
  
  new Particle(random(width), random(height), Constants.START_LENGTH);
  
  quadTree.draw();
}