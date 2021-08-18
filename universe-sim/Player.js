class Player extends Body {
  
  constructor() {
    super(0, 0, 12, 1, [0, 0, 50]);
    this.mass = 10;
    this.rot = 0;
    this.va = 0;
  }

  move(distance) {
    this.vx += distance * cos(this.rot);
    this.vy += distance * sin(this.rot);
  }

  update() {
    this.applyGravity();
    
    this.va *= 0.8;
    this.rot += this.va;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    if (12 * Camera.scale < 4) {
      Camera.line(this.x, this.y, 10 / Camera.scale, this.rot, 100);
      Camera.point(this.x, this.y, 4, 100);
    } else {
      Camera.triangle(this.x, this.y, 6, 12, this.rot, this.colour);
    }
    
    if (this.orbit) this.drawOrbit();
  }

  setOrbit(body, distance, angle) {
    Body.prototype.setOrbit.call(this, body, distance, angle);
    
    this.va = 0;
    this.rot = angle + HALF_PI;
  }
}