// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/uITcoKpbQq4

function Cookie(data, img ,x, y, r, rot) {
  var options = {
    friction: 0,
    restitution: 0.95
  }
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  this.img = img;
  this.body.angle = rot;
  World.add(world, this.body);

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    image(img,-18,-18,this.r*2,this.r*2);
    textSize(16);
    textAlign(CENTER);
    text(data,-18,-18);
	  fill(127);
    //ellipse(0, 0, this.r * 2);
    pop();
  }

}
