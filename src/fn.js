function vectorToString(v){
  return "(" + v.x + "," + v.y + ")";
}

var cachedVector = (() => {
  var map = new Map();
  return (x,y) => {
    let key = `${x}:${y}`;
    if(map.has(key)){
      return map.get(key);
    }
    let v = createVector(x,y);
    map.set(key, v);
    return v;
  };
})();

function range(from,to){
  return from < to
    ? _range(from,to)
    : _range(to,from).reverse();
  function _range(from,to){
    var numbers = [];
    for(var n=from; n<=to; n++){
      numbers.push(n);
    }
    return numbers;
  }
}

function pairwise(array){
  if(!array || !array.length || array.length < 2){
    return [];
  }
  let pairs = [];
  let prev = array[0];
  for(var i=1; i<array.length; i++){
    let next = array[i];
    pairs.push([prev, next]);
    prev = next;
  }
  return pairs;
}

function zip(array1, array2){
  var pairs = [];
  for(var i=0; i<array1.length && i<array2.length; i++){
    pairs.push([array1[i], array2[i]])
  }
  return pairs;
}

function zipWith(array1, array2, fn){
  var pairs = [];
  for(var i=0; i<array1.length && i<array2.length; i++){
    pairs.push(fn(array1[i], array2[i]));
  }
  return pairs;
}

function prioritizedMap(){
  let _items = [];
  let _keyToItem = new Map();
  return {
    popTop: () => {
      let item = _items.shift();
      if(!!item){
        _keyToItem.delete(item.key);
      }
      return item;
    },
    has: key => _keyToItem.has(key),
    get: key => {
      if(!_keyToItem.has(key)){
        throw key.toString();
      }
      return _keyToItem.get(key).priority;
    },
    delete: key => {
      let item = _keyToItem.get(key);
      if(!item){
        return;
      }
      let index = _items.indexOf(item);
      if(index > -1){
        _items.splice(index,1);
      }
    },
    set: (key,priority) => {
      let item = _keyToItem.has(key) ? _keyToItem.get(key) : {key};
      item.priority = priority;
      let index = _items.indexOf(item);
      if(index > -1){
        _items.splice(index,1);
      }
      _keyToItem.set(key,item);
      _items.push(item);
      _items.sort((a,b) => a.priority - b.priority);
    }
  };
}

function concatAll(arrays){
  return Array.prototype.concat.apply([], arrays);
}

function fullMeshPairs(points, neighborDistance, pointSet /* optional */){
    pointSet = pointSet || new Set(points);
    return concatAll(
      points.map(a =>
        [
          cachedVector(a.x - (1 * neighborDistance), a.y + (0 * neighborDistance)),
          cachedVector(a.x + (1 * neighborDistance), a.y + (0 * neighborDistance)),
          cachedVector(a.x + (0 * neighborDistance), a.y - (1 * neighborDistance)),
          cachedVector(a.x + (0 * neighborDistance), a.y + (1 * neighborDistance))
        ].filter(b => pointSet.has(b))
        .map(b => [a,b])
      ));
}

function zigZagPattern(zero,dx,dy,n){
    let x = zero.x;
    let y = zero.y;
    let points = [];
    var direction = new CircularArray([
        {iterations: dy, step: () => y--},
        {iterations: dx, step: () => x++},
        {iterations: dy, step: () => y++},
        {iterations: dx, step: () => x++}
    ]);
    points.push(zero);
    for(var i=0; i<n; i++){
        for(var j=0; j<direction.getCurrent().iterations; j++){
            direction.getCurrent().step();
            points.push(createVector(x,y));
        }
        direction.moveNext();
    }
    return points;
}