import * as THREE from "three";

import Pawn from "./pawn.js";
import Bullet from "./bullet.js";
import ParticleSystem from "./particles.js"

import * as utils from "./utils.js";

class Canon extends Pawn {
  constructor(scene, board, x, z) {
    super(board, "/assets/canon.glb", x, z);
    this.scene = scene;
    this.name = "Canon";

    this.initialScaleY = 0.6;
    this.flashIntensity = 0;
  }

  action() {

  }

  fire() {
    if (!this.mesh) return;

    const worldPos = new THREE.Vector3();
    this.mesh.getWorldPosition(worldPos);
    worldPos.y += 0.5;

    const velocity = new THREE.Vector3(0, 0, 6);
    if (this.mesh) this.mesh.scale.y = 0.5;

    this.flashIntensity = 0.5;

    ParticleSystem.instance.burst(this.mesh.position.clone().add(new THREE.Vector3(0, 0, .6)), 30, .7, 1.0, 0xffaa55);

    Bullet.get(this.scene, worldPos, velocity, 0.1, 3.0, this);
  }

  _update() {
    if (!this.mesh) return;

    this.mesh.scale.y = utils.lerp(this.mesh.scale.y, this.initialScaleY, 0.2);

    this.flashIntensity = utils.lerp(this.flashIntensity, 0, 0.1);
    this.mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = new THREE.Color(this.flashIntensity, this.flashIntensity, this.flashIntensity * .8);
      }
    });
  }
}

export default Canon;
