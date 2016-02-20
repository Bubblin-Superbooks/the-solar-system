document.addEventListener('DOMContentLoaded', function() {

  var webglEl = document.getElementById('webgl');

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage(webglEl);
    return;
  }


  var loader = new THREE.TextureLoader();
  loader.crossOrigin = true;


  var width = webglEl.clientWidth;
  var height = webglEl.clientHeight;

  /* var width = window.innerWidth;
   var height = window.innerHeight;

   webglEl.width = width;
   webglEl.height = height;
  */

  var radius = 0.5;
  var segments = 32;
  var rotation = 5;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.z = 3;

  var renderer = new THREE.WebGLRenderer();

  renderer.setSize(width, height);

  scene.add(new THREE.AmbientLight(0x333333));

  var light = new THREE.DirectionalLight(0xffffff, 0.5);
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


  var doit;

  function resizeFinish() {
    /* width = window.clientWidth;
     height = window.clientHeight;

     renderer.setSize(width, height);
     render();
     */

    alertSize();


  }
  window.onresize = function() {
    clearTimeout(doit);
    doit = setTimeout(function() {
      resizeFinish();
    }, 1000);
  };

  function render() {
    controls.update();
    sphere.rotation.y += 0.003;
    clouds.rotation.y += 0.005;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function createSphere(radius, segments) {
    return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshPhongMaterial({
      map: loader.load('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/2_no_clouds_1k.jpg'),
      bumpMap: loader.load('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/elev_bump_1k.jpg'),
      bumpScale: 0.005,
      specularMap: loader.load('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/water_1k.png'),
      specular: new THREE.Color('grey')
    }));
  }

  function createClouds(radius, segments) {
    return new THREE.Mesh(new THREE.SphereGeometry(radius + 0.003, segments, segments), new THREE.MeshPhongMaterial({
      map: loader.load('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/fair_clouds_1k.png'),
      transparent: true
    }));
  }

  function createStars(radius, segments) {
    return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshBasicMaterial({
      map: loader.load('https://cdn.rawgit.com/marvindanig/The-Solar-System/master/assets/images/galaxy_starfield.jpg'),
      side: THREE.BackSide
    }));
  }


  function alertSize() {
    var myWidth = 0,
      myHeight = 0;
    if (typeof(window.innerWidth) == 'number') {
      /* Non-IE */
      myWidth = window.innerWidth;
      myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      /* IE 6+ in 'standards compliant mode' */
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      /* IE 4 compatible */
      myWidth = document.body.clientWidth;
      myHeight = document.body.clientHeight;
    }
    console.log('Width = ' + myWidth);
    console.log('Height = ' + myHeight);

    document.getElementById('heightAttr').innerHTML = myHeight;

  }


});

function resizeFinish() {

  if (scene) {
    while (scene.children.length > 0) {
      scene.remove(scene.children[scene.children.length - 1]);
    }

    // cleanup without calling render (data needs to be cleaned up before a new scene can be generated)
    renderer.dispose(scene.children);
    renderer.dispose(scene);
  }

  alertSize();

  width = window.clientWidth;
  height = window.clientHeight;

  renderer.setSize(width, height);
  render();


}
window.onresize = function() {
  clearTimeout(doit);
  doit = setTimeout(function() {
    resizeFinish();
  }, 1000);
};


function render() {
  controls.update();
  sphere.rotation.y += 0.003;
  clouds.rotation.y += 0.005;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}