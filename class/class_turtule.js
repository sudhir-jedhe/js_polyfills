class Turtle {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  forward(distance) {
    this.x += distance * Math.cos(this.direction);
    this.y += distance * Math.sin(this.direction);
  }

  backward(distance) {
    this.forward(-distance);
  }

  left(angle) {
    this.direction += angle;
  }

  right(angle) {
    this.direction -= angle;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get heading() {
    return this.direction;
  }
}

const turtle = new Turtle(0, 0, 0);

turtle.forward(100);
turtle.left(90);
turtle.forward(100);

console.log(turtle.position); // { x: 100, y: 100 }
