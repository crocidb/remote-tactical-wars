import * as THREE from "three";

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new THREE.Group();

    const offset = {
      x: (width - 1) / 2,
      z: (height - 1) / 2
    };
    const squareGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeed2,
      roughness: 0.8,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x769656,
      roughness: 0.8,
    });

    for (let x = 0; x < width; x++) {
      for (let z = 0; z < height; z++) {
        const mat = (x + z) % 2 == 0 ? lightMaterial : darkMaterial;
        const mesh = new THREE.Mesh(squareGeometry, mat);
        mesh.position.set(x - offset.x, -0.05, z - offset.z);
        mesh.receiveShadow = true;
        this.board.add(mesh);
      }
    }
  }
}

export default Board;
