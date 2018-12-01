function createCheckerGrid(w,h,scale){
  var points = 
    concatAll(
      range(1,w).map(x =>
        range(1,h).map(y =>
          x%2==0 && y%2==0
          ? undefined
          : cachedVector(x, y))
        .filter(p => !!p)));

  var pointSet = new Set(points);

  let allPoints = 
    concatAll(
      range(1,w)
      .map(x =>
        range(1,h)
        .map(y => cachedVector(x,y))
        .filter(p => pointSet.has(p))));

  let pairs = 
    concatAll(
      allPoints.map(a =>
        [
          cachedVector((a.x - 1), (a.y + 0)),
          cachedVector((a.x + 1), (a.y + 0)),
          cachedVector((a.x + 0), (a.y - 1)),
          cachedVector((a.x + 0), (a.y + 1))
        ].filter(b => pointSet.has(b))
        .map(b => [a,b])
      ));

  return new Grid({
    width: w,
    height: h,
    scale: scale,
    points: points,
    pointSet: pointSet,
    pairs: pairs,
  });
}