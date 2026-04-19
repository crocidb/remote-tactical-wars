import * as THREE from "three";

import Pawn from "./pawn.js";
import Time from "./time.js";
import Bullet from "./bullet.js";
import ParticleSystem from "./particles.js"

import * as utils from "./utils.js";

class Canon extends Pawn {
  constructor(scene, board, x, z, camera) {
    super(board, "/assets/canon.glb", x, z);
    this.scene = scene;
    this.camera = camera;
    this.name = "Canon";
    this.description = "Click to deactivate";

    this.initialScaleY = 0.6;
    this.flashIntensity = 0;

    this._spriteWorldPos = new THREE.Vector3();

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(155,70,85,0.9)";
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,220,150,1)";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚡", 32, 34);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    this.sprite = new THREE.Sprite(mat);
    this.sprite.position.set(0, -.1, 0);
    this.sprite.renderOrder = 999;
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

    if (!this._spriteAttached) {
      this.mesh.add(this.sprite);
      this._spriteAttached = true;
    }

    this.mesh.scale.y = utils.lerp(this.mesh.scale.y, this.initialScaleY, Time.instance.dt() * 9.0);

    this.flashIntensity = utils.lerp(this.flashIntensity, 0, Time.instance.dt() * 9.0);
    this.mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = new THREE.Color(this.flashIntensity, this.flashIntensity, this.flashIntensity * .8);
      }
    });

    if (this.camera) {
      this.sprite.getWorldPosition(this._spriteWorldPos);
      const dist = this.camera.position.distanceTo(this._spriteWorldPos);
      const k = 0.045;
      this.sprite.scale.set(dist * k, dist * k, 1);
    }
  }
}

export default Canon;
