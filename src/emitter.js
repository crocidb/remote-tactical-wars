import * as THREE from "three";

import Pawn from "./pawn.js";
import Time from "./time.js";
import RingSignal from "./ringsignal.js";
import ParticleSystem from "./particles.js";

import * as utils from "./utils.js";

class Emitter extends Pawn {
  constructor(scene, board, x, y, type, rate, camera) {
    super(board, "/assets/emitter.glb", x, y);
    this.name = "Emitter";
    this.description = "";
    this.type = type;
    this.rate = rate;
    this.camera = camera;

    this._spriteWorldPos = new THREE.Vector3();

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(35, 75,75,0.9)";
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(150,255,255,1)";
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
    this.sprite.position.set(0, -0.1, 0);
    this.sprite.renderOrder = 999;

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

  action() {}

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
      if (!this._spriteAttached) {
        this.mesh.add(this.sprite);
        this._spriteAttached = true;
      }

      this.mesh.scale.y = utils.lerp(
        this.mesh.scale.y,
        this.initialScaleY,
        Time.instance.dt() * 9.0,
      );

      this.flashIntensity = utils.lerp(
        this.flashIntensity,
        0,
        Time.instance.dt() * 10.0,
      );
      this.mesh.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(
            0,
            this.flashIntensity,
            this.flashIntensity,
          );
        }
      });

      if (this.camera) {
        this.sprite.getWorldPosition(this._spriteWorldPos);
        const dist = this.camera.position.distanceTo(this._spriteWorldPos);
        this.sprite.scale.setScalar(dist * 0.055);
      }
    }
  }
}

export default Emitter;
