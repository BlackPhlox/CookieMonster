var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude; 
}


// module aliases
var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
var world;
var circles = [];
var boundaries = [];

var ground;

var leftEdge;
var rigthEdge;

let img;
function preload() {
  
}

let e1, e2;

function setup() {
  img = loadImage("cookie.png");
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  //Engine.run(engine);
  engine.world.gravity.y = 0.1;
  leftEdge = width/2-140;
  rightEdge = width/2-140+280;
  boundaries.push(new Boundary(leftEdge, height-130, 400 * 0.6, 20, 0.45));
  boundaries.push(new Boundary(rightEdge, height-130, 400 * 0.6, 20, -0.45));
  boundaries.push(new Boundary(width/2-140+180, height+30, 400 * 0.6, 20, HALF_PI));
  boundaries.push(new Boundary(width/2-140+100, height+30, 400 * 0.6, 20, HALF_PI));

  var def_x = width/2;
  var def_y = height-100;
  e1 = new Eye(def_x-15,def_y-35, 35);
  e2 = new Eye(def_x+15,def_y-35, 35);
}

 function keyPressed() {
   if(key == ' '){
	  circles.push(new Cookie(img,random(leftEdge,rightEdge), -20, random(15, 20), random(-0.05,0.05)));
  }
}

let getCounter = 0;
let isConnected = true;
const noConnectionMsg = "Could not connect to server";
function draw() {
  
  background(51);
  Engine.update(engine);
  
  drawFrontBack();
  
  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
  }
  /*
  for (let i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }
  */
  drawFrontFace();
 
  getCounter++;
  if(getCounter % 240 == 0){
    checkServerForCookies();
  }
  if(!isConnected){
    circles = [];
    textSize(72);
    text(noConnectionMsg, width/2-(textWidth(noConnectionMsg)/2),height/2);
  } 
  drawUrl();
}

function checkServerForCookies(){
  fetch("http://localhost:5123/cookies")
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .then(data => {
      isConnected = true;
      if(!isEmpty(data)){
        console.log(data);
        circles.push(new Cookie(img,random(leftEdge,rightEdge), -20, random(15, 20), random(-0.05,0.05)));      
      }
    })
    .catch(error => {
      if(error instanceof TypeError) isConnected = false;
    });
}

function handleErrors(response) {
  var contentType = response.headers.get('content-type');
    if (!response.ok || response.status !== 200) {
      throw new Error('Network response was not ok. : ' + response.statusText);
    }

    if(contentType && contentType.includes('application/json')) {
      return response;
    }
    throw new TypeError("Oops, we haven't got JSON!");
}

function isEmpty(str){
  return str == "{}";
}


function drawUrl(){
  var i, n, s = '';
        e = ['🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🍪'];
        s+='👄';
        for (i = 0; i < 4; i++) {
            n = Math.floor(e.length * ((Math.sin((Date.now()/300) + i)+1)/2));
            s+=e[n]; 
        }

        window.location.hash = s;
}

function getClosestPos(x,y){
  var ownP = createVector(x,y);
  var closest;
  let closestDist = Number.MAX_VALUE;
  for (var i = 0; i < circles.length; i++) {
    var p = createVector(circles[i].body.position.x,circles[i].body.position.y);
    if(p.y<height-20){
        var d = ownP.dist(p);
      if(d<closestDist) {
        closesDist = d;
        closest = p;
      };
    }
  }
  return closest;
}

function drawFrontBack(){
	push();
	translate(width/2,height-100);
	noStroke();
	fill(0,0,255);
	ellipse(0,0,100,100);
	
  fill(0);
  if(isConnected){
    arc(0, 0, 80, 80, 0, PI , CHORD);
  } else {
    push();
    translate(0,25);
    scale(0.5);
    rotate(radians(180));
    fill(0);
    arc(0, 0, 80, 80, 0, PI , CHORD);
    pop();
  }

  fill(255);
  stroke(0);
	ellipse(-15,-35,35,35);
	ellipse(15,-35,35,35);
  pop();
  var pos = getClosestPos(width/2,height-100-25);
  if(pos) e1.update(pos.x, pos.y); else e1.update(mouseX, mouseY);
  if(pos) e2.update(pos.x, pos.y); else e2.update(mouseX, mouseY);
  e1.display();
  e2.display();


}

function drawFrontFace(){
	push();
	translate(width/2,height-100);
	fill(51);
	noStroke();
	rect(-35,41,70,100);
	rect(25,35,20,20);
	rect(-25,35,-20,20);
	translate(0,2);
	stroke(0,0,255);
	noFill();
	strokeWeight(9);
	strokeCap(SQUARE);
	bezier(-32, 30, -15+10, 45, 0, 50, 35, 30);
	

	pop();
}

function Eye(tx, ty, ts) {
  this.x = tx;
  this.y = ty;
  this.size = ts;
  this.angle = 0;

  this.update = function(mx, my) {
    this.angle = atan2(my - this.y, mx - this.x);
  };

  this.display = function() {
    push();
    translate(this.x, this.y);
    fill(255);
    ellipse(0, 0, this.size, this.size);
    rotate(this.angle);
    fill(0);
    ellipse(this.size / 4, 0, this.size / 2, this.size / 2);
    pop();
  };
}
