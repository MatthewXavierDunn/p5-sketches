p5.disableFriendlyErrors = true;

let g = 0.01;
let air_resistance = 0.99;

function sign(a) {
  return a == 0 ? 0 : a < 0 ? -1 : 1;
}

class Pendulum {
  
  static pendulums = [];
  
  constructor(x, y, theta = 0, length = 80, radius = 4) {
    this.x = x;
    this.y = y;
    this.theta = theta;
    this.length = length;
    this.radius = radius;
    this.mass = 4/3 * PI * this.radius ** 3 * 0.01;
    this.omega = 0;
    Pendulum.pendulums.push(this);
  }

  get ball_x() {
    return this.x + this.length * cos(this.theta + HALF_PI);
  }

  get ball_y() {
    return this.y + this.length * sin(this.theta + HALF_PI);
  }

  apply_force(f) {
    f /= this.mass;
    this.omega += -sign(f) * sqrt(abs(f) / this.length);
    // f *= 10000;
    // stroke(0, 200, 0);
    // let x = this.ball_x + f * cos(this.theta);
    // let y = this.ball_y + f * sin(this.theta);
    // line(this.ball_x, this.ball_y, x, y);
  }
  
  update() {
    this.apply_force(g * this.mass * sin(this.theta))
    this.omega *= air_resistance;
    this.theta += this.omega;
  }
  
  render() {
    let theta = this.theta + HALF_PI
    let x = this.ball_x;
    let y = this.ball_y;

    stroke(0);
    line(this.x, this.y, x, y);
    fill(200);
    circle(x, y, this.radius * 2);
  }
}

function setup() {
  createCanvas(500, 500);
  new Pendulum(width / 2, height / 2 - 50, 0, 100, 20);
  // let res = 0.5;
  // let l = 300;
  // for (let i = 0; i <= width * res; i ++) {
  //   new Pendulum(i / res, height / 2 - l / 2, map(i, 0, width * res, -HALF_PI, HALF_PI), l, 10);
  // }
}

let pend;

function draw() {
  background(255);
  
  for (let p of Pendulum.pendulums) {
    p.render();
    p.update();
  }
  
  if (mouseIsPressed) {
    if (pend) {
      let f = dist(pend.ball_x, pend.ball_y, mouseX, mouseY) * 0.1;
      let phi = atan2(mouseY - pend.ball_y, mouseX - pend.ball_x);
      let f_perp = f * cos(-pend.theta + phi);
      pend.apply_force(f_perp);

      stroke(0, 255, 0);
      line(pend.ball_x, pend.ball_y, mouseX, mouseY);
    } else {
      for (let p of Pendulum.pendulums) {
        if ((p.ball_x - mouseX) ** 2 + (p.ball_y - mouseY) ** 2 <= p.radius ** 2) {
          pend = p;
        }
      }
    }
  } else {
    pend = null;
  }
}