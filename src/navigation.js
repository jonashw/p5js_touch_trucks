function createNavigation(grid) {
	var _target = null;
	var _legs = [];
	return {
		popTarget: () => {
			_legs = [];
			let t = _target;
			_target = undefined;
			return t;
		},
		routeImproved: (a, b, heading) => {
			/*1. Mark all nodes unvisited. Create a set of all the unvisited nodes
				 called the unvisited set. */
			let unvisited = prioritizedMap();
			//console.log(unvisited);
			/*2. Assign to every node a tentative distance value: set it to zero for
				 our initial node and to infinity for all other nodes. Set the 
				 initial node as current. */
			b = grid.findNearest(b);
			if(!b){
				console.log('no nearest node found');
				return;
			}
			a = cachedVector(a.x, a.y);
			b = cachedVector(b.x, b.y);
			_target = b;
			grid.points.forEach(p => 
			{
				unvisited.set(p, p == a ? 0 : Infinity);
			});
			unvisited.delete(a);
			/*3. For the current node, consider all of its unvisited neighbors and
				 calculate their tentative distances through the current node. Compare
				 the newly calculated tentative distance to the current assigned value
				 and assign the smaller one. For example, if the current node A is 
				 marked with a distance of 6, and the edge connecting it with a 
				 neighbor B has length 2, then the distance to B through A will be 
				 6 + 2 = 8. If B was previously marked with a distance greater than 
				 8 then change it to 8. Otherwise, keep the current value. */
			let current = {key:a, priority:0};
			//console.log('starting at ', a);
			//console.log('seeking ', b);
			while(!!current){
				grid.getNeighbors(current.key).filter(unvisited.has).forEach(n =>
				{
					n.via = current.key;
					let nPriority = unvisited.get(n);
					let nPriorityTentative = n.dist(current.key) + current.priority;
					//console.log(nPriority, nPriorityTentative);
					if(nPriority > nPriorityTentative){
						//console.log('better');
						unvisited.set(n, nPriorityTentative);
					}
				});

				/*4. When we are done considering all of the unvisited neighbors of the
					current node, mark the current node as visited and remove it from
					the unvisited set. A visited node will never be checked again. */
				unvisited.delete(current.key);
				/*5. If the destination node has been marked visited (when planning
					a route between two specific nodes) or if the smallest tentative
					distance among the nodes in the unvisited set is infinity (when 
					planning a complete traversal; occurs when there is no
					connection between the initial node and remaining unvisited nodes),
					then stop. The algorithm has finished. */
				if(current.key === b){
					current = null;
					//console.log('finished!');
				} else {
					current = unvisited.popTop();
					//console.log('next current:', current.key);
				}
				/*6. Otherwise, select the unvisited node that is marked with the smallest
					tentative distance, set it as the new "current node",
					and go back to step 3. */
			}
			let n = b;
			let ns = [b];
			while(n !== a && !!n && !!n.via){
				ns.unshift(n.via);
				n = n.via;
			}
			//console.log(a,b);
			//console.log(ns);
			_legs = 
				pairwise(ns).map(([a,b]) => ({
					type: 'straight',
					a: a,
					b: b
				}));

			console.log(`routeImproved: ${vectorToString(a)} -> ${vectorToString(b)}`,_legs);
		},
		route: (a, b, heading) => {
			var b = grid.findNearest(b);
			if (!b) {
				return;
			}
			console.log('target:', b);
			_target = b;
			_legs.splice(0);
			let w = Math.abs(a.x - b.x);
			let h = Math.abs(a.y - b.y);
			var state = [
				{ direction: 'x', value: b.x, magnitude: w, heading: createVector(1, 0) },
				{ direction: 'y', value: b.y, magnitude: h, heading: createVector(0, 1) },
			]
				.filter(delta => delta.magnitude > 0)
				.sort((a, b) =>
					a.heading.equals(heading)
						? -1
						: b.heading.equals(heading)
							? 1
							: 0)
				.reduce((acc, delta) => {
					let nextPosition = createVector(acc.currentPosition.x, acc.currentPosition.y);
					nextPosition[delta.direction] = delta.value;
					let nextLegs = delta.heading.equals(acc.currentHeading)
						? []
						: [{ type: 'turn', a: acc.currentHeading, b: delta.heading, position: acc.currentPosition }];
					nextLegs.push({ type: 'straight', a: acc.currentPosition, b: nextPosition });
					return {
						legs: acc.legs.concat(nextLegs),
						currentHeading: delta.heading,
						currentPosition: nextPosition
					};
				}, { legs: [], currentHeading: heading, currentPosition: a });

			_legs = state.legs;
			console.log('state:', state);
		},
		draw: () => {
			if (!_target) {
				return;
			}
			push();
			for (var i = 0; i < _legs.length; i++) {
				let leg = _legs[i];
				switch (leg.type) {
					case 'turn':
						//noFill();
						fill(0);
						stroke(50, 200, 150);
						strokeWeight(3)
						ellipse(leg.position.x, leg.position.y, 40, 40);
						break;
					case 'straight':
						stroke(50, 200, 150);
						strokeWeight(10);
						line(
							leg.a.x,
							leg.a.y,
							leg.b.x,
							leg.b.y);
						break;
				}
			}
			pop();
			push();
			noStroke();
			fill(50, 200, 150);
			ellipse(_target.x, _target.y, 30, 30);
			pop();
		}
	};
}