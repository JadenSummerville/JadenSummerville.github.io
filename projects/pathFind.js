class LineSegment {
    constructor(start, end) {
      if (start.length !== 2 || end.length !== 2) {
        throw new Error("Coordinates must be 2 dimensional!");
      }
      this.head = start.slice();
      this.tail = end.slice();
    }
  
    static collision(lineA, lineB) {
      var A_slope = LineSegment.findSlope(lineA);
      var B_slope = LineSegment.findSlope(lineB);
      if (A_slope === B_slope) {
        return false;
      }
      var A_constant = lineA.headY()-A_slope*lineA.headX();
      var B_constant = lineB.headY()-B_slope*lineB.headX();
      var x_of_collision = (A_constant-B_constant)/(B_slope-A_slope);
      var y_of_collision = A_slope*x_of_collision+A_constant;
      if(lineA.headX() < x_of_collision && lineA.tailX() < x_of_collision){
              return false;
          }
          if(lineA.headX() > x_of_collision && lineA.tailX() > x_of_collision){
              return false;
          }
          if(lineA.headY() < y_of_collision && lineA.tailY() < y_of_collision){
              return false;
          }
          if(lineA.headY() > y_of_collision && lineA.tailY() > y_of_collision){
              return false;
          }
          //Point colides with line A
          if(lineB.headX() < x_of_collision && lineB.tailX() < x_of_collision){
              return false;
          }
          if(lineB.headX() > x_of_collision && lineB.tailX() > x_of_collision){
              return false;
          }
          if(lineB.headY() < y_of_collision && lineB.tailY() < y_of_collision){
              return false;
          }
          if(lineB.headY() > y_of_collision && lineB.tailY() > y_of_collision){
              return false;
          }
      return true;
    }
  
    collision(other) {
      return LineSegment.collision(this, other);
    }
  
    static findSlope(line) {
      return (line.headY() - line.tailY()) / (line.headX() - line.tailX());
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
  }
  class Pu {
    constructor(a){
        this.a=a;
    }
    A(){
        return a;
    }
  }
  /*
  const a = [1, 0];
  const b = [-1, 0];
  const c = [0.1, 0];
  const d = [0, 2];
  const pu = new Pu(a);
  const x = new LineSegment(pu.A(), b, false, false);
  const y = new LineSegment(c, d, true, true);
  console.log(x.collision(y));
  */
  class Agent {
    constructor(position_x, position_y, max_x, min_x, max_y, min_y, friction, speed) {
        if(position_x > max_x || position_x < min_x || position_y > max_y || position_y < min_y){
            throw new Error("Out of bounds error!");
        }
        if(friction < 0 || friction >= 1){
            throw new Error("Error, 0 < Friction <= 1 not met.");
        }
        this.position_x = position_x;
        this.position_y = position_y;
        this.max_x = max_x;
        this.min_x = min_x;
        this.max_y = max_y;
        this.min_y = min_y;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.friction = friction;
        this.speed = speed;
    }
    aimAt(x,y){
        if(x == NaN || y == NaN){
            throw new Error("Aiming at NaN coordinates!");
        }
        var x_V = x-this.position_x;
        var y_V = y-this.position_y;
        var hypotenus = Math.pow(x_V*x_V+y_V*y_V,.5);
        if(hypotenus < 5){
            return;
        }
        this.velocity_x += x_V/hypotenus;
        this.velocity_y += y_V/hypotenus;
    }
    move() {
        this.position_x += this.frictionMove(this.velocity_x);
        this.position_y += this.frictionMove(this.velocity_y);
        this.correct();
        this.velocity_x *= this.friction;
        this.velocity_y *= this.friction;
    }

    frictionMove(velocity) {
        return velocity * (1 - this.friction) * this.speed;
    }

    correct() {
        if(this.position_x > this.max_x){
            this.position_x = this.max_x;
            this.velocity_x *= -1;
        }else if(this.position_x < this.min_x){
            this.position_x = this.min_x;
            this.velocity_x *= -1;
        }
        if(this.position_y > this.max_y){
            this.position_y = this.max_y;
            this.velocity_y *= -1;
        }else if(this.position_y < this.min_y){
            this.position_y = this.min_y;
            this.velocity_y *= -1;
        }
    }
}
/*
const a = new Agent(50, 50, 100, 0, 100, 0, 0.5, 2);
for(let i = 0; i < 100; i++){
    a.move();
    a.aimAt(0,3);
    console.log(`X:${a.position_x} Y:${a.position_y}`);
}
console.log(a.position_x,a.position_y);
*/
const agent = new Agent(500, 500, 1000, 0, 1000, 0, 0.5, 2);
function steps(){
    agent.move();
    agent.aimAt(0,300);
    document.getElementById("agent").style.top = agent.position_y+"px";
    document.getElementById("agent").style.left = agent.position_x+"px";
}
const interval = setInterval(function() {
    steps();
  }, 1);
 
