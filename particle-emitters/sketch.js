class Particle extends p5.Vector {
  constructor(parent) {
    super(0, 0);
    this.parent = parent;
    this.reset();
  }
  
  reset() {
    let posVar = this.parent.positionVariationSlider.value();
    let angVar = this.parent.angleVariationSlider.value();
    let emiAng = this.parent.emissionAngleSlider.value();
    let decCon = this.parent.decayConstantSlider.value();
    let hueVar = this.parent.hueSlider.value();
    let hueInc = this.parent.hueIncSlider.value();
    
    this.x = this.parent.x + random(-posVar, posVar);
    this.y = this.parent.y + random(-posVar, posVar);
    this.r = 5;
    let angle = emiAng + random(-angVar, angVar);
    this.v = createVector(cos(angle), sin(angle))
    this.a = hueVar;
    this.aInc = hueInc;
    this.lambda = decCon;
  }
  
  update() {
    this.add(this.v);
    this.a += this.aInc;
    
    if (this.a > 255) this.a -= 255;
    if (this.a < 0) this.a += 255;
    
    this.r *= this.lambda;
    
    if (this.r < 1 || this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      this.reset();
    }
  }
  
  draw() {
    noStroke();
    let c = color(this.a, 100, 205);
    fill(c);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function createLSlider(parent, name, min, max, value) {
  let p = createP(name);
  p.style("font-size", "12px");
  p.style("padding", "0");
  p.style("margin", "0");
  p.parent(parent);
  
  let slider = createSlider(min, max, value, 0);
  slider.parent(parent);
  
  return slider;
}

class Emitter extends p5.Vector {
  constructor(name, x, y, max=100) {
    super(x, y);
    this.particles = [];
    this.max = max;
    
    this.div = createDiv();
    this.div.style("font-family", "Fira Code");
    this.div.style("color", "#ddd");
    this.div.style("text-align", "center");
    this.div.style("font-size", "14px");
    this.div.style("border", "1px solid #444");
    this.div.style("border-radius", "4px");
    this.div.style("display", "inline-block");
    this.div.style("margin", "8px");
    this.div.style("padding", "12px");
    
    this.nameP = createP(name);
    this.nameP.parent(this.div);
    this.nameP.style("color", "white");
    
    this.emissionAngleSlider = createLSlider(this.div, "Emission Angle", 0, TWO_PI, 3 * HALF_PI);
    this.angleVariationSlider = createLSlider(this.div, "Angle Variation", 0, PI, 0.1);
    this.positionVariationSlider = createLSlider(this.div, "Position Variation", 0, 2, 0);
    this.decayConstantSlider = createLSlider(this.div, "Decay Constant", 0.8, 0.99, 0.98);
    this.hueSlider = createLSlider(this.div, "Hue", 0, 255, 50);
    this.hueIncSlider = createLSlider(this.div, "Hue Increment", -10, 10, -0.3);
  }
  
  update() {
    if (this.particles.length < this.max && frameCount % 6 === 0) this.particles.push(new Particle(this));
    
    for (let p of this.particles) {
      p.update();
    }
  }
  
  draw() {
    for (let p of this.particles) {
      p.draw();
    }
  }
}

let emitter;

function setup() {
  createCanvas(400, 200);
  colorMode(HSB);
  
  emitter01 = new Emitter("Emitter 01", width / 3, 3 * height / 4, 400);
  emitter02 = new Emitter("Emitter 02", 2 * width / 3, 3 * height / 4, 400);
}

function draw() {
  background(0);
  
  // emitter.x = mouseX;
  // emitter.y = mouseY;
  
  emitter01.update();
  emitter01.draw();
  emitter02.update();
  emitter02.draw();
}