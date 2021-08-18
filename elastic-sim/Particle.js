class Particle {
  static particles = [];

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = 2;
    this.fixed = false;
    Particle.particles.push(this);
  }
  
  update() {
    if (this.fixed) return;
    this.vy += g;
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x > width) {
      this.vx *= -0.5;
      this.x = width;
    } else if (this.x < 0) {
      this.vx *= -0.5;
      this.x = 0;
    }
    
    if (this.y > height) {
      this.vy *= -0.5;
      this.y = height;
    } else if (this.y < 0) {
      this.vy *= -0.5;
      this.y = 0;
    }
    
    this.vx *= airResistance;
    this.vy *= airResistance;
  }
  
  render() {
    noFill();
    stroke(0);
    circle(this.x, this.y, this.r * 2);
  }
}