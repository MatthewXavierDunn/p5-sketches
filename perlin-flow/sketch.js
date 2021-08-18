const pRadius = 2;
const nParticles = 2000;
const noiseScale = 0.01;

p5.disableFriendlyErrors = true;

let particles = [];

class Particle extends p5.Vector {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
    this.v = createVector();
    particles.push(this);
  }
  
  update() {
    const angle = noise(this.x * noiseScale, this.y * noiseScale, frameCount * noiseScale) * TWO_PI;
    this.v.add(createVector(0, 1).rotate(angle));
    this.v.mult(0.8);
    this.add(this.v);
    
    // this.x = constrain(this.x, 0, width);
    // this.y = constrain(this.y, 0, height);
    
    if (this.x > width) this.x -= width;
    if (this.x < 0) this.x += width;
    
    if (this.y > height) this.y -= height;
    if (this.y < 0) this.y += height;
  }
  
  draw() {
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

function setup() {
  createCanvas(800, 800);
  
  for (let i = 0; i < nParticles; i ++) {
    new Particle(random(width), random(height), pRadius);
  }
  
  background(0);
  noStroke();
  fill(255, 5);
}

function draw() {
  particles.map(p => p.update());
  particles.map(p => p.draw());
}