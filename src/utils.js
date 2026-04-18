// Text utils
const repltxt = (t, vs) => {
  vs.forEach((e, i) => (t = t.replace("%" + (i + 1), e)));
  return t;
};

// Math utils
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const clamp01 = (val) => clamp(val, 0, 1);
const lerp = (a, b, t) => a + (b - a) * clamp01(t);
const smoothstep = (v1, v2, x) => {
  x = clamp((x - v1) / (v2 - v1), 0.0, 1.0);
  return x * x * x * (x * (6.0 * x - 15.0) + 10.0);
};

// Array utils
const rangeArray = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Randoms
const randnum = (v = 1) => Math.random() * v;
const randint = (v) => Math.round(randnum(v));
const randsig = () => (randint(10) % 2 == 0 ? 1 : -1);
const randweight = (c, p) => {
  let sum = c.map(p).reduce((l, r) => l + r);
  let rand = randint(sum);
  return c.filter((e) => {
    rand = rand - p(e);
    return rand <= 0;
  })[0];
};
const randweightsqrd = (c, p) => randweight(c, (v) => p(v) * p(v));

// Coroutine
const co = (f) => {
  let g = f();

  const next = () => {
    let result = g.next();
    if (!result.done) {
      setTimeout(next, result.value * 1000);
    }
  };

  next();
};

// Mobile
const mobile = () => navigator.userAgent.match("Mobile");

// Audio stuff
let AUDIO = true;
let AUDIO_VOLUME = 100.0;
const SFX_VOLUME = 0.2;
const playaudiodelay = (a, d) => {
  setTimeout(() => playaudio(a), d);
};
const playaudio = (a) => {
  if (AUDIO) {
    if (!("count" in a)) a["count"] = 0;
    else a["count"] = (a["count"] + 1) % a.length;

    let sound = sfxr.toAudio(a[a.count]);
    sound.setVolume(AUDIO_VOLUME * SFX_VOLUME);
    sound.play();
  }
};
