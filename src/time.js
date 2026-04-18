import * as THREE from 'three';

class Time {
  static instance = new Time();
  
  constructor() {
    this.timer = new THREE.Timer();
    this.timeScale = 1;
    this.deltaTime = 0;
    this.totalTime = 0;
  }

  update() {
    this.timer.update();
    this.deltaTime = this.timeScale * this.timer.getDelta();
    this.totalTime += this.deltaTime;
  }

  dt() {
    return this.deltaTime;
  }
}

export default Time;
