p5.disableFriendlyErrors = true;

let points = [];
let res = 1;
let heat_loss = 1;

function setup() {
  createCanvas(800, 400);
  colorMode(HSL);
  for (let i = 0; i <= width * res; i ++) {
    points.push(random(-height / 2, height / 2));
  }
}

function draw() {
  background(0);
  
  if (mouseIsPressed) {
    points[round(mouseX * res)] = mouseY - height / 2;
  }
  
  let new_points = [points[1] * heat_loss];
  for (let x = 1; x < points.length; x ++) {
    let a = points[x - 1];
    let b = points[x];
    
    noStroke();
    fill(map(a, -height / 2, height / 2, 0, 60), 100, 50);
    let x1 = (x - 1) / res;
    let x2 = x / res;
    let y1 = a + height / 2;
    let y2 = b + height / 2;
    quad(x1, height, x2, height, x2, y1, x1, y1)
    
    new_points.push(x == points.length - 1 ? a * heat_loss : (a + points[x + 1]) / 2 * heat_loss);
  }
  points = new_points;
  endShape();
}