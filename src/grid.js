function createGrid(w,h,scale){
  let cachedVector = (() => {
    var map = new Map();
    return (x,y) => {
      let key = `${x}:${y}`;
      if(map.has(key)){
        return map.get(key);
      }
      let v = createVector(x,y);
      map.set(key, v);
      return v;
    };
  })();

  var grid = {
    width: w,
    height: h,
    scale: scale,
    points: [],
    pointSet: new Set(),
    cachedVector: cachedVector,
    findNearest: p => {
      let s = scale/2;
      let projected = cachedVector(
        Math.min(Math.floor((p.x + s) / scale), w),
        Math.min(Math.floor((p.y + s) / scale), h));
      if(!grid.pointSet.has(projected)){
        return undefined;
      }
      return projected;
    },
    draw: () => {
      push();
      noStroke();
      grid.points.forEach(p => {
        fill(0,0,255);
        ellipse(p.x * scale, p.y * scale, 8);
      });
      grid.pairs.forEach(([a,b]) => {
        stroke(255);
        strokeWeight(1);
        line(
          a.x * scale,
          a.y * scale,
          b.x * scale,
          b.y * scale);
      });
      pop();
    }
  };

  grid.points = 
    concatAll(
      range(1,grid.width).map(x =>
        range(1,grid.height).map(y =>
          x%2==0 && y%2==0
          ? undefined
          : cachedVector(x, y))
        .filter(p => !!p)));

  for(let p of grid.points){
    grid.pointSet.add(p);
  }

  let allPoints = 
    concatAll(
      range(1,grid.width)
      .map(x =>
        range(1,grid.height)
        .map(y => cachedVector(x,y))
        .filter(p => grid.pointSet.has(p))));

  let pairs = 
    concatAll(
      allPoints.map(a =>
        [
          cachedVector(a.x-1, a.y+0),
          cachedVector(a.x+1, a.y+0),
          cachedVector(a.x+0, a.y-1),
          cachedVector(a.x+0, a.y+1)
        ].filter(b => grid.pointSet.has(b))
        .map(b => [a,b])
      ));
    grid.pairs = pairs;

  let nodeToNeighbors = new Map();
  pairs.forEach(([a,b]) => {
    if(!nodeToNeighbors.has(a)){
      nodeToNeighbors.set(a,[]);
    }
    let ns = nodeToNeighbors.get(a);
    ns.push(b);
  });

  grid.getNeighbors = n =>
    nodeToNeighbors.has(n)
    ? nodeToNeighbors.get(n)
    : [];

  return grid;
}