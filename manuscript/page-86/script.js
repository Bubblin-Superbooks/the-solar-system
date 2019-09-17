$(document).ready(function() {
    (function() {
        var webglEl = document.getElementById('webgl');
        if (!Detector.webgl) { Detector.addGetWebGLMessage(webglEl);
            return; }
        THREE.ImageUtils.crossOrigin = '';
        var width = window.innerWidth,
            height = window.innerHeight;
        var radius = 0.45,
            segments = 32,
            rotation = 5;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
        camera.position.z = 1;
        camera.position.y = -3;
        camera.position.x = 1;
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        scene.add(new THREE.AmbientLight(0x333320));
        var light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(1, -3, 1);
        scene.add(light);
        var sphere = createSphere(radius, segments);
        sphere.rotation.y = rotation;
        scene.add(sphere);
        var rings = createRings(radius, segments);
        rings.rotation.y = rotation;
        scene.add(rings);
        var stars = createStars(90, 64);
        scene.add(stars);
        var controls = new THREE.TrackballControls(camera);
        webglEl.appendChild(renderer.domElement);
        render();

        function render() { controls.update();
            sphere.rotation.y += 0.05;
            rings.rotation.y += 0.02;
            requestAnimationFrame(render);
            renderer.render(scene, camera); }

        function createSphere(radius, segments) {
            return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/page-65/uranus.jpg'), bumpScale: 0.05, specular: new THREE.Color('#010501') })); }

        function createRings(radius, segments) {
            return new THREE.Mesh(new THREE.XRingGeometry(1.2 * radius, 1.8 * radius, 2 * segments, 5, 0, Math.PI * 2), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/page-65/uranusRings.png'), side: THREE.DoubleSide, transparent: true, opacity: 0.2 })); }

        function createStars(radius, segments) {
            return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/shared/galaxy_starfield.jpg'), side: THREE.BackSide })); } }()); });
