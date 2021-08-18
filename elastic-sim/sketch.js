p5.disableFriendlyErrors = true;

let g = 0.1;
let airResistance = 0.98;

let eSlider, lSlider, bSlider, gSlider, aSlider;

function distance(p1, p2) {
  return sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  
  let eProp = new Field("Elastic Properties");
  eSlider = new Slider(eProp.div, "Elasticity", 1e-3, 0.5, 0.1, 1e-3).slider;
  lSlider = new Slider(eProp.div, "Length", 1, 50, 4, 1).slider;
  bSlider = new Slider(eProp.div, "Breaking Stress", 1, 500, 30, 1).slider;
  
  let gProp = new Field("General Properties");
  gSlider = new Slider(gProp.div, "Gravitational Field Strength", 0, 0.5, 0.05, 1e-2).slider;
  aSlider = new Slider(gProp.div, "Air Resistance", 0.5, 1, 0.98, 1e-3).slider;
  
  let l = 15
  Elastic.createBlanket(0, 0, ceil(width / l), ceil(height / l), l);
  // Elastic.createRope(0, 0, width, height, 1e+3)
}

let grabbedParticle;
let keyHeld = false;
let selectedParticle;

function doubleClicked() {
  for (let p of Particle.particles) {
    if ((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2 <= p.r ** 2) {
      if (selectedParticle) {
        let length = distance(selectedParticle, p);
        new Elastic(selectedParticle, p, length);
        selectedParticle = null;
      } else {
        selectedParticle = p;
      }
      break;
    }
  }
}

function mousePressed() {
  for (let p of Particle.particles) {
    if ((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2 <= 100) {
      grabbedParticle = p;
      break;
    }
  }
}

function mouseReleased() {
  grabbedParticle = null;
}

function draw() {
  background(220);
  
  updateUI();
    
  if (keyIsDown(78)) {
    Elastic.createRope(mouseX, mouseY, pmouseX, pmouseY);
  }
  
  if (grabbedParticle) {
    if (grabbedParticle.fixed) {
      grabbedParticle.x = mouseX;
      grabbedParticle.y = mouseY;
    } else {
      let theta = atan2(mouseY - grabbedParticle.y, mouseX - grabbedParticle.x);
      let force = sqrt((grabbedParticle.x - mouseX) ** 2 + (grabbedParticle.y - mouseY) ** 2) * 0.5;
      grabbedParticle.vx += cos(theta) * force;
      grabbedParticle.vy += sin(theta) * force;      
    }

    if (keyIsDown(32)) {
      if (!keyHeld) {
        grabbedParticle.fixed = !grabbedParticle.fixed;
        keyHeld = true;
      }
    } else {
      keyHeld = false;
    }
  }
  
  if (selectedParticle) {
    stroke(0, 100);
    circle(selectedParticle.x, selectedParticle.y, 10);
  }
  
  let k = eSlider.value();
  let l = lSlider.value();
  // let l = 1;
  let b = bSlider.value();
  g = gSlider.value();
  airResistance = aSlider.value();
  
  for (let p of Particle.particles) {
    p.update();
    // p.render();
  }
  
  for (let e of Elastic.elastics) {
    e.k = k;
    e.l = l;
    e.breakingForce = random(b, b + 20);
    e.update();
    e.render();
  }
}