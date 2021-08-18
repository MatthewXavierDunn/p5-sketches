let G;
const TARGET_L = 25 ** 2;
const ELASTIC_M = 0.8;

let particles = [];
let heldParticle;

let addPolygonBtn;
let addPolygonSldr;
let addDudeBtn;

p5.disableFriendlyErrors = true;

class Particle extends p5.Vector {
  constructor(x, y) {
    if (x != null) {
      super(x, y);
      this.fixed = true;
    } else {
      super(random(100, width - 100), random(100, height - 100));
      this.fixed = false;
    }
    
    // this.r = random(1, 10);
    this.r = 8;
    this.v = createVector(0, 0);
    this.attached = new Set();
    
    particles.push(this);
  }
  
  attachParticle(particle) {    
    this.attached.add(particle);
    particle.attached.add(this);
  }
  
  distSq(other) {
    return (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
  }
  
  update() {
    if (this.fixed) return;
    
    particles.map(p => {
      if (p === this) return;
      let d = this.distSq(p);
      let r2 = (this.r * 2) ** 2;
      if (d <= r2) {
        let f = (d - r2) * 1;
        let acc = p5.Vector.fromAngle(atan2(p.y - this.y, p.x - this.x));
        acc.setMag(f / 314);
        this.v.add(acc);
      }
    });
    
    for (let p of this.attached) {
      let d = this.distSq(p);
      // if (d === 0) continue;
      // let f = (d + (1/d) - 10000) * 0.5;
      let f = (d - TARGET_L) * ELASTIC_M;
      
      let acc = p5.Vector.fromAngle(atan2(p.y - this.y, p.x - this.x));
      acc.setMag(f / 314);
      
      this.v.add(acc);
    }
    
    // const angle = noise(this.x * 0.5, this.y * 0.5, frameCount * 0.5) * TWO_PI;
    // this.v.add(createVector(0, 0.1).rotate(angle));
    
    this.v.add(G);
    this.v.mult(0.88);
    this.add(this.v);
    
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
    
    if (this.x === 0 || this.x === width) {
      this.v.y *= 0.5;
      this.v.x -= this.v.x;
    }
    
    if (this.y === height || this.y === 0) {
      this.v.x *= 0.5;
      this.v.y -= this.v.y;
    }
  }
  
  draw() {
    noFill();
    stroke(0, 100);
    for (let p of this.attached) {
      line(this.x, this.y, p.x, p.y);
    }
    
    stroke(0, 20);
    ellipse(this.x, this.y, this.r * 2);
    
    if (this.attached.length === 0) {
      stroke(0, 20);
      ellipse(this.x, this.y, this.r * 2);
    }
  }
}

function createDude() {
  let lHand = new Particle();
  let lElbow = new Particle();
  let rHand = new Particle();
  let rElbow = new Particle();
  let shoulder = new Particle();
  let torso = new Particle();
  let lKnee = new Particle();
  let rKnee = new Particle();
  let lFoot = new Particle();
  let rFoot = new Particle();
  
  lElbow.attachParticle(lHand);
  rElbow.attachParticle(rHand);
  
  shoulder.attachParticle(lElbow);
  shoulder.attachParticle(rElbow);
  shoulder.attachParticle(torso);
  
  shoulder.attachParticle(createShape(6));
  
  torso.attachParticle(lKnee);
  torso.attachParticle(rKnee);
  
  lKnee.attachParticle(lFoot);
  rKnee.attachParticle(rFoot);
}

function createShape(sides) {
  let created = [];
  for (let i = 0; i < sides; i ++) {
    p = new Particle();
    created.push(p);
  }
  
  created.map(p1 => {
    created.map(p2 => {
      if (p2 === p1) return;
      p1.attachParticle(p2);
    });
  });
  
  return created[0];
}

function createRope(length) {
  let created = [new Particle()];
  for (let i = 1; i < length; i ++) {
    p = new Particle();
    p.attachParticle(created[i - 1]);
    created.push(p);
  }
  
  return created[0];
}

function setup() {
  createCanvas(400, 400);
  
  G = createVector(0, 0.1);
  strokeWeight(2);
  
  addPolygonBtn = createButton('Add Polygon');
  addPolygonSldr = createSlider(1, 10, 3, 1);
  addPolygonBtn.mousePressed(() => {
    createShape(addPolygonSldr.value());
  });
  
  addDudeBtn = createButton('Add Dude');
  addDudeBtn.mousePressed(createDude);
}

function draw() {
  background(220);
  
  // G.rotate(0.01);
  
  if (mouseIsPressed) {
    let mVector = createVector(mouseX, mouseY);
    if (!heldParticle) {
      particles.map(p => {
        if (p.distSq(mVector) < 100) heldParticle = p;
      });
    }
    
    if (heldParticle) {
      if (heldParticle.fixed) {
        heldParticle.x = mouseX;
        heldParticle.y = mouseY;
      } else {
        let acc = mVector.sub(heldParticle);
        acc.mult(0.5);
        heldParticle.v.add(acc);
      }
    }
  } else {
    heldParticle = null;
  }
  
  particles.map(p => {
    p.update();
  });
  particles.map(p => {
    p.draw();
  });
}