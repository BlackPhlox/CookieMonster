let x = document.getElementById("demo");
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
let Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

let engine;
let world;
let circles = [];
let boundaries = [];

let background_color;

let ground;

let leftEdge;
let rightEdge;

let cookie_img;

let e1, e2;

let cm_lower_img;
let cm_upper_img;

const height_offset = 300;

const cookie_min_dir = 40;
const cookie_max_dir = 80;

const cookie_init_vel_min = -0.05;
const cookie_init_vel_max = 0.05;

const debug_show_bounds = false;
const debug_force_offline = false;

let spaceHasBeenPressed = false;

function setup() {
  cookie_img = loadImage("cookie.png");
  cm_lower_img = loadImage('cookiemonster_lower.png');
  cm_upper_img = loadImage('cookiemonster_upper.png');
  imageMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  background_color = color(51);
  //Engine.run(engine);
  let b_spacing = 160;
  let b_h_off = 110;
  let b_ex_w = b_spacing - 50;
  engine.world.gravity.y = 0.1;
  leftEdge = width/2-b_spacing;
  rightEdge = width/2+b_spacing;
  boundaries.push(new Boundary(leftEdge, height-height_offset-b_h_off, 800 * 0.8, 20, 1.45));
  boundaries.push(new Boundary(rightEdge, height-height_offset-b_h_off, 800 * 0.8, 20, -1.45));
  boundaries.push(new Boundary(width/2-cookie_max_dir-b_ex_w, 0, 800 * 0.6, 20, HALF_PI));
  boundaries.push(new Boundary(width/2+cookie_max_dir+b_ex_w, 0, 800 * 0.6, 20, HALF_PI));

  let def_x = width/2+10;
  let def_y = height-height_offset-130;
  let eye_size = 120;
  let spread_x=65;
  let spread_y=35;
  e1 = new Eye(def_x-spread_x+3,def_y-spread_y-11, eye_size);
  e2 = new Eye(def_x+spread_x-2,def_y-spread_y-2, eye_size);
}

 function keyPressed() {
   if(key == ' '){
    spaceHasBeenPressed = true;
	  cookieGen();
  }
}

let getCounter = 0;
let isConnected = true;
const noConnectionMsg = "Could not connect to server";
const altMethod = "Press 'space' to spawn cookies anyway";

function draw() {
  background(background_color);
  Engine.update(engine);
  
  drawFrontBack();
  
  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
  }
  
  drawFrontFace();
 
  getCounter++;
  if(getCounter % 240 == 0){
    checkServerForCookies();
  }
  if(!isConnected && !spaceHasBeenPressed){
    circles = [];
    textSize(72);
    text(noConnectionMsg, width/2-(textWidth(noConnectionMsg)/2), height_offset);
    textSize(42);
    text(altMethod, width/2-(textWidth(altMethod)/2), height_offset + 40);
  } 

  if(debug_show_bounds){
    for (let i = 0; i < boundaries.length; i++) {
      boundaries[i].show();
    }
  }

  drawUrl();
}

function cookieGen(data){
  let displayData;
  if(data == undefined){
    displayData = "Fake cookie"
  } else displayData = data;
  circles.push(new Cookie(displayData, cookie_img, random(leftEdge,rightEdge), -cookie_max_dir, random(cookie_min_dir, cookie_max_dir), random(cookie_init_vel_min, cookie_init_vel_max)));
}

function checkServerForCookies(){
  fetch("http://localhost:5123/cookies")
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .then(data => {
      isConnected = !debug_force_offline;
      if(!isEmpty(data)){
        console.log(data);
        cookieGen(data);  
      }
    })
    .catch(error => {
      if(error instanceof TypeError) isConnected = false;
    });
}

function handleErrors(response) {
  let contentType = response.headers.get('content-type');
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
  let i, n, s = '';
        e = ['🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🔵','🍪'];
        s+='👄';
        for (i = 0; i < 4; i++) {
            n = Math.floor(e.length * ((Math.sin((Date.now()/300) + i)+1)/2));
            s+=e[n]; 
        }
        window.location.hash = s;
}

function getClosestPos(x,y){
  let ownP = createVector(x,y);
  let closest;
  let closestDist = Number.MAX_VALUE;
  for (let i = 0; i < circles.length; i++) {
    let p = createVector(circles[i].body.position.x,circles[i].body.position.y);
    if(p.y<height-20){
        let d = ownP.dist(p);
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
	translate(width/2,height-height_offset);
	noStroke();
  image(cm_upper_img, 0, 0);
  
  pop();
  let pos = getClosestPos(width/2,height-height_offset-25);
  if(pos) e1.update(pos.x, pos.y); else e1.update(mouseX, mouseY);
  if(pos) e2.update(pos.x, pos.y); else e2.update(mouseX, mouseY);
  e1.display();
  e2.display();
}

const greybox_width = 500;
function drawFrontFace(){
	push();
	translate(width/2,height-height_offset);
  fill(background_color);
  noStroke();
  rect(-greybox_width/2,150,greybox_width,500);
  image(cm_lower_img, 0, 0);
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
    noStroke();
    translate(this.x, this.y);
    fill(255);
    ellipse(0, 0, this.size, this.size);
    rotate(this.angle);
    fill(0);
    ellipse(this.size / 4, 0, this.size / 2, this.size / 2);
    pop();
  };
}
