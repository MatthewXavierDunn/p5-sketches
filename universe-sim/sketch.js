let WIDTH;
let HEIGHT;
let H_WIDTH;
let H_HEIGHT;
let SCREEN_R;
let player;

p5.disableFriendlyErrors = true;

const useCursor = true;

function angleBetween(x0, y0, x1, y1) {
  return atan2(y0 - y1, x0 - x1);
}

function distSquared(x0, y0, x1, y1) {
  return (x0 - x1) ** 2 + (y0 - y1) ** 2;
}

function mouseWheel(event) {
  Camera.scale *= map(event.delta, -0.2, 0.2, 1.005, 0.995);
}

let startMoon;

function setup() {
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  H_WIDTH = windowWidth / 2;
  H_HEIGHT = windowHeight / 2;
  SCREEN_R = sqrt(H_WIDTH ** 2 + H_HEIGHT ** 2);
  
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
  strokeJoin(ROUND);
  
  startMoon = Body.createSolarSystem(0, 0);
  player = new Player();
  Camera.target = player;
  player.setOrbit(startMoon, startMoon.radius + 100, random(TWO_PI));
  
  for (let i = 0; i < 2e+3; i ++) {
    Body.createSolarSystem(random(-1e+15, 1e+15), random(-1e+15, 1e+15));
  }
}


function draw() {
  background(0);
  
  Camera.update();
  for (let sprite of Sprite.sprites) {
    let [rx, ry] = Camera.toRelative(sprite.x, sprite.y);
    let radius = sprite.radius * Camera.scale;
    if ((rx + radius > 0 &&
       rx - radius < WIDTH &&
       ry + radius > 0 &&
       ry - radius < HEIGHT &&
       radius > 1) ||
        sprite === player) sprite.update();
    sprite.draw();
  }
  
  if (useCursor) {
    let [rx, ry] = Camera.toRelative(player.x, player.y);
    if (mouseIsPressed) {
      let dx = (mouseX - rx) / Camera.scale;
      let dy = (mouseY - ry) / Camera.scale;
      let mag = dist(rx, ry, dx, dy);
      player.va += (angleBetween(mouseX, mouseY, rx, ry) - player.rot) * 0.05;
      player.move(mag * 0.0001);
      stroke(100, 0.5);
      strokeWeight(1);
      line(rx + (24 * Camera.scale) * cos(player.rot),
           ry + (24 * Camera.scale) * sin(player.rot),
           mouseX, mouseY);
    }
  } else {
    player.va += (keyIsDown(68) - keyIsDown(65)) * 0.02;
    if (keyIsDown(87)) player.move(0.01 / Camera.scale);
    if (keyIsDown(83)) {
      player.vx *= 0.8;
      player.vy *= 0.8;
    }

    player.rot = angleBetween(mouseX, mouseY, rx, ry);
  }
}