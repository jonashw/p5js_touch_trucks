function createNoodleGrid(w,h,scale){
    var obstaclePoints = 
        zigZagPattern(
            createVector(2,h-1),
            9,
            [
                {iterations: 5, step: position => position.y--},
                {iterations: 2, step: position => position.x++},
                {iterations: 5, step: position => position.y++},
                {iterations: 2, step: position => position.x++}
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