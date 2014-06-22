define(['physics', 'surface'], function(physics, Surface) {

	var scene, camera, renderer; 

	init();
	animate();

	function init() {
		scene = new THREE.Scene();
		initScene(scene);
		
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 100;
		
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
	}
	
	function render() {
		renderer.render(scene, camera);
	}
	
	function animate() {
		requestAnimationFrame(animate);
		render();
		physics.World.update();
	}

	function initScene(scene) {
		var surface = new Surface(50, 25, 5.0);
		
		var geometry = createGeometry(surface);
		var mesh = createMesh(geometry); 
		mesh.rotation.x = -Math.PI / 4;
		
		scene.add(mesh);
	}
	
	function createGeometry(surface) {
		var g = new THREE.Geometry();
		
		surface.points.forEach(function(p) { g.vertices.push(p.position); });
		physics.World.onUpdate(function(e) { g.verticesNeedUpdate = true; })
		
		return g;
	}
	
	function createMesh(geometry) {
			var ps = new THREE.ParticleSystem(
				geometry, 
				new THREE.ParticleSystemMaterial({ size: 1.0, sizeAttenuation: false }));
				
		return ps;
	}
});
