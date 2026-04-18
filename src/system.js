import * as THREE from 'three';

import GameScene from "./gamescene.js"
import Time from "./time.js"
import Input from "./input.js"
import ParticleSystem from "./particles.js"

class System {
  constructor() {
    Input.instance.update();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(this.renderer.domElement);
  }

  start() {
    this.currentScene = new GameScene();
    this.update();
  }

  update() {
    Time.instance.update();
    ParticleSystem.instance.update();

    this.currentScene.update();

    this.renderer.render(this.currentScene.scene, this.currentScene.camera);
    requestAnimationFrame(this.update.bind(this));
    Input.instance.update();
  }
}

export default System;
