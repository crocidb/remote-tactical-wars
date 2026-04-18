import * as THREE from "three";

import Pawn from "./pawn.js";
import Time from "./time.js";
import RingSignal from "./ringsignal.js";
import ParticleSystem from "./particles.js";

import * as utils from "./utils.js";

class Emitter extends Pawn {
  constructor(scene, board, x, y, type, rate) {
    super(board, "/assets/emitter.glb", x, y);
    this.name = "Emitter";
    this.type = type;
    this.rate = rate;

    this.rings = [];
    for (let i = 0; i < 3; i++) {
      this.rings.push(
        new RingSignal(scene, {
          minRadius: 0.05,
          maxRadius: 10.0,
          speed: 5.5,
          color: 0x55ffff,
        }),
      );
    }

    this.initialScaleY = 0.6;
    this.rateCounter = 0;
    this.flashIntensity = 0;
  }

  _getRing() {
    for (let ring of this.rings) {
      if (!ring.active) return ring;
    }

    return null;
  }

  action() {
  }

  emit() {
    let ring = this._getRing();
    if (ring == null) return;

    if (this.mesh != null) {
      ParticleSystem.instance.burst(this.mesh.position, 30, 1.9, 1.0, 0x55ffff);
      ring.emit(this.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
      this.mesh.scale.y = 0.8;
      this.flashIntensity = 0.4;
    }
  }

  _update() {
    for (let ring of this.rings) {
      ring.update();
    }

    this.rateCounter += Time.instance.dt();
    if (this.rateCounter >= this.rate) {
      this.rateCounter = 0;
      this.emit();
    }

    if (this.mesh) {
      this.mesh.scale.y = utils.lerp(this.mesh.scale.y, this.initialScaleY, 0.2);

      this.flashIntensity = utils.lerp(this.flashIntensity, 0, 0.08);
      this.mesh.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(0, this.flashIntensity, this.flashIntensity);
        }
      });
    }
  }
}

export default Emitter;
