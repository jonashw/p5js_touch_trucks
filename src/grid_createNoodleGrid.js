function createNoodleGrid(w,h,scale){
    var points = 
        zigZagPattern(createVector(1,h), 1, 6, 13)
        .map(p => cachedVector(p.x * scale,p.y * scale));

    var pairs = pairwise(points);

    console.log('points',points);

    var pointSet = new Set(points);

    return new Grid({
        width: w,
        height: h,
        points: points,
        pointSet: pointSet,
        pairs: pairs,
        scale: scale
    });
}

function zigZagPattern(zero,dx,dy,n){
    let x = zero.x;
    let y = zero.y;
    let points = [];
    var takeStep = new CircularArray([
        () => y -= dy,
        () => x += dx,
        () => y += dy,
        () => x += dx
    ]);
    points.push(zero);
    for(var i=0; i<n; i++){
        takeStep.getCurrent()();
        points.push(createVector(x,y));
        takeStep.moveNext();
    }
    return points;
}