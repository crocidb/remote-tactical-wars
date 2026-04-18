import * as THREE from 'three';

import GameScene from "./gamescene.js"
import Time from "./time.js"
import Input from "./input.js"
import ParticleSystem from "./particles.js"

class System {
  constructor() {
    Input.instance.update();

    this.div = document.getElementById("gamediv");

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.div.appendChild(this.renderer.domElement);
    this.resize();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const w = this.div.clientWidth;
    const h = this.div.clientHeight;
    this.renderer.setSize(w, h, true);
    if (this.currentScene && this.currentScene.camera) {
      this.currentScene.camera.aspect = w / h;
      this.currentScene.camera.updateProjectionMatrix();
    }
  }

  start() {
    this.currentScene = new GameScene();
    this.resize();
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
