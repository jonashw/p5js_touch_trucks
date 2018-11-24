var looping = true;

var grid, car, navigation;

function preload(){
}

function setup() { 
  colorMode(HSL,255);
  rectMode(CENTER); 
  angleMode(DEGREES);

  grid = createGrid(7,7,80);
  car = createCar(createVector(1, 1), createVector(1,0));
  navigation = createNavigation(grid);

  resizeCanvas(windowWidth, windowHeight);

  handlePointAction({x:442,y:242});
} 

function mouseMoved(){  }
function touchMoved(){  }

function touchStarted(){
  if(touches.length > 0 ){
    let touch = touches[touches.length - 1];
    handlePointAction(touch);
  }
  return false; // This is to prevent pinch-zooming on touch devices.
}

function mousePressed(){
  handlePointAction(createVector(mouseX,mouseY));
}

function handlePointAction(point){
  console.log('point action:', point);
  navigation.routeImproved(car.getPosition(), point, car.getHeading());
  car.schedule(100,() => {
    let target = navigation.popTarget();
    if(target){
      car.setPosition(target);
    }
  });
}


function keyPressed(){
  if(key == 'D'){
  }
  if(keyCode == ESCAPE){
    looping = !looping;
    if(looping){
      loop();
    } else {
      noLoop();
    }
  }
}

function draw() { 
  car.update();
  background(00,0,60);
  grid.draw();
  navigation.draw();
  car.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}