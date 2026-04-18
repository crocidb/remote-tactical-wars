import * as THREE from "three";

import Input from "./input.js"
import ParticleSystem from "./particles.js"
import Board from "./board.js"
import LEVEL_DATA from "./level.js"

class GameScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    ParticleSystem.instance.init(this.scene);

    this.currentLevel = LEVEL_DATA[0];

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 5, -10);
    this.camera.lookAt(0, 0, 0);

    // LIGHT
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(this.ambientLight);

    this.sun = new THREE.DirectionalLight(0xffffff, 1.0);
    this.sun.position.set(6, 10, 4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -8;
    this.sun.shadow.camera.right = 8;
    this.sun.shadow.camera.top = 8;
    this.sun.shadow.camera.bottom = -8;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 30;
    this.sun.shadow.bias = -0.0005;

    this.scene.add(this.sun);

    // BOARD
    this.board = new Board(this.currentLevel.board.width, this.currentLevel.board.height);
    this.scene.add(this.board.board);

    // Test object
    const obj = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0xc0392b,
        roughness: 0.4,
        metalness: 0.1,
      }),
    );
    obj.position.set(0, 0, 0);
    this.scene.add(obj);
  }

  update() {
    if (Input.instance.iskeydown(Input.SPACE)) {
      ParticleSystem.instance.burst(new THREE.Vector3(0,0,0), 80, 2.0, 1.0);
    }
  }
}

export default GameScene;
