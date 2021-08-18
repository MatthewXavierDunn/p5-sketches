let sign = (x) => (x > 0) - (x < 0);
let iround = (x) => round(x + 0.5);
let fpart = (x) => x - floor(x);
let rfpart = (x) => 1 - fpart(x);

function drawCircle(cx, cy, r) {
  let x = 0;
  let y = r;
  let d = 3 - 2 * r;
  drawSect(x, y, cx, cy);
  while (x <= y) {
    x += 1;
    y -= d >= 0;
    d += 4 * x + 6 + (d >= 0) * (-4 * y + 4);
    drawSect(x, y, cx, cy);
  }
}

function drawSect(x, y, cx, cy) {
  set(cx + x, cy + y, 0);
  set(cx + x, cy - y, 0);
  set(cx - x, cy + y, 0);
  set(cx - x, cy - y, 0);
  set(cx + y, cy + x, 0);
  set(cx + y, cy - x, 0);
  set(cx - y, cy + x, 0);
  set(cx - y, cy - x, 0);
}

function drawLineLow(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let yi = sign(dy) + (dy == 0);
  dy = abs(dy);
  let d = 2 * dy - dx;
  let y = y0;
  
  for (let x = x0; x <= x1; x++) {
    set(x, y, 0);
    y += yi * (d > 0);
    d += 2 * dy - 2 * dx * (d > 0);
  }
}

function drawLineHigh(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let xi = sign(dx) + (dx == 0);
  dx = abs(dx);
  let d = 2 * dx - dy;
  let x = x0;
  
  for (let y = y0; y <= y1; y++) {
    set(x, y, 0);
    x += xi * (d > 0);
    d += 2 * dx - 2 * dy * (d > 0);
  }
}

function drawLine(x0, y0, x1, y1) {
  if (abs(y1 - y0) < abs(x1 - x0)) {
    if (x0 > x1) {
      drawLineLow(x1, y1, x0, y0);
    } else {
      drawLineLow(x0, y0, x1, y1);
    }
  } else {
    if (y0 > y1) {
      drawLineHigh(x1, y1, x0, y0);
    } else {
      drawLineHigh(x0, y0, x1, y1);
    }
  }
}

function plot(x, y, c) {
  set(x, y, map(c, 0, 1, 0, 100));
}


function drawAALine(x0, y0, x1, y1) {
  let steep = abs(y1 - y0) > abs(x1 - x0);
  
  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }
  
  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }
  
  let dx = x1 - x0;
  let dy = y1 - y0;
  let grad = dy / dx;
  
  if (dx == 0) {
    grad = 1;
  }
  
  let xend = iround(x0);
  let yend = y0 + grad * (xend - x0);
  let xgap = rfpart(x0 + 0.5);
  let xpx11 = xend;
  let ypx11 = floor(yend);
  
  let intery = yend + grad;
  
  xend = iround(x1);
  yend = y1 + grad * (xend - x1);
  xgap = fpart(x1 + 0.5);
  let xpx12 = xend;
  let ypx12 = floor(yend);
  
  if (steep) {
    for (let x = xpx11 + 1; x < xpx12; x++) {
      plot(floor(intery), x, rfpart(intery));
      plot(floor(intery) + 1, x, fpart(intery));
      intery += grad;
    }
  } else {
    for (let x = xpx11 + 1; x < xpx12; x++) {
      plot(x, floor(intery), x, rfpart(intery));
      plot(x, floor(intery) + 1, fpart(intery));
      intery += grad;
    }
  }
}

function setup() {
  createCanvas(400, 400);
  stroke(0);
}


function draw() {
  background(255);
  loadPixels();
  drawCircle(mouseX, mouseY, 20);
  drawLine(width / 2, height / 2, mouseX, mouseY);
  updatePixels();
}