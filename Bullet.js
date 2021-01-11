

class Bullet {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle).setMag(7);
    this.r = 3;
    this.distTravelled = 0;
  }

  update() {
    this.pos.add(this.vel);
    this.distTravelled += this.vel.mag();
  }

  show() {
    noStroke();
    fill(247, 134, 242);
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}
