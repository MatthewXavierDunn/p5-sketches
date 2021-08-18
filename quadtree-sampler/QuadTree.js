class QuadTree {
  constructor(x = 0, y = 0, w = 0, h = 0, maxP = 5) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.maxP = maxP;
    this.subdivided = false;
    this.hue = random(0, 360);
    this.particles = [];
  }
  
  query(x, y, radius) {
    if (this.subdivided) return [].concat(
                                  this.tl.query(x, y, radius),
                                  this.tr.query(x, y, radius),
                                  this.bl.query(x, y, radius),
                                  this.br.query(x, y, radius))

    if (this.contains(x, y, radius)) return this.particles;
    
    return [];
  }
  
  contains(x, y, radius) {
    return (x - radius >= this.x &&
            x + radius <= this.x + this.w &&
            y - radius >= this.y &&
            y + radius <= this.y + this.h);
  }
  
  subdivide() {
    this.subdivided = true;
    this.tl = new QuadTree(this.x, this.y,
                          this.w / 2, this.h / 2);
    this.tr = new QuadTree(this.x + this.w / 2, this.y,
                          this.w / 2, this.h / 2);
    this.bl = new QuadTree(this.x, this.y + this.h / 2,
                          this.w / 2, this.h / 2);
    this.br = new QuadTree(this.x + this.w / 2, this.y + this.h / 2,
                          this.w / 2, this.h / 2);
    
    this.particles.map(particle => {
      this.tl.insert(particle);
      this.tr.insert(particle);
      this.bl.insert(particle);
      this.br.insert(particle);
    });
    
    this.particles = [];
  }
  
  insert(particle) {
    if (this.subdivided) {
      this.tl.insert(particle);
      this.tr.insert(particle);
      this.bl.insert(particle);
      this.br.insert(particle);
      return;
    }
    
    if (!this.contains(particle.x, particle.y, 0)) return;
    
    this.particles.push(particle);
    
    if (this.particles.length > this.maxP) this.subdivide();
  }
  
  draw() {
    if (this.subdivided) {
      this.tl.draw();
      this.tr.draw();
      this.bl.draw();
      this.br.draw();
      
      return;
    }
    
    fill(this.hue, 100, 50, 0.2);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    
    fill(this.hue, 100, 50);
    this.particles.map(p => {
      circle(p.x, p.y, p.r * 2);
    });
  }
}