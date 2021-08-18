
let m1 = 20;
let m2 = 20;
let theta1 = 3.14 / 2;
let theta2 = 3.14 / 2;
let g = 1;
let omega1 = 0;
let omega2 = 0;
let l1 = 100;
let l2 = 100;
let ox, oy;
let damping = 0.999;
let held1 = false;
let held2 = false;
let spaceHeld = false;
let paused = false;

let path = [];

let m1Slider, m2Slider, l1Slider, l2Slider, dampingSlider, gSlider;

function setup() {
  createCanvas(600, 600);
  ox = width / 2;
  oy = height / 2;
  
  ellipseMode(RADIUS);
  
  let prop = new Field("Properties");
  m1Slider = new Slider(prop.div, "Mass 1", 1, 100, m1, 0.1).slider;
  m2Slider = new Slider(prop.div, "Mass 2", 1, 100, m2, 0.1).slider;
  l1Slider = new Slider(prop.div, "Length 1", 1, 200, l1, 0.1).slider;
  l2Slider = new Slider(prop.div, "Length 2", 1, 200, l2, 0.1).slider;
  dampingSlider = new Slider(prop.div, "Damping", 0.8, 1, damping, 1e-4).slider;
  gSlider = new Slider(prop.div, "Gravity", 0, 2, g, 0.01).slider;
}

function draw() {
  background(220);
  updateUI();
  
  m1 = m1Slider.value();
  m2 = m2Slider.value();
  
  l1 = l1Slider.value();
  l2 = l2Slider.value();
  
  damping = dampingSlider.value();
  g = gSlider.value();
  
  let d_omega1 = (-g * (2 * m1 + m2) * sin(theta1) - m2 * g * sin(theta1 - 2 * theta2) - 2 * sin(theta1 - theta2) * m2 * (omega2 ** 2 * l2 + omega1 ** 2 * l1 * cos(theta1 - theta2))) / (l1 * (2 * m1 + m2 - m2 * cos(2 * theta1 - 2 * theta2)));
  let d_omega2 = (2 * sin(theta1 - theta2) * (omega1 ** 2 * l1 * (m1 + m2) + g * (m1 + m2) * cos(theta1) + omega2 ** 2 * l2 * m2 * cos(theta1 - theta2))) / (l2 * (2 * m1 + m2 - m2 * cos(2 * theta1 - 2 * theta2)));
  
  if (held1 || held2) {
    path = [];
    omega1 = 0;
    omega2 = 0;
  } else if (!paused) {
    omega1 += d_omega1;
    omega2 += d_omega2;

    omega1 *= damping;
    omega2 *= damping;

    theta1 += omega1;
    theta2 += omega2;
  }
  
  let x1 = cos(theta1 + PI / 2) * l1 + ox;
  let y1 = sin(theta1 + PI / 2) * l1 + oy;
  
  let x2 = cos(theta2 + PI / 2) * l2 + x1;
  let y2 = sin(theta2 + PI / 2) * l2 + y1;
  
  path.push([x2, y2]);
  
  if (keyIsDown(32)) {
    if (!spaceHeld) {
      paused = !paused;
      spaceHeld = true;
    }
  } else {
    spaceHeld = false;
  }
  
  if (held1) {
    theta1 = atan2(oy - mouseY, ox - mouseX) + HALF_PI;
    held1 = mouseIsPressed;
  }
  else if (held2) {
    theta2 = atan2(y1 - mouseY, x1 - mouseX) + HALF_PI;
    held2 = mouseIsPressed;
  } else {
    if (mouseIsPressed) {
      if ((mouseX - x1) ** 2 + (mouseY - y1) ** 2 < m1 ** 2) {
        held1 = true;
      } else if ((mouseX - x2) ** 2 + (mouseY - y2) ** 2 < m2 ** 2) {
        held2 = true;
      }
    }
  }
  
  noFill();
  stroke(0, 20);
  strokeWeight(4);
  beginShape();
  for (let [x, y] of path) {
    vertex(x, y);
  }
  endShape();
  
  fill(255);
  stroke(0);
  strokeWeight(2);
  line(ox, oy, x1, y1);
  line(x1, y1, x2, y2);
  circle(x1, y1, m1);
  circle(x2, y2, m2);
}