class Elastic {
  static elastics = [];

  static createRope(x1, y1, x2, y2, segments = 10, l = 10) {
    let p = new Particle(x1, y1);
    let e;
    for (let i = 0; i < segments; i ++) {
      p = new Particle(map(i, 0, segments, x1, x2), map(i, 0, segments, y1, y2));
      e = new Elastic(Particle.particles[Particle.particles.length - 2], p, l);
    }
  }

  static createBlanket(x, y, w, h, l = 10) {
    let particles = [];
    for (let i = 0; i < w; i ++) {
      let row = [];
      for (let j = 0; j < h; j ++) {
        let p = new Particle(x + i * l, y + j * l);
        row.push(p);
      }
      particles.push(row);
    }
    
    particles[0][0].fixed = true;
    particles[0][h - 1].fixed = true;
    particles[w - 1][0].fixed = true;
    particles[w - 1][h - 1].fixed = true;
    
    for (let i = 0; i < w; i ++) {
      for (let j = 1; j < h; j ++) {
        if (i == 0 || i == w - 1) {
          particles[i][j - 1].fixed = true;
        }
        new Elastic(particles[i][j - 1], particles[i][j], l);
      }
    }
    
    for (let j = 0; j < h; j ++) {
      for (let i = 1; i < w; i ++) {
        new Elastic(particles[i - 1][j], particles[i][j], l);
      }
    }
  }

  constructor(p1, p2, l) {
    this.p1 = p1;
    this.p2 = p2;
    this.l = l;
    this.k = 0.1;
    this.snapped = false;
    this.force = 0;
    this.breakingForce = 15;
    Elastic.elastics.push(this);
  }
  
  update() {
    if (this.snapped) return;
    
    this.force = (distance(this.p1, this.p2) - this.l) * this.k;
    if (this.force < 0) return;
    
    let angle = atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
    
    if (this.force > this.breakingForce) {
      this.snapped = true;
    }
    
    this.p1.vx += this.force * cos(angle);
    this.p1.vy += this.force * sin(angle);
    this.p2.vx += -this.force * cos(angle);
    this.p2.vy += -this.force * sin(angle);
  }
  
  render() {
    if (this.snapped) return;
    let c = map(this.force, 0, this.breakingForce, 120, 0);
    stroke(c, 100, 50);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }
}