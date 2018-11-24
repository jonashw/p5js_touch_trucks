function createCar(position, heading){
  let N = createVector(0,-1);
  let S = createVector(0,1);
  let E = createVector(1,0);
  let W = createVector(-1,0);
  let _totalFrames = undefined;
  let _framesLeft = undefined;
  let _doAfterFramesLeft = undefined;
  let _colorA = color(255,255,100);
  let _colorB = color(100,200,100);
  return {
    getPosition: () => position,
    setPosition: p => position = p,
    getHeading: () => heading,
    schedule: (delay,fn) => {
      _totalFrames = delay;
      _framesLeft = delay;
      _doAfterFramesLeft = fn;
    },
    update: () => {
      if(_framesLeft){
        _framesLeft--;
        if(_framesLeft <= 0){
          _framesLeft = undefined;
          if(_doAfterFramesLeft){
            _doAfterFramesLeft();
            let x = _colorA;
            _colorA = _colorB;
            _colorB = x;
          }
        }
      }
    },
    draw: () => {
      push();
      noStroke();
      fill(_colorA);
      translate(
        position.x * grid.scale,
        position.y * grid.scale);
      if(heading.equals(N)){ rotate(-90); }
      if(heading.equals(S)){ rotate( 90); }
      if(heading.equals(E)){ rotate(  0); }
      if(heading.equals(W)){ rotate(180); }
      ellipse(0, 0, 30, 30);
      let pct = _totalFrames && _framesLeft ? _framesLeft / _totalFrames : 1;
      fill(_colorB);
      arc(0,0,30,30, 0, 360 * pct, PIE)
      fill(0);
      //rect(10, 0, 5, 5);
      pop();
    }
  };
}