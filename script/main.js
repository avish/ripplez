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
		var surface = new Surface(50, 15);
		
		var geometry = createGeometry(surface);
		var mesh = createMesh(geometry); 
		mesh.rotation.x = -Math.PI / 4;
		
		scene.add(mesh);
	}
	
	function createGeometry(surface) {
		var g = new THREE.Geometry();
		
		surface.points.forEach(function(p) { g.vertices.push(p.position); });
		
		var findVertexIndex = function(p) {
			return g.vertices.indexOf(p.position);
		};
		
		var addFace = function(point, offset1, offset2) {
			var neighbour1 = surface.findNeighbour(point, offset1);
			var neighbour2 = surface.findNeighbour(point, offset2);
			if (neighbour1 && neighbour2)
				g.faces.push(new THREE.Face3(findVertexIndex(point), findVertexIndex(neighbour1), findVertexIndex(neighbour2)));
		};
		
		surface.points.forEach(function(point) {
			addFace(point, [1, 0], [0, 1]);
			addFace(point, [-1, 0], [0, -1]);
		});
		
		physics.World.onUpdate(function(e) { g.verticesNeedUpdate = true; g.elementsNeedUpdate = true; })
		
		return g;
	}
	
	function createMesh(geometry) {
		var ps = new THREE.Mesh(
			geometry, 
			new THREE.MeshBasicMaterial({ wireframe: true }));
				
		return ps;
	}
});
