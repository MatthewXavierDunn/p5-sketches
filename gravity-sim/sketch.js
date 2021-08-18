var particles = [];
const G = 0.1;

var mouseHeld = false;
var pMousePos = [0, 0];
var pSize = 0;
var focusParticle;

p5.disableFriendlyErrors = true;

class Particle {
  constructor(x = random(0, width), y = random(0, height), r = random(10, 20), fixed=false) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = createVector(0, 0);
    this.m = PI * r * r;
    this.fixed = fixed;
    this.path = [];
    particles.push(this);
  }

  update() {
    if (this.fixed) return;
    particles.forEach(p => {
      if (p === this) return;

      const d = dist(this.x, this.y, p.x, p.y);
      const t = atan2(p.y - this.y, p.x - this.x);
      const r2 = this.r / 2 + p.r / 2

      if (d < r2) {
        return;
      }

      const f = (G * this.m * p.m) / (d * d);
      const a = f / this.m;

      this.v.x += a * cos(t);
      this.v.y += a * sin(t);
    });
    
    this.path.push([this.x, this.y]);

    this.x += this.v.x;
    this.y += this.v.y;
  }

  draw() {
    noFill();
    stroke(0, 100);
    beginShape();
    this.path.forEach(point => {
      vertex(point[0], point[1]);
    });
    if (this.path.length > 100) {
      this.path.shift()
    }
    endShape();
    stroke(100);
    fill(255);
    ellipse(this.x, this.y, this.r);
  }
  
  calcCollisionVel(p) {
    const mag = ((this.m - p.m) / (this.m + p.m)) * this.v.mag() + ((2 * p.m) / (this.m + p.m)) * p.v.mag();
    
    const v = createVector(this.v.x, this.v.y);
    
    const centreToCentre = createVector(p.x - this.x, p.y - this.y);
    const theta = acos(centreToCentre.dot(this.v) / (centreToCentre.mag() * this.v.mag()));
    v.rotate(2 * theta);
    v.mult(-1);
    v.setMag(mag);
    return v;
  }
}

function setup() {
  createCanvas(800, 800);
  
  new Particle(width / 2, height / 2, 100, true);
}

function draw() {
  background(220);

  if (mouseIsPressed) {
    if (!mouseHeld) pMousePos = [mouseX, mouseY];
    mouseHeld = true;
    pSize += 0.5;
    ellipse(mouseX, mouseY, pSize);
    line(pMousePos[0], pMousePos[1], mouseX, mouseY);
  } else {
    if (mouseHeld) {
      let p = new Particle(mouseX, mouseY, pSize);
      p.v.x = (pMousePos[0] - mouseX) * 0.1;
      p.v.y = (pMousePos[1] - mouseY) * 0.1;
    }
    
    mouseHeld = false;
    pSize = 0;
  }
    
  particles.forEach(p => {
    p.update();
    p.draw();
  });
}