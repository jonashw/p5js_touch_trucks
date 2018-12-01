function Grid(data){
  this.points = data.points || new Set();
  this.height = data.h || 0;
  this.scale = data.scale || 10;
  this.pairs = data.pairs || [];

  this.findNearest = p => {
    //This search algorithm is rather aggresive.  It will widen its search area as it goes on.
    let sMax = this.scale*8;
    let sDelta = this.scale/8;
    let s = this.scale/2;
    while(s<sMax){
      for(let n of data.points){
        //Each node has an axis-aligned bounding box.
        if(n.x - s <= p.x && p.x <= n.x + s
        && n.y - s <= p.y && p.y <= n.y + s){
          console.log('nearest node: ', vectorToString(n));
          return n;
        }
      }
      s += sDelta;
    }

    console.log('no nearest node found');
  };

  let nodeToNeighbors = new Map();
  for(let [a,b] of data.pairs){
    if(!nodeToNeighbors.has(a)){
      nodeToNeighbors.set(a,[]);
    }
    let ns = nodeToNeighbors.get(a);
    ns.push(b);
  }

  this.getNeighbors = n =>
    nodeToNeighbors.has(n)
    ? nodeToNeighbors.get(n)
    : [];

  this.draw = () => {
    push();
    noStroke();
    for(let p of data.points){
      fill(0,0,255);
      ellipse(p.x, p.y, 8);
    }
    for(let [a,b] of data.pairs){
      stroke(255);
      strokeWeight(1);
      line(
        a.x,
        a.y,
        b.x,
        b.y);
    }
    pop();
  };
}