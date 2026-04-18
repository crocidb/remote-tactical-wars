import * as THREE from 'three';

class _Time {
  constructor() {
    this.clock = new THREE.Timer();
    this.timeScale = 1;
    this.deltaTime = 0;
    this.totalTime = 0;
  }

  update() {
    this.deltaTime = this.timeScale * this.clock.getDelta();
    this.totalTime += this.deltaTime;
  }

  dt() {
    return this.deltaTime;
  }
}

const Time = new _Time();

export default Time;
