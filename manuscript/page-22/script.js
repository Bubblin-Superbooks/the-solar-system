$(document).ready(function() {
    (function() {
        var webglEl = document.getElementById('webgl');
        if (!Detector.webgl) { Detector.addGetWebGLMessage(webglEl);
            return; }
        THREE.ImageUtils.crossOrigin = '';
        var width = webglEl.clientWidth;
        var height = webglEl.clientHeight;
        webglEl.width = width;
        webglEl.height = height;
        var radius = 0.5,
            segments = 32,
            rotation = 5;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
        camera.position.z = 3;
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        scene.add(new THREE.AmbientLight(0x333333));
        var light = new THREE.DirectionalLight(0xffffff, .5);
        light.position.set(5, 3, 5);
        scene.add(light);
        var sphere = createSphere(radius, segments);
        sphere.rotation.y = rotation;
        scene.add(sphere);
        var clouds = createClouds(radius, segments);
        clouds.rotation.y = rotation;
        scene.add(clouds);
        var stars = createStars(90, 64);
        scene.add(stars);
        var controls = new THREE.TrackballControls(camera);
        webglEl.appendChild(renderer.domElement);
        render();
        $(document).on('resize', function() { render(); });

        function render() { controls.update();
            sphere.rotation.y += 0.003;
            clouds.rotation.y += 0.005;
            requestAnimationFrame(render);
            renderer.render(scene, camera); }

        function createSphere(radius, segments) {
            return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture(' https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/2_no_clouds_1k.jpg'), bumpMap: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/elev_bump_1k.jpg'), bumpScale: 0.005, specularMap: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/water_1k.png'), specular: new THREE.Color('grey') })); }

        function createClouds(radius, segments) {
            return new THREE.Mesh(new THREE.SphereGeometry(radius + 0.003, segments, segments), new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/fair_clouds_1k.png'), transparent: true })); }

        function createStars(radius, segments) {
            return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/galaxy_starfield.jpg'), side: THREE.BackSide })); } }()); });