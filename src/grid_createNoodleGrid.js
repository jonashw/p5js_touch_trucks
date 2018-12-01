function Mesh(points, pairs){
    this.points = points;
    this.pairs = pairs;
    this.subtractPoints = ps => {
        ps.forEach(p => {
            this.points.delete(p);
        });
        this.pairs = pairs.filter(([a,b]) => 
            !ps.some(p => p == a || p == b));
    };
}

function createNoodleGrid(w,h,scale){
   var points = 
        concatAll(
            range(1,w).map(x => 
            range(1,h).map(y =>
                cachedVector(x*scale,y*scale))));

    var pointSet = new Set(points);

    let pairs = concatAll(
      points.map(a =>
        [
          cachedVector(a.x - (1 * scale), a.y + (0 * scale)),
          cachedVector(a.x + (1 * scale), a.y + (0 * scale)),
          cachedVector(a.x + (0 * scale), a.y - (1 * scale)),
          cachedVector(a.x + (0 * scale), a.y + (1 * scale))
        ].filter(b => pointSet.has(b))
        .map(b => [a,b])
      ));

    var obstaclePoints = 
        zigZagPattern(createVector(2,h-1), 2, 5, 9)
        .map(p => cachedVector(p.x * scale,p.y * scale));

    let mesh = new Mesh(new Set(points), pairs);
    mesh.subtractPoints(obstaclePoints);

    return new Grid({
        width: w,
        height: h,
        points: mesh.points,
        pairs: mesh.pairs,
        scale: scale
    });
}

function zigZagPattern(zero,dx,dy,n){
    let x = zero.x;
    let y = zero.y;
    let points = [];
    var direction = new CircularArray([
        {iterations: dy, step: () => y--},
        {iterations: dx, step: () => x++},
        {iterations: dy, step: () => y++},
        {iterations: dx, step: () => x++}
    ]);
    points.push(zero);
    for(var i=0; i<n; i++){
        for(var j=0; j<direction.getCurrent().iterations; j++){
            direction.getCurrent().step();
            points.push(createVector(x,y));
        }
        direction.moveNext();
    }
    return points;
}