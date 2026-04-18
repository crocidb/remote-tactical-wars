import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class Pawn {
  constructor(board, modelPath, x, z) {
    this.board = board;
    this.x = x;
    this.z = z;
    this.mesh = null;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      this.mesh = gltf.scene;
      this.mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.mesh.scale.set(0.6, 0.6, 0.6);
      this._applyPosition();
      board.board.add(this.mesh);
    });
  }

  _applyPosition() {
    const offsetX = (this.board.width - 1) / 2;
    const offsetZ = (this.board.height - 1) / 2;
    this.mesh.position.set(this.x - offsetX, 0.6, this.z - offsetZ);
  }

  moveTo(x, z) {
    this.x = x;
    this.z = z;
    if (this.mesh) this._applyPosition();
  }
}

export default Pawn;
