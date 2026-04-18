import * as THREE from 'three';

import GameScene from "./gamescene.js"

class System {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
  }

  start() {
    this.currentScene = new GameScene();
    this.update();
  }

  update() {
    this.renderer.render(this.currentScene.scene, this.currentScene.camera);
    requestAnimationFrame(this.update.bind(this));
  }
}

export default System;
