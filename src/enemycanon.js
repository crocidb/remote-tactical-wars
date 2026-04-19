import * as THREE from "three";
import Canon from "./canon.js";
import Pawn, { SIGNAL_LABELS, SIGNAL_COLORS, SIGNAL_BG_COLORS, signalImages } from "./pawn.js";

const ENEMY_COLOR = 0xff3300;

class EnemyCanon extends Canon {
  constructor(scene, board, x, z, camera, receiverType = 1, orientation = 0) {
    super(scene, board, x, z, camera, receiverType, orientation);
    this.name = "Enemy Canon";
    this._colorApplied = false;
  }

  action() {}

  _update() {
    super._update();

    this.name = "Enemy Canon " + this.life + "/" + this.maxLife;

    if (this.mesh && !this._colorApplied) {
      this.mesh.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          child.material.color = new THREE.Color(ENEMY_COLOR);
        }
      });
      this._colorApplied = true;
    }
  }

  _updateReceiverVisuals() {
    this.description = `<b>${SIGNAL_LABELS[this.receiverType]}</b>`;
    this._redrawSpriteCanvas();
  }
}

export default EnemyCanon;
