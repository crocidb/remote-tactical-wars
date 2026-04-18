import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import Input from "./input.js";
import Time from "./time.js";
import ParticleSystem from "./particles.js";
import Board from "./board.js";
import LEVEL_DATA from "./level.js";

class GameScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    ParticleSystem.instance.init(this.scene);

    this.currentLevel = LEVEL_DATA[0];

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
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
    this.board = new Board(
      this.currentLevel.board.width,
      this.currentLevel.board.height,
    );
    this.scene.add(this.board.board);

    this._fitCameraToBoard(this.currentLevel.board.width, this.currentLevel.board.height);

    // Load emitter model
    const loader = new GLTFLoader();

    loader.load("/assets/emitter.glb", (gltf) => {
      this.emitter = gltf.scene;
      this.emitter.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.emitter.position.set(0, .55, -2.5);
      this.emitter.scale.set(.6,.6,.6);
      this.scene.add(this.emitter);
    });

    loader.load("/assets/canon.glb", (gltf) => {
      this.canon = gltf.scene;
      this.canon.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.canon.position.set(0, .55, .5);
      this.canon.scale.set(.6,.6,.6);
      this.scene.add(this.canon);
    });
  }

  _fitCameraToBoard(boardWidth, boardHeight) {
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const halfCamZ = boardHeight / (2 * Math.SQRT2);
    const distForWidth = (boardWidth / 2) / Math.tan(hFov / 2) + halfCamZ * Math.SQRT2;
    const distForDepth = halfCamZ / Math.tan(vFov / 2) + halfCamZ * Math.SQRT2;
    const D = Math.max(distForWidth, distForDepth) * 1.1;
    this.camera.position.set(0, D / Math.SQRT2, -D / Math.SQRT2);
    this.camera.lookAt(0, 0, 0);
  }

  update() {
    if (Input.instance.iskeydown(Input.SPACE)) {
      ParticleSystem.instance.burst(new THREE.Vector3(0,0,0), 80, 2.0, 1.0);
    }
  }
}

export default GameScene;
