define('physics', [], function() {
	var World = (function() {
		var clock = new THREE.Clock(true);
		var eventDispatcher = new THREE.EventDispatcher();
		
		return {
			start: function() { 
				clock.start(); 
				eventDispatcher.dispatchEvent({ type: 'start' }); 
			},
			
			stop: function() { 
				clock.stop(); 
				eventDispatcher.dispatchEvent({type: 'stop'});
			},
			
			onUpdate: function(listener) {
				eventDispatcher.addEventListener('update', listener);
			},
			
			update: function() {
				var dt = clock.getDelta();
				if (dt > 1) dt = 1.0; // don't lose your shit if we've been tabbed out for a while
				eventDispatcher.dispatchEvent({ type: 'update', dt: dt });
			}
		};
	})();
	
	function PhysicalObject(position, velocity, acceleration, mass) {
		this.position = position || new THREE.Vector3();
		this.velocity = velocity || new THREE.Vector3();
		this.acceleration = acceleration || new THREE.Vector3();
		this.mass = mass || 1.0;
		this.force = new THREE.Vector3();
		
		World.onUpdate(function(e) { this.update(e.dt); }.bind(this));
	}
	
	PhysicalObject.prototype = {
		update: function(dt) {
			this.position.add(this.velocity.clone().multiplyScalar(dt));
			this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
			this.acceleration = this.force.clone().multiplyScalar(1.0 / this.mass);
			this.force.set(0, 0, 0);
		},
		
		applyForce: function(force) {
			this.force.add(force); 
		}
	};
	
	return {
		PhysicalObject: PhysicalObject,
		World: World
	}
});