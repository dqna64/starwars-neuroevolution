

class Obstacle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = random(10, 30);
    this.numPoints = Math.ceil(random(5, 10));
    this.noiseMax = random(0.8);
    this.walls = this.generateWalls();
  }

  show() {
    for (let wall of this.walls) {
      wall.show();
    }
  }

  generateWalls() {
    let middle = [];
    let walls = [];

    let startX = random(1000);
    let startY = random(1000);
    for (let n = 0; n < this.numPoints; n++) {
      let a = map(n, 0, this.numPoints, 0, TWO_PI);
      let xoff = map(cos(a), -1, 1, 0, this.noiseMax) + startX;
      let yoff = map(sin(a), -1, 1, 0, this.noiseMax) + startY;
      let rx = map(noise(xoff, yoff), 0, 1, 0, this.r);
      let ry = map(noise(xoff, yoff), 0, 1, 0, this.r);
      let x = this.pos.x + (rx) * cos(a);
      let y = this.pos.y + (ry) * sin(a);
      middle.push(createVector(x, y));
    }

    for (let i = 0; i < middle.length; i++) {
      let a1 = middle[i];
      let b1 = middle[(i+1) % middle.length]; // BIG BRAIN
      walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y, "wall"));
    }

    return walls;
  }
}
