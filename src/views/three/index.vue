<script setup lang="ts">
import * as THREE from 'three';
import ScaleBox from "vue3-scale-box";
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

onMounted(() => { initThree() })

let camera, scene, renderer, clock = new THREE.Clock(), controller;
const initThree = () => {
  const container = document.getElementById( 'threeContainer');
  if (!container) return;
  camera = new THREE.PerspectiveCamera( 75, 1920 / 1080, 1, 1100 );
  controller = new FirstPersonControls(camera, container)
  controller.lookSpeed = 0.02; // 鼠标移动查看的速度
  controller.movementSpeed = 1; // 相机移动速度
  controller.constrainVertical = true; // 垂直约束
  controller.verticalMax = 2.5; //
  controller.verticalMin = 1.0; //
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
  renderer.setSize( 1920, 1080 );
  renderer.setAnimationLoop( animate );
  container.appendChild( renderer.domElement );
  container.style.touchAction = 'none';
}

const animate = () => {
  controller.update(clock.getDelta());
  renderer.render( scene, camera );
}

</script>
<template>
  <ScaleBox>
    <div
      id="threeContainer"
      class="w-1920px h-1080px overflow-hidden"
    ></div>
  </ScaleBox>
</template>