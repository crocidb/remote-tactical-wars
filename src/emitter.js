import Pawn from "./pawn.js";

class Emitter extends Pawn {
  constructor(board, x, z) {
    super(board, "/assets/emitter.glb", x, z);
  }
}

export default Emitter;
