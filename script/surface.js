define('surface', ['physics'], function(physics) {
	function Surface(scale, resolution, pointMass) {
		var zAxis = new THREE.Vector3(0, 0, 1);
		var axis1 = new THREE.Vector3(1, 0, 0).applyAxisAngle(zAxis, Math.PI / 3);
		var axis2 = new THREE.Vector3(1, 0, 0).applyAxisAngle(zAxis, 2 * Math.PI / 3);
		
		this.scale = scale;
		this.resolution = resolution;
		this.pointMass = pointMass || 1.0;
		this.tension = 10.0;
		this.friction = 5.0;
		
		this.points = [];
		this.pointsMap = {};

		for (var i = -this.resolution; i <= this.resolution; i++) {
			this.pointsMap[i] = {};
			
			for (var j = -this.resolution; j <= this.resolution; j++) {
				if (Math.abs(i + j) > this.resolution)
					continue;
					
				var v = new THREE.Vector3().addVectors(
					axis1.clone().multiplyScalar(i),
					axis2.clone().multiplyScalar(j)
				).multiplyScalar(this.scale * 1.0 / this.resolution);
				
				var p = new physics.PhysicalObject(v);
				p.mass = this.pointMass;
				p.coords = [i, j]
				p.isEdge = (
					Math.abs(i) == this.resolution || 
					Math.abs(j) == this.resolution || 
					Math.abs(i + j) == this.resolution);
				
				this.points.push(p);
				this.pointsMap[i][j] = p;
			}
		}
		
		physics.World.onUpdate(function(e) { this.update(); }.bind(this));
	}
	
	Surface.prototype = {
		findPoint: function(coords) {
			if (this.pointsMap[coords[0]] && this.pointsMap[coords[0]][coords[1]])
				return this.pointsMap[coords[0]][coords[1]];
				
			return null;
		},
		
		findNeighbour: function(p, offset) {
			if (!p || !p.coords) 
				return null;
			
			return this.findPoint([p.coords[0] + offset[0], p.coords[1] + offset[1]]);
		},
		
		update: function() {
			var self = this;
			self.points.forEach(function(p) {
				if (p.isEdge)
					return;
					
				var neighbours = [
					[1, 0],
					[-1, 0],
					[0, 1],
					[0, -1],
					[-1, 1],
					[1, -1]
				]
				.map(function(offset) { return self.findNeighbour(p, offset); })
				.filter(function(p) { return p != null; });

				var zForce = 0;
				neighbours.forEach(function(n) {
					zForce += n.position.z - p.position.z;
				});
				
				zForce *= self.tension;
	 			zForce -= p.velocity.z * self.friction;
				
				p.applyForce(new THREE.Vector3(0, 0, zForce));
				
				if (Math.random() < 0.0001)
					p.velocity.z -= 10;
			});
		}
	};
	
	return Surface;
});