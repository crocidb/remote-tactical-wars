import Pawn from "./pawn.js";

class Canon extends Pawn {
  constructor(board, x, z) {
    super(board, "/assets/canon.glb", x, z);
  }
}

export default Canon;
