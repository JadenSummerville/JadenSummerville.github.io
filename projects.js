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
        if(hypotenus < 25){
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