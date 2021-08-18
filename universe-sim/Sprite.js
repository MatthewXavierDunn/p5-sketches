class Sprite {
  static sprites = [];

  constructor(x = 0, y = 0, radius = 0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    Sprite.sprites.push(this);
  }
  
  update() {}
  draw() {}
}