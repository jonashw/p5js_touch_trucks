function createAlphaGrid(letter){
    let scale = Math.min(windowHeight / (5 + 1), windowWidth / 5);
    let w = 10;
    let h = 6;
    var points=[],pairs=[];
    switch(letter.toUpperCase()){
        case 'S': 
            points = 
                sequence(
                    {x:4, y:1},
                    [
                        {x:-3},
                        {x:+0, y:+2},
                        {x:+3},
                        {x:+0, y:+2},
                        {x:-3}
                    ]).points
                .map(p => cachedVector(p.x * scale, p.y * scale));
            pairs = pairsOf(points);
            break;
        case 'A': 
            scale = Math.min(windowWidth / (5+1), windowHeight / (6+1));
            points = [
                cachedVector(scale*1,scale*6.0),
                cachedVector(scale*2,scale*3.5),
                cachedVector(scale*3,scale*1.0),
                cachedVector(scale*4,scale*3.5),
                cachedVector(scale*5,scale*6.0),
            ];
            function bidirectionalPairs(pairs){
                let backPairs = pairs.map(p => p.slice(0).reverse());
                return pairs.concat(backPairs);
            }
            pairs = bidirectionalPairs([
                [points[0],points[1]],
                [points[1],points[2]],
                [points[2],points[3]],
                [points[3],points[4]],
                [points[1],points[3]]
            ]);
            break;
        case 'W':
            scale = Math.min(windowWidth / (5+1), windowHeight / (6+1));
            points = 
                sequence(
                    {x:1, y:1},
                    [
                        {x:+1,y:+5},
                        {x:+1,y:-2.5},
                        {x:+1,y:+2.5},
                        {x:+1,y:-5}
                    ]).points
                .map(p => cachedVector(p.x * scale, p.y * scale));
            pairs = pairsOf(points);
            break;
        case 'Y':
            scale = Math.min(windowWidth / (5+1), windowHeight / (6+1));
            points = [
                cachedVector(scale*1,scale*1),
                cachedVector(scale*3,scale*3),
                cachedVector(scale*5,scale*1),
                cachedVector(scale*3,scale*6)
            ];
            pairs = [
                [points[0], points[1]], [points[1], points[0]],
                [points[1], points[2]], [points[2], points[1]],
                [points[1], points[3]], [points[3], points[1]]
            ];
            break;
        case 'E':
            points = [
                cachedVector(scale*1,scale*1),
                cachedVector(scale*4,scale*1),
                cachedVector(scale*1,scale*3),
                cachedVector(scale*4,scale*3),
                cachedVector(scale*1,scale*5),
                cachedVector(scale*4,scale*5)
            ];
            pairs = [
                [points[0], points[1]], [points[1], points[0]],
                [points[0], points[2]], [points[2], points[0]],
                [points[2], points[3]], [points[3], points[2]],
                [points[2], points[4]], [points[4], points[2]],
                [points[4], points[5]], [points[5], points[4]]
            ];
            break;
        case 'R':
            scale = Math.min(windowHeight / (5 + 1), windowWidth / 5);
            points = [
                cachedVector(scale*1,scale*1),
                cachedVector(scale*4,scale*1),
                cachedVector(scale*1,scale*3),
                cachedVector(scale*4,scale*3),
                cachedVector(scale*1,scale*5),
                cachedVector(scale*4,scale*5)
            ];
            pairs = [
                [points[0], points[1]], [points[1], points[0]],
                [points[1], points[3]], [points[3], points[1]],
                [points[0], points[2]], [points[2], points[0]],
                [points[2], points[3]], [points[3], points[2]],
                [points[2], points[4]], [points[4], points[2]],
                [points[2], points[5]], [points[5], points[2]]
            ];
            break;
        default:
            let mesh = perfectGridMesh(w,h,scale);
            points = mesh.points;
            pairs = mesh.pairs;
    }
    
    return new Grid({
        width: 10,
        height: 7,
        points: new Set(points),
        pairs: pairs,
        scale: scale
    });
}