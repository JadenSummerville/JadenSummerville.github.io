let debug = false;
function drawDot(canvasId, x, y) {
  // Get the canvas element
  const canvas = document.getElementById(canvasId);
  // Get the 2D context of the canvas
  const ctx = canvas.getContext("2d");
  // Set the color of the dot
  ctx.fillStyle = "red";
  // Draw a small dot at the given coordinates
  ctx.fillRect(x, y, 3, 3);
}
function rotateImage(x, y, imageId) {
  var img = document.getElementById(imageId);
  var angle = Math.atan2(x, y) * 180 / Math.PI;
  console.log(angle);
  img.style.transform = "rotate(" + angle + "deg)";
}
function drawLine(x1, y1, x2, y2) {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function collisionAt(lineA, lineB) {
    let A_slope = LineSegment.findSlope(lineA);
    let B_slope = LineSegment.findSlope(lineB);
    if (A_slope === B_slope) {
      return null;
    }
    
    let A_constant = lineA.headY() - A_slope * lineA.headX();
    let B_constant = lineB.headY() - B_slope * lineB.headX();
    
    let collision = new Array(2);
    collision[0] = (A_constant - B_constant) / (B_slope - A_slope);
    collision[1] = A_slope * collision[0] + A_constant;
    
    return collision;
  }
class LineSegment {
    constructor(start, end) {
      if (start.length !== 2 || end.length !== 2) {
        throw new Error("Coordinates must be 2 dimensional!");
      }
      this.head = start.slice();
      this.tail = end.slice();
      if(this.head[0]==this.tail[0]){
        this.head[0]+0.1;
      }
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
    collisionAt(other) {
      let goal = collisionAt(this, other);
      return goal;
    }
    findSlope(){
      return LineSegment.findSlope(this);
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
    magnitude() {
      let x = this.headX() - this.tailX();
      let y = this.headY() - this.tailY();
      let magnitude = Math.sqrt(x * x + y * y);
      return magnitude;
    }
    clone() {
      let pointA = [this.tailX(), this.tailY()];
      let pointB = [this.headX(), this.headY()];
      let new_wall = new LineSegment(pointB, pointA);
      return new_wall;
    }
    draw(){
      drawLine(this.headX(), this.headY(), this.tailX(), this.tailY());
    }
  }


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
        if(hypotenus < 4){
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
        if(this.velocity_x != 0 && this.velocity_y != 0){
          rotateImage(this.velocity_x, -this.velocity_y,"agent");
        }
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



  class ObstacleCourse {
    constructor(coordinates){
      this.walls=new Set();
  }
    addWall(wall){
      let newWall = wall.clone();
      this.walls.add(newWall);
    }
    collision(input) {
      if (this.getCollision(input) === null) {
        return false;
      }
      return true;
    }
    collisionAt(input){
      var collision = this.getLineSegmentOfCollision(input);
      if(collision == null){
        return null;
    }
    return collision.collisionAt(input);
    }
    getCollision(input) {
      for (let line of this.walls) {
        if (line.collision(input)) {
          return line;
        }
      }
      return null;
    }
    getLineSegmentOfCollision(input) {
      let minRange = -1;
      let collision = null;
      for (let line of this.walls) {
        if (line.collision(input)) {
          const c1 = line.collisionAt(input);
          const c2 = [input.tailX(), input.tailY()];
          const colide = new LineSegment(c1, c2);
          const magnitude = colide.magnitude();
          if (magnitude < minRange || minRange === -1) {
            minRange = magnitude;
            collision = line;
          }
        }
      }
      return collision;
    }
    draw(){
      for (let wall of this.walls) {
        wall.draw();
      }
    }
  }



  class TwoWayGraph {
    constructor(lines, nodes) {
      if (nodes.length < 2) {
        throw new Error("Must have two or more nodes in array");
      }
      this.coordinates = new Map();
      let arrayListLines = TwoWayGraph.doubleArrayToArrayList(lines);
      this.obstacles = new ObstacleCourse();
      for(var i = 0; i != arrayListLines.length; i+=2){
        let tail = arrayListLines[i];
        let head = arrayListLines[i+1];
        let line = new LineSegment(head, tail);
        this.obstacles.walls.add(line);
    }
      // Add every node to the graph
      for (let i = 0; i < nodes.length; i++) {
        const set = new Set();
        this.coordinates.set(nodes[i].join(','), set);
      }

      // Add edges
      const elements = [...this.coordinates.keys()];
      for (const node1 of elements) {
        for (const node2 of elements) {
          if (node1 !== node2) {
            const lineSegment = new LineSegment(
              TwoWayGraph.convertArrayListToDoubleArray(node1.split(',').map(Number)),
              TwoWayGraph.convertArrayListToDoubleArray(node2.split(',').map(Number))
            );
            
            if (!this.obstacles.collision(lineSegment)) {
              this.coordinates.get(node1).add(node2.split(',').map(Number));
            }
            this.checkRep();
          }
        }
      }
      this.checkRep();
    }
    checkRep(){
      if(false){
        for(const key of this.coordinates.keys()){
          if(!typeof key === 'string'){
            throw new Error("Non-string key");
          }
          if(!typeof this.coordinates.get(key) === 'set'){
            throw new Error("String child");
          }
          for(const coord of this.coordinates.get(key)){
            if(coord.length != 2){
              throw new Error("Length not 2");
            }
          }
        }
      }
    }
    children(node) {
      this.checkRep();
      const goal = [];
      const children = this.coordinates.get(node.join(','));
      for (const child of children) {
        goal.push(child);
      }
      this.checkRep();
      return goal;
    }
    validNodes(point) {
      this.checkRep();
      const goal = [];
      
      for (const coordinate of this.coordinates.keys()) {
        const line = new LineSegment(
          this.convertArrayListToDoubleArray(point),
          this.convertArrayListToDoubleArray(coordinate)
        );
        
        if (!this.obstacles.collision(line)) {
          goal.push(coordinate);
        }
      }
      this.checkRep();
      return goal;
    }
    FindPath(start, end) {
      this.checkRep();
      if (!this.coordinates.has(start.join(',')) || !this.coordinates.has(end.join(','))) {
        throw new Error("Nodes not present in graph!");
      }
      const queue = new PriorityQueue();
      // Initialize distances to all nodes as infinity, except for the starting node which is 0
      const distances = {};
      distances[start.join(',')] = 0;
    
      // Add the starting node to the queue with a priority of 0
      queue.enqueue(start.join(','), 0);
      // Keep track of the previous node for each node, so we can reconstruct the shortest path at the end
      const previous = {};
    
      // Loop until the queue is empty
      while (!queue.isEmpty()) {
        // Get the node with the highest priority (i.e. the node with the smallest distance from the start)
        const current = queue.dequeue().element.split(',').map(Number);
        // If we've reached the end node, we're done
        if (current[0] === end[0] && current[1] === end[1]) {
          // Reconstruct the shortest path by following the previous pointers from the end to the start
          const path = [end];
          let node = end.join(',');
          while (previous.hasOwnProperty(node)) {
            path.unshift(previous[node]);
            node = previous[node];
          }
          this.checkRep();
          return path;
        }
    
        // Loop over the child nodes of the current node
        const children = this.children(current);
        if (children) {
          for (const child of children) {
            // Calculate the distance from the start to the child node
            const distance = distances[current.join(',')] + (new LineSegment(child, current)).magnitude();
    
            // If this is the first time we've seen this node, or if the distance from the start to the node is less than the current distance, update the distances and previous pointers
            if (!distances.hasOwnProperty(child) || distance < distances[child]) {
              distances[child] = distance;
              previous[child] = current;
              queue.enqueue(child.join(','), distance);
            }
          }
        }
      }
      this.checkRep();
      return null;
    }
    doubleArrayToArrayList(original) {
      const goal = [];
      for(let i = 0; i < original.length; i++) {
        const coordinate = original[i];
        const newCoordinate = TwoWayGraph.convertArrayListToDoubleArray(coordinate);
        goal.push(newCoordinate);
      }
      return goal;
    }
    PathFind(start, end) {
      this.checkRep();
      if (JSON.stringify(start) === JSON.stringify(end)) {
        return null;
        }
        const toRemove = new Set();
        if (!this.coordinates.has(start)) {
        this.addNode(start);
        toRemove.add(start);
        }
        if (!this.coordinates.has(end)) {
        this.addNode(end);
        toRemove.add(end);
        }
        const goal = this.FindPath(start, end);
        if (toRemove.has(start)) {
        this.removeNode(start);
        }
        if (toRemove.has(end)) {
        this.removeNode(end);
        }
        this.checkRep();
        return goal;
  }
  static sort(point, data) {
    const distanceComparator = (o1, o2) => {
      const distance1 = Math.sqrt(Math.pow(o1[0] - point[0], 2) + Math.pow(o1[1] - point[1], 2));
      const distance2 = Math.sqrt(Math.pow(o2[0] - point[0], 2) + Math.pow(o2[1] - point[1], 2));
      return distance1 - distance2;
    };
    data.sort(distanceComparator);
  }
  draw(debug) {
    this.obstacles.draw();
    if(debug){
      for(const coord of this.coordinates.keys()){
        var nums = coord.split(",").map(Number);
        drawDot("myCanvas", nums[0], nums[1]);
      }
    }
  }
  static doubleArrayToArrayList(original) {
    const goal = [];
    for (let i = 0; i < original.length; i++) {
        const coordinate = original[i];
        const newCoordinate = TwoWayGraph.convertArrayListToDoubleArray(coordinate);
        goal.push(newCoordinate);
    }
    return goal;
}

static convertArrayListToDoubleArray(original) {
  let coordinates = new Array(2);
  coordinates[0] = original[0];
  coordinates[1] = original[1];
  return coordinates;
}
removeNode(node) {
  // Remove node from graph
  let children = this.coordinates.get(node.join(','));
  if (children == null) {
      return false;
  }
  this.coordinates.delete(node.join(','));
  // Remove node from children of other nodes
  for (let parent of this.coordinates.keys()) {
      this.coordinates.get(parent).delete(node);
  }
  return true;
}
addNode(node) {
  this.checkRep();
  if (node.length !== 2) {
      throw new Error('node was not 2d!');
  }
  if (this.coordinates.has(node.join(','))) {
    this.checkRep();
      return false;
  }
  const childPoints = new Set();
  this.coordinates.set(node.join(','), childPoints);
  // For each node
  for (const point of this.coordinates.keys()) {
      // If there is line of sight
      if(point.split(',').map(Number)[0] != node[0] && point.split(',').map(Number)[1] != node[1]){
       if (this.lineOfSight(point.split(',').map(Number), node)) {
          this.coordinates.get(point).add(node);
          childPoints.add(point.split(',').map(Number));
        }
    }
  }
  this.checkRep();
  return true;
}
lineOfSight(point1, point2) {
  if (point1.length !== 2 || point2.length !== 2) {
      throw new Error("All coordinates must be 2d.");
  }
  const line = new LineSegment(TwoWayGraph.convertArrayListToDoubleArray(point1), TwoWayGraph.convertArrayListToDoubleArray(point2));
  return !this.obstacles.collision(line);
}
  }
  class PriorityQueue {
    constructor() {
      this.items = [];
    }
  
    enqueue(element, priority) {
      const item = { element, priority };
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        if (item.priority < this.items[i].priority) {
          this.items.splice(i, 0, item);
          added = true;
          break;
        }
      }
      if (!added) {
        this.items.push(item);
      }
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift();
    }
  
    front() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items[0];
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    size() {
      return this.items.length;
    }
  
    print() {
      for (let i = 0; i < this.items.length; i++) {
        console.log(`${this.items[i].element} - ${this.items[i].priority}`);
      }
    }
  }



class SuperAgent {
  constructor() {
    this.agent = new Agent(150, 150, 10000, 0, 10000, 0, 0.95, 1);
    this.path = null;

    const lines = [
      [59, 200],[59.5, 100.01],[59, 300],[59.5, 500.01],
      [59.5,100],[1000,100],[200,600],[201,450],[201,450],[351,450],[350,600],[351,450],
      [200,380],[351,350],[200,320],[301,300],[351,350],[380,250],[300,300],[330,200],
      [612,180],[330,200],[401,350],[430,250],[430,250],[570,239],
      [612,180],[611,380],[570,239],[571,420],[571,420],[651,420],[651,420],[650,320],
      [491,188],[490,100]
    ];

    const point1 = [40, 40];
    const point2 = [100, 250];
    const point3 = [19, 250];
    const point4 = [1101, 150];
    const point5 = [1100, 50];
    const point6 = [20, 520];
    const point7 = [100, 520];
    const point8 = [180, 420];
    const point9 = [176, 355];
    const point10 = [326, 324];
    const point11 = [355, 230];
    const point12 = [409, 225];
    const point13 = [592, 213];
    const point14 = [595, 399];
    const point15 = [630, 400];
    const point16 = [166, 300];
    const point17 = [291, 170];
    const point18 = [380, 377];
    const point19 = [386, 439];
    const point20 = [334, 295];
    const point21 = [684, 450];
    const point22 = [536, 445];
    const point23 = [633,302];
    const point24 = [632,150];
    const point25 = [671,302];
    const nodes = [point1, point2, point3, point4, point5, point6, point7, point8, point9, point10, point11, point12, point13
    , point14, point15, point16, point17, point18, point19, point20, point21, point22, point23, point24, point25];

    this.graph = new TwoWayGraph(lines, nodes);
  }

  goTo(target) {
    const start = [this.agent.position_x, this.agent.position_y];
    this.path = this.graph.PathFind(start, target);
  }

  draw(debug) {
    this.graph.draw(debug);
  }

  move() {
    if (this.path === null) {
      this.agent.move();
      return;
    }

    const point = this.path[0];
    this.agent.aimAt(point[0], point[1]);
    this.agent.move();

    const point2 = this.at();
    const distance = new LineSegment(point, point2);

    if (distance.magnitude() < 25) {
      this.path.shift();
    }

    if (this.path.length === 0) {
      this.path = null;
    }
  }

  at() {
    return [this.agent.position_x, this.agent.position_y];
  }
}
document.addEventListener("click", function(event) {
  var canvas = document.getElementById("myCanvas");
a.goTo([event.clientX-canvas.offsetLeft,event.clientY-canvas.offsetTop]);

if(debug){
  alert((event.clientX-canvas.offsetLeft)+","+(event.clientY-canvas.offsetTop));
}

document.getElementById("cheese").style.top = event.clientY-10+"px";
document.getElementById("cheese").style.left = event.clientX-10+"px";
});
function steps(){
    var canvas = document.getElementById("myCanvas");
    a.move();
    document.getElementById("agent").style.top = canvas.offsetTop+a.agent.position_y-10+"px";
    document.getElementById("agent").style.left = canvas.offsetLeft+a.agent.position_x-10+"px";
}


const a = new SuperAgent();
const target = [2.0, 6.0];
a.goTo(target);
a.draw(debug);

var canvas = document.getElementById("myCanvas");
document.getElementById("cheese").style.top = canvas.offsetTop+"px";
document.getElementById("cheese").style.left = canvas.offsetLeft+"px";

const interval = setInterval(function() {
    steps();
  }, 1);