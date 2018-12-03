function createNoodleGrid(w,h){
    let scale = Math.min(windowWidth/(w+1), windowHeight/(h+1));
    var obstaclePoints = 
        zigZagPattern(
            createVector(2,h-1),
            11,
            [
                {iterations: h-3, step: position => position.y--},
                {iterations: 2,   step: position => position.x++},
                {iterations: h-3, step: position => position.y++},
                {iterations: 2,   step: position => position.x++}
            ])
        .map(p => cachedVector(p.x * scale,p.y * scale));

    let mesh = perfectGridMesh(w,h,scale).subtract(obstaclePoints);

    return new Grid({
        width: w,
        height: h,
        points: mesh.points,
        pairs: mesh.pairs,
        scale: scale
    });
}