<script setup lang="ts">
import * as THREE from 'three';

onMounted(() => {
  initThree()
})

let camera, scene, renderer;
let isUserInteracting = false,
    onPointerDownMouseX = 0, onPointerDownMouseY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0,
    phi = 0, theta = 0;
const initThree = () => {
  const container = document.getElementById( 'threeContainer' );
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
  scene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry( 500, 60, 40 );
  geometry.scale( - 1, 1, 1 );
  const texture = new THREE.TextureLoader().load( 'images/box.jpg' );
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial( { map: texture } );
  const mesh = new THREE.Mesh( geometry, material )
	scene.add( mesh );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );
  container.appendChild( renderer.domElement );

  container.style.touchAction = 'none';
}

const animate = () => {
  if ( isUserInteracting === false ) {
    lon += 0.1;
  }

  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = THREE.MathUtils.degToRad( 90 - lat );
  theta = THREE.MathUtils.degToRad( lon );

  const x = 500 * Math.sin( phi ) * Math.cos( theta );
  const y = 500 * Math.cos( phi );
  const z = 500 * Math.sin( phi ) * Math.sin( theta );

  camera.lookAt( x, y, z );

  renderer.render( scene, camera );
}

</script>
<template>
  <div id="threeContainer" class="w-100vw h-100vh overflow-hidden"></div>
</template>