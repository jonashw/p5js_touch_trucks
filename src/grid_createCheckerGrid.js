function createCheckerGrid(w,h,scale){
  var points = 
    concatAll(
      range(1,w).map(x =>
        range(1,h).map(y =>
          x%2==0 && y%2==0
          ? undefined
          : cachedVector(x * scale, y * scale))
        .filter(p => !!p)));

  var pointSet = new Set(points);

  let pairs = 
    concatAll(
      points.map(a =>
        [
          cachedVector(a.x - (1 * scale), a.y + (0 * scale)),
          cachedVector(a.x + (1 * scale), a.y + (0 * scale)),
          cachedVector(a.x + (0 * scale), a.y - (1 * scale)),
          cachedVector(a.x + (0 * scale), a.y + (1 * scale))
        ].filter(b => pointSet.has(b))
        .map(b => [a,b])
      ));

  return new Grid({
    width: w,
    height: h,
    points: points,
    pointSet: pointSet,
    pairs: pairs,
    scale: scale
  });
}