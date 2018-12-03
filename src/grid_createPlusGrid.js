function createPlusGrid(w,h){
    let scale = Math.min(windowWidth/(w+1), windowHeight/(h+1));
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