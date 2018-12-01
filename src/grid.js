function Grid(data){
  this.points = data.points || [];
  this.height = data.h || 0;
  this.scale = data.scale || 10;
  this.points = data.points || [];
  this.pairs = data.pairs || [];
  this.pointSet = data.pointSet || new Set();

  this.findNearest = p => {
    let projected = cachedVector(
      Math.min(Math.floor((p.x + data.scale/2) / data.scale), data.width),
      Math.min(Math.floor((p.y + data.scale/2) / data.scale), data.height));
    if(!data.pointSet.has(projected)){
      return undefined;
    }
    console.log('nearest node: ', vectorToString(projected));
    return projected;
  };

  let nodeToNeighbors = new Map();
  data.pairs.forEach(([a,b]) => {
    if(!nodeToNeighbors.has(a)){
      nodeToNeighbors.set(a,[]);
    }
    let ns = nodeToNeighbors.get(a);
    ns.push(b);
  });

  this.getNeighbors = n =>
    nodeToNeighbors.has(n)
    ? nodeToNeighbors.get(n)
    : [];

  this.draw = () => {
    push();
    noStroke();
    data.points.forEach(p => {
      fill(0,0,255);
      ellipse(p.x * data.scale, p.y * data.scale, 8);
    });
    data.pairs.forEach(([a,b]) => {
      stroke(255);
      strokeWeight(1);
      line(
        a.x * data.scale,
        a.y * data.scale,
        b.x * data.scale,
        b.y * data.scale);
    });
    pop();
  };
}