class Input {
  static SPACE = 32;
  static LEFT = 37;
  static UP = 38;
  static RIGHT = 39;
  static DOWN = 40;
  static ESCAPE = 27;

  static instance = new Input();

  constructor() {
    this.keys = {};
    this.keydown = {};

    document.addEventListener("keydown", this._keydown.bind(this));
    document.addEventListener("keyup", this._keyup.bind(this));
  }

  _keydown(e) {
    this.keydown[e.keyCode] = !this.key(e.keyCode);
    this.keys[e.keyCode] = true;
  }

  _keyup(e) {
    this.keys[e.keyCode] = false;
    this.keydown[e.keyCode] = false;
  }

  update() {
    for (const key in this.keydown) this.keydown[key] = false;
  }

  key(keycode) {
    if (this.keys.hasOwnProperty(keycode)) return this.keys[keycode];
    return false;
  }

  iskeydown(keycode) {
    if (this.keydown.hasOwnProperty(keycode)) return this.keydown[keycode];
    return false;
  }

  anykey() {
    return Object.keys(this.keys).filter((k) => this.keys[k]).length > 0;
  }
}

export default Input;
