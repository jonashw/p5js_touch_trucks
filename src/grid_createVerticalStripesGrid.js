function createVerticalStripesGrid(w,h){
    let scale = Math.min(windowWidth/(w+1), windowHeight/(h+1));
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