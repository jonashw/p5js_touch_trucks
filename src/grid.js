function Grid(data){
  this.points = data.points || [];
  this.height = data.h || 0;
  this.scale = data.scale || 10;
  this.points = data.points || [];
  this.pairs = data.pairs || [];
  this.pointSet = data.pointSet || new Set();

  this.findNearest = p => {
    //Each node has an axis-aligned bounding box.
    let s = this.scale/2;
    for(var i=0; i<data.points.length; i++){
      let n = data.points[i];
      if(n.x - s <= p.x && p.x <= n.x + s
      && n.y - s <= p.y && p.y <= n.y + s){
        console.log('nearest node: ', vectorToString(n));
        return n;
      }
    }
    console.log('no nearest node found');
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
      ellipse(p.x, p.y, 8);
    });
    data.pairs.forEach(([a,b]) => {
      stroke(255);
      strokeWeight(1);
      line(
        a.x,
        a.y,
        b.x,
        b.y);
    });
    pop();
  };
}