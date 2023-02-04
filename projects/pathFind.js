class LineSegment {
  constructor(start, end, headInclusive = true, tailInclusive = false) {
    if (start.length !== 2 || end.length !== 2) {
      throw new Error("Coordinates must be 2 dimensional!");
    }
    this.head = start.slice();
    this.tail = end.slice();
    this.headInclusive = headInclusive;
    this.tailInclusive = tailInclusive;
  }

  collision(other) {
    return LineSegment.collision(this, other);
  }

  static collision(lineA, lineB) {
    const A_slope = LineSegment.findSlope(lineA);
    const B_slope = LineSegment.findSlope(lineB);
    if (A_slope === B_slope) {
      return false;
    }
    // Check for tail collision
    if (lineA.tailX() === lineB.tailX() && lineA.tailY() === lineB.tailY()) {
      return lineA.tailInclusive && lineB.tailInclusive;
    }
    if (lineA.headX() === lineB.headX() && lineA.headY() === lineB.headY()) {
      return lineA.headInclusive && lineB.headInclusive;
    }
    if (lineA.tailX() === lineB.headX() && lineA.tailY() === lineB.headY()) {
      return lineA.tailInclusive && lineB.headInclusive;
    }
    if (lineA.headX() === lineB.tailX() && lineA.headY() === lineB.tailY()) {
      return lineA.headInclusive && lineB.tailInclusive;
    }
    const A_constant = lineA.headY() - A_slope * lineA.headX();
    const B_constant = lineB.headY() - B_slope * lineB.headX();
    const xIntersection = (B_constant - A_constant) / (A_slope - B_slope);
    return (
      (xIntersection >= lineA.headX() && xIntersection <= lineA.tailX()) ||
      (xIntersection >= lineA.tailX() && xIntersection <= lineA.headX())
    );
  }

  headX() {
    return this.head[0];
  }

  headY() {
    return this.head[1];
  }

  tailX() {
    return this.tail[0];
  }

  tailY() {
    return this.tail[1];
  }

  static findSlope(line) {
    return (line.headY() - line.tailY()) / (line.headX() - line.tailX());
  }
}

const a = [1, 0];
const b = [-1, 0];
const c = [0, 1];
const d = [0, 2];
const x = new LineSegment(a, b, false, false);
const y = new LineSegment(c, d, false, false);
console.log(x.collision(y));
