class Camera {
  
  static x = 0;
  static y = 0;
  static scale = 1;
  static easing = 0.4;
  static target = null;

  static update() {
    let dx = Camera.target.x + (Camera.target.vx / Camera.easing) -
        Camera.x + ((mouseX - H_WIDTH) / Camera.scale) * 0.5;
    let dy = Camera.target.y + (Camera.target.vy / Camera.easing) -
        Camera.y + ((mouseY - H_HEIGHT) / Camera.scale) * 0.5;

    Camera.x += dx * Camera.easing;
    Camera.y += dy * Camera.easing;
  }

  static toRelative(x, y) {
    return [H_WIDTH + (x - Camera.x) * Camera.scale,
            H_HEIGHT + (y - Camera.y) * Camera.scale];
  }

  static outlinedCircle(x, y, radius, colour) {
    radius *= Camera.scale;
    
    if (radius < 1) return;
    
    [x, y] = Camera.toRelative(x, y);
    
    if (x + radius < 0 ||
       x - radius > WIDTH ||
       y + radius < 0 ||
       y - radius > HEIGHT) return;
    
    if (radius > SCREEN_R * 2) return;
    
    noFill();
    stroke(colour);
    strokeWeight(1);
    circle(x, y, radius * 2);
  }

  static circle(x, y, radius, colour) {
    radius *= Camera.scale;
    
    if (radius < 1) return;
    
    [x, y] = Camera.toRelative(x, y);
    
    if (x + radius < 0 ||
       x - radius > WIDTH ||
       y + radius < 0 ||
       y - radius > HEIGHT) return;
    
    fill(colour);
    noStroke();
    circle(x, y, radius * 2);
  }

  static point(x, y, weight, colour) {
    [x, y] = Camera.toRelative(x, y);
    
    let radius = weight / 2;
    
    if (x + radius < 0 ||
       x - radius > WIDTH ||
       y + radius < 0 ||
       y - radius > HEIGHT) return;
    
    noFill();
    stroke(colour);
    strokeWeight(weight);
    point(x, y);
  }

  static line(x, y, d, theta, colour) {
    d *= Camera.scale;
    
    if (d < 1) return;
    
    [x, y] = Camera.toRelative(x, y);
    
    stroke(colour);
    strokeWeight(1);
    line(x, y, x + d * cos(theta), y + d * sin(theta));
  }

  static triangle(x, y, w, h, theta, colour) {
    w *= Camera.scale * 2;
    h *= Camera.scale * 2;
    
    if (w < 1 && h < 1) return;
    [x, y] = Camera.toRelative(x, y);
    
    fill(colour);
    // noStroke();
    stroke(colour);
    triangle(x + h * cos(theta),
             y + h * sin(theta),
             x + w * cos(theta + (2/3) * PI),
             y + w * sin(theta + (2/3) * PI),
             x + w * cos(theta + (4/3) * PI),
             y + w * sin(theta + (4/3) * PI));
  }
}