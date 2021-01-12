

class Spaceship {
  constructor(brain=null) {
    this.r = 6;
    this.pos = createVector(random(BOUNDS, width-BOUNDS), random(BOUNDS, height-BOUNDS));
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 5;
    this.maxForce = 0.2;
    this.sight = SIGHT;
    this.range = RANGE;

    this.dead = false;
    this.timer = 0;
    this.score = 0;
    this.fitness = 0;

    this.rays = [];
    for (let a = -30; a <= 30; a+=10) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }

    this.bullets = [];

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(this.rays.length, 8, 3)
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.timer++;

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].setAngle(this.vel.heading())
    }

    for (let i = this.bullets.length-1; i >= 0; i--) {
      let bullet = this.bullets[i];
      bullet.update();
      if (bullet.distTravelled > this.range) {
        this.bullets.splice(i, 1);
        this.score -= 0.01;
      } else {
        for (let j = asteroids.length-1; j >= 0; j--) {
          let asteroid = asteroids[j];
          let dist = p5.Vector.dist(bullet.pos, asteroid.pos);
          if (dist <= bullet.r + asteroid.r) {
            this.bullets.splice(i, 1);
            this.score += 0.8;
            this.timer -= REWARD;
            asteroids.splice(j, 1);
            break;
          }
        }
      }
    }
  }

  show() {
    stroke(255);
    strokeWeight(1);
    fill(92, 222, 242);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() - PI/2);
    beginShape();
    vertex(0, this.r);
    vertex(-this.r/2, -this.r);
    vertex(this.r/2, -this.r);
    vertex(0, this.r);
    endShape(CLOSE);
    pop();

    if (showRays) {
      for (let ray of this.rays) {
        ray.show();
      }
    }

    if (showBullets) {
      for (let bullet of this.bullets) {
        bullet.show();
      }
    }
  }

  checkDeath(asteroids) {
    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.dead = true;
    } else if (this.timer > LIFESPAN) {
      this.dead = true;
    } else {
      for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i];
        let dist = p5.Vector.dist(this.pos, asteroid.pos);
        dist -= this.r;
        if (dist <= asteroid.r) {
          this.dead = true;
          this.score -= 0.3
        }
      }
    }
  }

  cast(asteroids) {
    let inputs = [];

    for (let ray of this.rays) {
      let closestAsteroid = asteroids[this.findNearest(asteroids)];
      let smallestDist = this.sight;
      if (closestAsteroid) {
        for (let wall of closestAsteroid.walls) {
          let pnt = ray.cast(wall);
          if (pnt) {
            let curDist = p5.Vector.dist(pnt, ray.pos);
            if (curDist < smallestDist && curDist <= this.sight) {
              smallestDist = curDist;
            }
          }
        }
      }

      inputs.push(map(smallestDist, 0, this.sight, 1, 0));
    }

    this.steer(inputs);
  }

  findNearest(objects) {
    let smallestDist = Infinity;
    let indClosest = null;
    for (let i = 0; i < objects.length; i++) {
      let dist = p5.Vector.dist(this.pos, objects[i].pos);
      if (dist < smallestDist) {
        smallestDist = dist;
        indClosest = i;
      }
    }
    return indClosest;
  }

  steer(inputs) {
    let outputs = this.brain.predict(inputs);
    let speed = map(outputs[0], 0, 1, 0, this.maxSpeed);
    let angle = map(outputs[1], 0, 1, -PI, PI);
    angle += this.vel.heading()
    let desiredVel = p5.Vector.fromAngle(angle).setMag(speed)
    let steerForce = desiredVel.sub(this.vel);
    steerForce.limit(this.maxForce);
    this.applyForce(steerForce);

    // console.log(outputs);
    if (outputs[2] >= 0.5) {
      this.shoot();
    } else {
      // this.score -= 0.01; // Punish if their do not shoot
    }
  }

  shoot() {
    let bullet = new Bullet(this.pos.x, this.pos.y, this.vel.heading());
    this.bullets.push(bullet);
  }

  calculateFitness() {
    this.fitness = pow(2, this.score);
  }

  mutate() {
    this.brain.mutate(MUTATION_RATE);
  }

  dispose() {
    this.brain.dispose();
  }
}
