function setup() {
  createCanvas(800, 800);
  noStroke();
  noLoop();
}

function draw() {
  background(220);
  for (let i = 0; i < width; i++) {
    fill(wavelength_to_rgb(map(i, 0, width, 380, 750)));
    rect(i, 0, 1, height);
  }
}

function attenuate(weight) {
  return 0.3 + weight * 0.7;
  return weight;
}

function wavelength_to_rgb(l) {
  let colour = [0, 0, 0];
  if (l < 440) {
    let attenuation = attenuate(map(l, 380, 440, 0, 1));
    colour = [map(l, 380, 440, 1, 0) * attenuation, 0, attenuation];
  } else if (l < 490) {
    colour = [0, map(l, 440, 490, 0, 1), 1];
  } else if (l < 510) {
    colour = [0, 1, map(l, 490, 510, 1, 0)];
  } else if (l < 580) {
    colour = [map(l, 510, 580, 0, 1), 1, 0];
  } else if (l < 645) {
    colour = [1, map(l, 580, 645, 1, 0), 0];
  } else {
    colour = [attenuate(map(l, 645, 750, 1, 0)), 0, 0];
  }
  return colour.map(c => c * 255);
}