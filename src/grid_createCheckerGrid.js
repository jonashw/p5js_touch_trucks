function createCheckerGrid(w,h,scale){
  var points = 
    concatAll(
      range(1,w).map(x =>
        range(1,h).map(y =>
          x%2==0 && y%2==0
          ? undefined
          : cachedVector(x * scale, y * scale))
        .filter(p => !!p)));

  let mesh = fullMesh(points, scale);

  return new Grid({
    width: w,
    height: h,
    points: mesh.points,
    pairs: mesh.pairs,
    scale: scale
  });
}