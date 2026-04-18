import * as THREE from 'three';

import Time from "./time.js"

class ParticleSystem {
  constructor() {
    this.emitters = [];
  }

  update() {
    for (let e of this.emitters) {
      if (e.active) e.update();
    }
  }
}

class ParticleEmitter {
  constructor() {
    this.active = false;
    this.particles = [];
  }
}

class Particle {
  constructor(pos, lifetime, updateFunction) {
    this.active = true;
    this.position = THREE.Vector3(0, 0, 0).a(pos);
    this.velocity = THREE.Vector3(0,0,0);
    this.lifetime = lifetime;
    this.updateFunction = null;
  }

  update() {
    this.lifetime -= Time.dt();
    if (this.lifetime <= 0) this.active = false;
    if (!this.active) return;

    if (this.updateFunction != null) this.updateFunction();
  }
}
