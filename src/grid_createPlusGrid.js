function createPlusGrid(w,h,scale){
    var obstaclePoints = 
        range(2,w-1).map(x => cachedVector(x*scale,scale*Math.ceil(h/2)))
        .concat(
            range(2,h-1).map(y => cachedVector(scale*Math.ceil(w/2), scale*y)));

   var drivablePoints = Array.from(perfectGridMesh(w,h,scale).points);

    let mesh = fullMesh(drivablePoints,scale).subtract(obstaclePoints);

    return new Grid({
        width: w,
        height: h,
        points: mesh.points,
        pairs: mesh.pairs,
        scale: scale
    });
}

function createVerticalStripesGrid(w,h,scale){
    let obstaclePoints = [];
    for(var x=2; x<w; x+=2){
        for(var y=2; y<h; y++){
            obstaclePoints.push(cachedVector(x*scale, y*scale));
        }
    }

    let mesh = perfectGridMesh(w,h,scale).subtract(obstaclePoints);

    return new Grid({
        width: w,
        height: h,
        points: mesh.points,
        pairs: mesh.pairs,
        scale: scale
    });
}

function createZigZagGrid(w,h,scale){
    var points = 
        zigZagPattern(
            createVector(1,1),
            7,
            [
                {iterations: 3, step: p => { p.x++; }},
                {iterations: 3, step: p => { p.x--; p.y++; }},
                {iterations: 2, step: p => { p.x++; }},
                {iterations: 3, step: p => { p.x++; p.y--; }},
                {iterations: 2, step: p => { p.x++; }},
                {iterations: 3, step: p => { p.x--; p.y++; }},
                {iterations: 3, step: p => { p.x++; }}
            ])
        .map(p => cachedVector(p.x * scale, p.y * scale));

    return new Grid({
        width: w,
        height: h,
        points: new Set(points),
        pairs: pairsOf(points),
        scale: scale
    });
}