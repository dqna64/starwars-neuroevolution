

class Boundary {
  constructor(x1, y1, x2, y2, type) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.type = type;
  }

  show() {
    if (this.type == "wall") {
      stroke(77, 187, 235, 255);
    } else if (this.type == "checkpoint") {
      stroke(87, 235, 215, 80);
    }
    strokeWeight(1);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }

  midpoint() {
    return createVector((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2)
  }
}
