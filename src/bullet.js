import * as THREE from "three";
import Time from "./time.js";

class Bullet {
  constructor() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.radius = 0.1;
    this.lifetime = 0;
    this.owner = null;
    this.active = false;
    this._geometry = null;
    this._material = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 2.0,
      roughness: 0.4,
      metalness: 0.0,
    });
    this.mesh = null;
  }

  _init(scene, position, velocity, radius, lifetime, owner) {
    if (this._geometry) this._geometry.dispose();
    this._geometry = new THREE.SphereGeometry(radius, 8, 6);

    if (this.mesh) {
      if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
      this.mesh.geometry = this._geometry;
    } else {
      this.mesh = new THREE.Mesh(this._geometry, this._material);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = false;
    }

    this.position.copy(position);
    this.velocity.copy(velocity);
    this.radius = radius;
    this.lifetime = lifetime;
    this.owner = owner;
    this.active = true;

    this.mesh.position.copy(this.position);
    scene.add(this.mesh);
  }

  update(scene) {
    if (!this.active) return;
    const dt = Time.instance.dt();
    this.position.addScaledVector(this.velocity, dt);
    this.mesh.position.copy(this.position);
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.active = false;
      scene.remove(this.mesh);
    }
  }

  static get(scene, position, velocity, radius, lifetime, owner) {
    for (const b of Bullet.pool) {
      if (!b.active) {
        b._init(scene, position, velocity, radius, lifetime, owner);
        return b;
      }
    }
    const b = new Bullet();
    b._init(scene, position, velocity, radius, lifetime, owner);
    Bullet.pool.push(b);
    return b;
  }

  static updateAll(scene) {
    for (const b of Bullet.pool) {
      if (b.active) b.update(scene);
    }
  }
}

Bullet.pool = [];

export default Bullet;
