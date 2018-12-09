function autoRun(){
  handlePointAction({x:442,y:242});
}

var looping = true;

var grid, timerDot, navigation, durationMenu;

function setup() { 
  colorMode(HSL,255);
  rectMode(CENTER); 
  angleMode(DEGREES);

  let levels = [
    {name: 'Letter S',         grid: createAlphaGrid('S')},
    {name: 'Letter A',         grid: createAlphaGrid('A')},
    {name: 'Letter W',         grid: createAlphaGrid('W')},
    {name: 'Letter Y',         grid: createAlphaGrid('Y')},
    {name: 'Letter E',         grid: createAlphaGrid('E')},
    {name: 'Letter R',         grid: createAlphaGrid('R')},
    {name: 'ZigZag',           grid: createZigZagGrid()},
    {name: 'Vertical Stripes', grid: createVerticalStripesGrid(13,8) },
    {name: 'Plus 11x9',        grid: createPlusGrid(13,8)},
    {name: 'Noodle 11x8',      grid: createNoodleGrid(13,8)},
    {name: 'Checker 4x4',      grid: createCheckerGrid(4,4)},
    {name: 'Checker 5x5',      grid: createCheckerGrid(5,5)},
    {name: 'Checker 7x7',      grid: createCheckerGrid(7,7)},
    {name: 'Checker 12x12',    grid: createCheckerGrid(13,13)},
  ];

  let startingLevel = levels[1];
  initTimerDurationMenu([10,25,50,100,150,200], 50);
  initLevelMenu(levels, startingLevel);

  $(document).on('click touchstart mousedown','select',function(e){
    /* This allows desktop users to use the select menus without 
    ** affecting the game itself. */
    e.stopPropagation();
  });

  resizeCanvas(windowWidth, windowHeight);
} 

function initLevel(level){
  grid = level.grid;
  let dotPosition = grid.findNearest(createVector(grid.scale, grid.scale));
  timerDot = createTimerDot(dotPosition, createVector(1,0));
  navigation = createNavigation(grid);
  autoRun();
}

var trySelectLevelByIndex, levelMenu;
function initLevelMenu(levels, selectedLevel){
  let _storageKey = 'levelName';
  levelMenu = createSelect();
  levelMenu.position(10, windowHeight - 50);
  levels.forEach(l => levelMenu.option(l.name));
  let persistedLevelName = localStorage.getItem(_storageKey);
  let persistedLevel = levels.find(l => l.name == persistedLevelName);
  if(persistedLevel){
    levelMenu.value(persistedLevelName);
    selectedLevel = persistedLevel;
  }
  else if(selectedLevel){
    levelMenu.value(selectedLevel.name);
  }
  else {
    selectedLevel = levels[0];
    levelMenu.value(selectedLevel.name);
  }

  levelMenu.style('font-size','2em');

  function changed(){
    let v = levelMenu.value();
    let level = levels.find(l => l.name === v);
    console.log('level changed',levelMenu.value(),level);
    localStorage.setItem(_storageKey, v);
    initLevel(level);
  }

  levelMenu.changed(changed);

  let options = Array.from(levelMenu.child());
  trySelectLevelByIndex = index => {
    let selected = options[index - 1];
    if(selected){
      levelMenu.value(selected.value);
      changed();
    }
  };

  initLevel(selectedLevel);
}

function initTimerDurationMenu(durations,selectedDuration){
  let _storageKey = 'timerDuration';
  var menu = createSelect();
  durationMenu = menu;
  menu.position(windowWidth - 110, windowHeight - 50);
  durations.forEach(d => menu.option(d));
  let persistedDuration = parseInt(localStorage.getItem(_storageKey));
  if(persistedDuration && durations.indexOf(persistedDuration) > -1){
    menu.value(persistedDuration);
  }
  else if(selectedDuration){
    menu.value(selectedDuration);
  } else {
    menu.value(durations[0]);
  }
  menu.style('font-size','2em');
  menu.changed(function(){
    let v = menu.value();
    localStorage.setItem(_storageKey, v);
    console.log('duration changed: ', v);
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
  navigation.routeImproved(timerDot.getPosition(), point, timerDot.getHeading());
  timerDot.schedule(durationMenu.value(),() => {
    let target = navigation.popTarget();
    if(target){
      timerDot.setPosition(target);
    }
  });
}

function keyPressed(){
  if(key == 'D'){
  }
  let n = parseInt(key);
  if(!isNaN(n)){
    console.log('you pressed a number:', n);
    trySelectLevelByIndex(n);
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
  timerDot.update();
  background(00,0,60);
  grid.draw();
  navigation.draw();
  timerDot.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}