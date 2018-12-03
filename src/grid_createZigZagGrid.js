function createZigZagGrid(){
    let w = 8;
    let h = 4;
    var scale = Math.min(windowWidth/(w+1), windowHeight/(h+1));
    var points = 
        zigZagPattern(
            createVector(1,1),
            7,
            [
                {iterations: 3, step: p => { p.x++; }},
                {iterations: 3, step: p => { p.x--; p.y++; }},
                {iterations: 2, step: p => { p.x++; }},
                {iterations: 3, step: p => { p.x++; p.y--; }},
                {iterations: 2, step: p => { p.x++; }},
                {iterations: 3, step: p => { p.x--; p.y++; }},
                {iterations: 3, step: p => { p.x++; }}
            ])
        .map(p => cachedVector(p.x * scale, p.y * scale));

    return new Grid({
        width: w,
        height: h,
        points: new Set(points),
        pairs: pairsOf(points),
        scale: scale
    });
}