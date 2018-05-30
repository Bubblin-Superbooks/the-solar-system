(function galaxy() {
				setTimeout(function() {
					if (!webglAvailable()) return

									var renderer
									var scene
									var camera
									var controls
									var galaxy

									setScene()

									var w = window,
													d = document,
													e = d.documentElement,
													g = d.getElementsByTagName('body')[0];

									w.innerWidth = w.innerWidth || e.clientWidth || g.clientWidth
									w.innerHeight = w.innerHeight || e.clientHeight || g.clientHeight


									function setScene() {
													scene = new THREE.Scene()
													camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, .5, 1500);
													camera.position.set(innerWidth/10, -(innerWidth/5), innerWidth/3);
													camera.lookAt(scene.position);
													renderTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight);
													renderer = new THREE.WebGLRenderer();
													renderer.setSize(innerWidth, innerHeight);
													renderer.setClearColor(0x000000);
													document.body.appendChild(renderer.domElement);
													setGalaxy();
													window.addEventListener('resize', function() {
																	w.innerWidth = w.innerWidth || e.clientWidth || g.clientWidth
																	w.innerHeight = w.innerHeight || e.clientHeight || g.clientHeight

																	camera.aspect = innerWidth / innerHeight
																	renderer.setSize(innerWidth, innerHeight)
																	camera.updateProjectionMatrix()
																	renderer.render(scene, camera)
																	changeGalaxy()
													}, false)
													animate()
									}

									function webglAvailable() {
													var canvas = document.createElement("canvas")
													return !!window.WebGLRenderingContext &&
																	(canvas.getContext("webgl") ||
																					canvas.getContext("experimental-webgl"))
									}

									function setGalaxy() {
													galaxyMaterial = new THREE.ShaderMaterial({
																	vertexShader: document.getElementById('vShader').textContent,
																	fragmentShader: document.getElementById('fShader').textContent,
																	uniforms: {
																					size: { type: 'f', value: 3.3 },
																					pixelRatio: { type: "f", value: innerHeight }
																	},
																	transparent: true,
																	depthTest: false,
																	blending: THREE.AdditiveBlending
													})
													var stars1 = new THREE.Geometry()
													stars1.vertices = newGalaxy()
													galaxy = new THREE.Points(stars1, galaxyMaterial)
													scene.add(galaxy)
									}

									function animate() {
													requestAnimationFrame(animate);
													renderer.render(scene, camera);
													scene.rotation.z += .001;
									}

									function changeGalaxy() {
													var stars2 = newGalaxy();
													for (var i = 0; i < galaxy.geometry.vertices.length; i++) {
																	TweenLite.to(galaxy.geometry.vertices[i], 5, {
																					x: stars2[i].x,
																					y: stars2[i].y,
																					z: stars2[i].z,
																					onUpdate: function() { galaxy.geometry.verticesNeedUpdate = true },
																					ease: Quart.easeInOut
																	})
													}
									}

									function newGalaxy(_n, _axis1, _axis2, _armsAngle, _bulbSize, _ellipticity) {
													var n = (typeof _n === 'undefined') ? 10000 : _n;
													var axis1 = (typeof _axis1 === 'undefined') ? (60 + Math.random() * 20) : _axis1;
													var axis2 = (typeof _axis2 === 'undefined') ? (axis1 + 20 + Math.random() * 40) : _axis2;
													var maja, mina;
													axis1 > axis2 ? (maja = axis1, mina = axis2) :
																	axis1 == axis2 ? (maja = axis1 + 1, mina = axis2) : (maja = axis2, mina = axis1);
													var armsAngle = (typeof _armsAngle === 'undefined') ? ((Math.random() * 2 - 1) > 0 ? 1 : -1) * 12 + 3 : _armsAngle;
													var bulbSize = (typeof _bulbSize === 'undefined') ? Math.random() * .6 : _bulbSize > 1 ? 1 : _bulbSize < 0 ? 0 : _bulbSize;
													var ellipticity = (typeof _ellipticity === 'undefined') ? .2 + Math.random() * .2 : _ellipticity > 1 ? 1 : _ellipticity < 0 ? 0 : _ellipticity;
													var stars = [];
													for (var i = 0; i < n; i++) {
																	var dist = Math.random();
																	var angle = (dist - bulbSize) * armsAngle;
																	var a = maja * dist
																	var b = mina * dist
																	var e = Math.sqrt(a * a - b * b) / a
																	var phi = ellipticity * Math.PI / 2 * (1 - dist) * (Math.random() * 2 - 1)
																	var theta = Math.random() * Math.PI * 2
																	var radius = Math.sqrt(b * b / (1 - e * e * Math.pow(Math.cos(theta), 2))) * (1 + Math.random() * 0.1)
																	if (dist > bulbSize) theta += angle
																	stars.push({
																					x: Math.cos(phi) * Math.cos(theta) * radius,
																					y: Math.cos(phi) * Math.sin(theta) * radius,
																					z: Math.sin(phi) * radius
																	})
													}
													return stars
									}


					}, 400);

})()
