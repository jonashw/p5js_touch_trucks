function autoRun(){
  handlePointAction({x:442,y:242});
}

var looping = true;

var grid, car, navigation;

function setup() { 
  colorMode(HSL,255);
  rectMode(CENTER); 
  angleMode(DEGREES);

  let levels = [
    {name: 'ZigZag', grid: createZigZagGrid(9,6,70) },
    {name: 'Vertical Stripes', grid: createVerticalStripesGrid(11,8,60) },
    {name: 'Plus 11x9', grid: createPlusGrid(11,9,60)},
    {name: 'Noodle 11x8', grid: createNoodleGrid(11,8,60)},
    {name: 'Checker 4x4', grid: createCheckerGrid(4,4,80)},
    {name: 'Checker 5x5', grid: createCheckerGrid(5,5,80)},
    {name: 'Checker 7x7', grid: createCheckerGrid(7,7,80)}
  ];

  let startingLevel = levels[3];
  initLevel(startingLevel);
  initLevelMenu(levels, startingLevel);

  resizeCanvas(windowWidth, windowHeight);
} 

function initLevel(level){
  grid = level.grid;
  let carPosition = grid.findNearest(createVector(grid.scale, grid.scale));
  car = createCar(carPosition, createVector(1,0));
  navigation = createNavigation(grid);
  autoRun();
}

function initLevelMenu(levels, selectedLevel){
  var levelMenu = createSelect();
  levelMenu.position(10, windowHeight - 50);
  levels.forEach(l => levelMenu.option(l.name));
  if(selectedLevel){
    levelMenu.value(selectedLevel.name);
  }
  levelMenu.style('font-size','2em');
  levelMenu.changed(function(){
    let v = levelMenu.value();
    let level = levels.find(l => l.name === v);
    console.log('level changed',levelMenu.value(),level);
    initLevel(level);
  });
  $(document).on('click touchstart','select',function(e){
    e.stopPropagation();
  });
}

function preload(){ }
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
  console.log('point action:', vectorToString(point));
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