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
    let pairs = fullMeshPairs(points, scale);
    var obstaclePoints = 
        zigZagPattern(createVector(2,h-1), 2, 5, 9)
        .map(p => cachedVector(p.x * scale,p.y * scale));

    let mesh = new Mesh(pointSet, pairs);
    mesh.subtractPoints(obstaclePoints);

    return new Grid({
        width: w,
        height: h,
        points: mesh.points,
        pairs: mesh.pairs,
        scale: scale
    });
}