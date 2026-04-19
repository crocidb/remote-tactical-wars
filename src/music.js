class MusicManager {
  static instance = new MusicManager();

  constructor() {
    this._sound = null;
    this._lowPassFilter = null;
    this._muffled = false;
    this._playing = false;
    this._onFirstInteraction = this._onFirstInteraction.bind(this);
  }

  init() {
    if (this._sound !== null) return;

    if (typeof Pizzicato === 'undefined') {
      console.warn('[MusicManager] Pizzicato not loaded — music disabled.');
      return;
    }

    this._lowPassFilter = new Pizzicato.Effects.LowPassFilter({
      frequency: 350,
      peak: 10
    });

    this._sound = new Pizzicato.Sound(
      { source: 'file', options: { path: 'assets/music/music.ogg', loop: true } },
      () => { this._attemptPlay(); }
    );
  }

  _attemptPlay() {
    if (this._playing) return;
    try {
      const result = this._sound.play();
      if (result && typeof result.then === 'function') {
        result.then(() => {
          this._playing = true;
          window.removeEventListener('click', this._onFirstInteraction);
          window.removeEventListener('keydown', this._onFirstInteraction);
        }).catch(() => {
          this._registerInteractionFallback();
        });
      } else {
        this._playing = true;
      }
    } catch (e) {
      this._registerInteractionFallback();
    }
  }

  _registerInteractionFallback() {
    window.addEventListener('click', this._onFirstInteraction, { once: true });
    window.addEventListener('keydown', this._onFirstInteraction, { once: true });
  }

  _onFirstInteraction() {
    window.removeEventListener('click', this._onFirstInteraction);
    window.removeEventListener('keydown', this._onFirstInteraction);
    if (!this._playing && this._sound) {
      this._sound.play();
      this._playing = true;
    }
  }

  muffle(enable) {
    if (!this._sound) return;
    if (enable === this._muffled) return;
    if (enable) {
      this._sound.addEffect(this._lowPassFilter);
    } else {
      this._sound.removeEffect(this._lowPassFilter);
    }
    this._muffled = enable;
  }

  stop() {
    if (this._sound && this._playing) {
      this._sound.stop();
      this._playing = false;
    }
    window.removeEventListener('click', this._onFirstInteraction);
    window.removeEventListener('keydown', this._onFirstInteraction);
  }
}

export default MusicManager;
