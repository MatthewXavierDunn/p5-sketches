class Particle {
  static particles = [];

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.nextR = constrain(this.r * Constants.LENGTH_FACTOR + random(-1, 1),
                           Constants.MIN_LENGTH, Constants.MAX_LENGTH);
    this.sumR = this.r + this.nextR;
    this.sumRSq = this.sumR ** 2;
    
    this.phi = asin(this.nextR / (this.r + this.nextR))
    this.maxP = floor(720 / this.phi);
    
    this.active = true;
    this.drawn = false;
    this.attempts = 0;
    this.particles = [];
    
    Particle.particles.push(this);
    quadTree.insert(this);
  }
  
  distSq(x, y) {
    return (this.x - x) ** 2 + (this.y - y) ** 2;
  }
  
  update() {
    if (!this.active) return;
    
    let viable = true;
    
    let angle = random(TWO_PI);
    let newX = this.sumR * cos(angle) + this.x;
    let newY = this.sumR * sin(angle) + this.y;

    quadTree.query(this.x, this.y, this.r * 2).map(p => {
      if (p === this) return;

      if (p.distSq(newX, newY) < this.sumRSq) viable = false;
    });

    if (viable && this.particles.length < this.maxP) {
      let p = new Particle(newX, newY, this.nextR);
      this.particles.push(p);
    }
    
    this.attempts ++;
    if (Particle.particles.length >= Constants.MAX_PARTICLES ||
        this.particles.length >= this.maxP ||
        this.attempts == Constants.MAX_ATTEMPTS ||
        this.x < 0 ||
        this.x > width ||
        this.y < 0 ||
        this.y > height)
      this.active = false;
    }
  
  draw() {
    if (this.drawn) return;
    this.drawn = true;
    
    // let hue = map(this.r, Constants.MIN_LENGTH, Constants.MAX_LENGTH,
    //               0, 360);
    
    let hue = 0;
    noFill();
    stroke(0);
    circle(this.x, this.y, this.r * 2);
    
    noFill();
    stroke(hue, 100, 50);
    this.particles.map(p => line(this.x, this.y, p.x, p.y));
  }
}