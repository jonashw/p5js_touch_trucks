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

function repeat(value,n){
  var xs = [];
  for(var i=0; i<n; i++){
    xs.push(value);
  }
  return xs;
}

function cycle(values,n){
  var xs = [];
  for(var i=0; i<n; i++){
    for(var j=0; j<values.length; j++){
      xs.push(values[j]);
    }
  }
  return xs;
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

function zigZagPattern(zero,n,directions){
    let points = [];
    var direction = new CircularArray(directions);
    let position = createVector(zero.x, zero.y);
    points.push(createVector(zero.x, zero.y));
    for(var i=0; i<n; i++){
        for(var j=0; j<direction.getCurrent().iterations; j++){
            direction.getCurrent().step(position);
            points.push(createVector(position.x,position.y));
        }
        direction.moveNext();
    }
    return points;
}

function Mesh(points,pairs){
    this.points = new Set(points);
    this.pairs = pairs;
    this.subtract = pointsToRemove => {
        let finalPoints = new Set(this.points);
        pointsToRemove.forEach(p => {
            finalPoints.delete(p);
        });
        let finalPairs = this.pairs.filter(([a,b]) => 
            !pointsToRemove.some(p => p == a || p == b));
        return new Mesh(finalPoints, finalPairs);
    };
}

function perfectGridMesh(w,h,scale){
    let points = concatAll(
      range(1,w).map(x => 
      range(1,h).map(y =>
        cachedVector(x*scale,y*scale))));
    return fullMesh(points, scale);
}

function fullMesh(points, neighborDistance){
    let pointSet = new Set(points);
    let pairs = concatAll(
      points.map(a =>
        [
          cachedVector(a.x - (1 * neighborDistance), a.y + (0 * neighborDistance)),
          cachedVector(a.x + (1 * neighborDistance), a.y + (0 * neighborDistance)),
          cachedVector(a.x + (0 * neighborDistance), a.y - (1 * neighborDistance)),
          cachedVector(a.x + (0 * neighborDistance), a.y + (1 * neighborDistance))
        ].filter(b => pointSet.has(b))
        .map(b => [a,b])
      ));
      return new Mesh(pointSet,pairs);
}

function sequence(startingPosition,steps){
    let position = createVector(startingPosition.x, startingPosition.y);
    let points = steps.map(step => {
        if(step.x){
            position.x += step.x;
        }
        if(step.y){
            position.y += step.y;
        }
        return cachedVector(position.x, position.y);
    });
    points.unshift(createVector(startingPosition.x, startingPosition.y));
    return {
        points,
        endingPosition: position
    };
}

function pairsOf(points){
    return pairwise(points).concat(pairwise(points.reverse()));
}