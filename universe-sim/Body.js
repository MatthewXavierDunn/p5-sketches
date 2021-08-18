class Body extends Sprite {
  static bodies = [];
  static G = 6.67e-11;

  static createSolarSystem(x, y) {
    let star = new Body(x, y, random(1e+5, 1.2e+6), 1.40e+3, [random(0, 50),
                                                              100,
                                                              random(35, 80)]);
    let numPlanets = random(1, 10);

    let lastMoon;

    for (let i = 0; i < numPlanets; i ++) {
      let planet = new Body(0, 0,
                            random(2.44e+3, 6.99e+4),
                            random(690, 5.52e+3),
                           [random(0, 360), random(0, 50), random(20, 60)]);
      planet.setOrbit(star, random(29e+6, 4.4e+9), random(TWO_PI));

      let nMoons = random(0, 3);

      for (let n = 0; n < nMoons; n ++) {
        let moon = new Body(0, 0,
                            random(1e+3, 2e+3),
                            random(2e+3, 4e+3),
                            random(20, 80));
        moon.setOrbit(planet, random(2e+5, 4e+5), random(TWO_PI));
        lastMoon = moon;
      }
    }

    return lastMoon;
  }

  constructor(x = 0, y = 0, radius = 0, density = 0, colour = 100) {
    super(x, y, radius);
    this.vx = 0;
    this.vy = 0;
    this.mass = density * (3 / 4) * PI * radius ** 3;
    this.colour = colour;
    this.orbit = null;
    
    Body.bodies.push(this);
  }

  calculateGF(body) {
    let dSquared = distSquared(this.x, this.y, body.x, body.y);
    let fAngle = angleBetween(body.x, body.y, this.x, this.y);
    let fMag = (Body.G * this.mass * body.mass) / dSquared;
        
    return [fMag * cos(fAngle), fMag * sin(fAngle)];
  }

  setOrbit(body, distance, angle) {
    let vMag = sqrt((Body.G * body.mass) / distance);
    this.x = body.x + distance * cos(angle);
    this.y = body.y + distance * sin(angle);
    this.vx = body.vx + vMag * cos(angle + HALF_PI);
    this.vy = body.vy + vMag * sin(angle + HALF_PI);
    this.orbit = [body, distance];
  }

  applyGravity() {
    for (let body of Body.bodies) {
      if (body === this) continue;
      
      let [fx, fy] = this.calculateGF(body);
            
      this.vx += fx / this.mass;
      this.vy += fy / this.mass;
    }
  }
  
  update() {
    this.applyGravity();
    
    this.x += this.vx;
    this.y += this.vy;
  }

  drawOrbit() {
    Camera.outlinedCircle(this.orbit[0].x, this.orbit[0].y,
                          this.orbit[1], [100, 0.1]);
  }
  
  draw() {
    if (this.radius * Camera.scale < 4) {
      if (this.orbit) {
        if (this.orbit[1] * Camera.scale > 4)
            Camera.point(this.x, this.y, 8, this.colour);
      } else {
        Camera.point(this.x, this.y, 8, this.colour);
      }
    } else {
      Camera.circle(this.x, this.y, this.radius, this.colour);
    }
    
    if (this.orbit) this.drawOrbit();
  }
}