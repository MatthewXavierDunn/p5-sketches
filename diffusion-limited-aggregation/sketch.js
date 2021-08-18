const maxRadius = 2;
const iterations = 1;
const maxParticles = 10000;

p5.disableFriendlyErrors = true;

var particles = [];

function randomPoint() {
  var point = createVector(width / 2, height / 2);
  
  const theta = random(0, 2 * PI);
  
  point.x += random(width / 4, width / 2) * cos(theta);
  point.y += random(height / 4, height / 2) * sin(theta);
  
  // if (round(random(1))) {
  //   point.x = round(random(1)) * width;
  //   point.y = random(0, height);
  // } else {
  //   point.x = random(0, width);
  //   point.y = round(random(1)) * height;
  // }
  
  return point;
}

function distSq(a, b) {
  return (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
}

class Particle {
  constructor(r, pos=null) {
    this.r = r;
    this.pos = pos || randomPoint();
    this.stuck = pos ? true : false;
    
    this.theta = atan2(height / 2 - this.pos.y, width / 2 - this.pos.x);
    this.velocity = this.r * random(0.5, 1.5);
    
    particles.push(this);
  }
  
  touching(other) {
    return distSq(this.pos, other.pos) <= (this.r + other.r) ** 2;
  }
  
  update() {
    if (this.stuck) return;
    
    this.theta = atan2(height / 2 - this.pos.y, width / 2 - this.pos.x);
    this.theta += random(-1, 1);
    
    this.pos.x += this.velocity * cos(this.theta);
    this.pos.y += this.velocity * sin(this.theta);
    
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
    
    particles.map(p => {
      if (p === this || !p.stuck) return;
      
      if (this.touching(p)) {
        this.stuck = true;
        return;
      }
    });
  }
  
  render() {
    if (this.stuck) {
      fill(255, 0, 0, map(distSq(this.pos, particles[0].pos), 0, width ** 2, 200, 0));
    } else {
      fill(255, 100);
    }
    
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

function setup() {
  createCanvas(400, 400);
  
  noStroke();
  new Particle(maxRadius, createVector(width / 2, height / 2));
  
  for (let i = 0; i < maxParticles; i ++) {
    new Particle(random(1, maxRadius));
  }
}

function draw() {
  background(0);
  for (let i = 0; i < iterations; i ++) particles.map(p => p.update());
  particles.map(p => p.render());
}