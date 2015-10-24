$(document).ready(function() {
  (function() {
    var webglEl = document.getElementById('webgl');
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage(webglEl);
      return;
    }
    THREE.ImageUtils.crossOrigin = '';
    var width = window.innerWidth,
      height = window.innerHeight;
    var radius = 0.5,
      segments = 32,
      rotation = 5;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.z = 4;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    scene.add(new THREE.AmbientLight(0x333333));
    var light = new THREE.DirectionalLight(0xffffff, .5);
    light.position.set(5, 3, 5);
    scene.add(light);
    var sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation;
    scene.add(sphere);
    var stars = createStars(90, 64);
    scene.add(stars);
    var controls = new THREE.TrackballControls(camera);
    webglEl.appendChild(renderer.domElement);
    render();

    function render() {
      controls.update();
      sphere.rotation.y -= 0.005;
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    function createSphere(radius, segments) {
      return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/page-38/venus/venusmap.jpg'),
        bumpScale: 0.05,
        specular: new THREE.Color('#111')
      }));
    }

    function createStars(radius, segments) {
      return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('https://cdn.rawgit.com/bubblin/The-Solar-System/master/images/shared/galaxy_starfield.jpg'),
        side: THREE.BackSide
      }));
    }
  }());
});