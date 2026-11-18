/**
 * Particle field. Every particle rides one of DIRECTIONS rays that leave a
 * single source point (the requirement) in every direction.
 *
 *   open    — rays in all directions (no context: countless options)
 *   anchor  — one patch of the burst (the existing answer) is tinted
 *   lean    — as context fills, the rest of the rays bend toward that patch,
 *             the ones already closest first, and take on its tint, until
 *             everything points into it. Nothing else moves.
 *   bloom   — after the blindfold: every direction again, longer, forking
 *             twice and ending in sparks
 */
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uContext;
  uniform float uBloom;
  uniform float uFork;
  uniform float uGlow;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aDir;   // unit ray direction
  attribute vec4 aRand;   // x: phase, y: speed, z: lean threshold, w: size
  attribute vec2 aJitter;
  attribute vec2 aFork;   // which side of each fork this particle takes (±1)

  varying float vAlpha;
  varying float vLean;
  varying float vSpark;

  // where the existing answer sits: one fixed patch of the burst, upper right
  const vec3 BIAS = vec3(0.83, 0.42, 0.37);

  vec3 perpOf(vec3 d) {
    vec3 a = abs(d.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    return normalize(cross(d, a));
  }

  vec3 rotY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }

  float forkCurve(float t, float at) {
    float k = max(t - at, 0.0) / (1.0 - at);
    return k * k * (3.0 - 2.0 * k);
  }

  void main() {
    float t = fract(aRand.x + uTime * aRand.y);
    float c = uContext;

    // the whole burst turns slowly; leaning is measured after the turn
    vec3 dir0 = rotY(aDir, uTime * 0.035);
    vec3 side = perpOf(dir0);

    // lean: rays already facing the bias side give in first
    float facing = dot(dir0, normalize(BIAS)) * 0.5 + 0.5; // 0 (away) .. 1 (toward)
    // the patch itself: rays already pointing at the existing answer
    float anchor = smoothstep(0.88, 0.95, facing) * smoothstep(0.0, 0.08, c);
    float thr = mix(0.62, 0.0, facing) * 0.85 + aRand.z * 0.18;
    float leanFull = smoothstep(thr, thr + 0.38, c);
    // a few rays never fully give in: they hang back around the bundle as faint
    // specks, so the end of the lean still has some life outside it
    float stray = step(0.88, fract(sin(aRand.x * 91.7 + aRand.z * 47.3) * 43758.5453));
    float lean = min(leanFull, mix(1.0, 0.5, stray));
    // rays bend toward the patch; the source stays put
    vec3 d = normalize(mix(dir0, normalize(BIAS), lean * 0.94) + 1e-4);

    float len = mix(5.4, 6.4, lean);
    vec3 pos = d * len * pow(t, 0.9);
    pos += side * sin(t * 4.0 + aRand.x * 20.0 + uTime * 0.3) * 0.14 * t * (1.0 - lean);
    pos += side * aJitter.x * mix(0.03, 0.12, lean) * t;

    // bloom: all directions, longer, forking twice
    vec3 s2 = cross(dir0, side);
    vec3 bloom = dir0 * 7.6 * pow(t, 0.8);
    bloom += side * aFork.x * forkCurve(t, 0.35) * 1.5;
    bloom += s2 * aFork.y * forkCurve(t, 0.62) * 1.2 * uFork;
    bloom += side * aJitter.y * 0.03 * t;
    pos = mix(pos, bloom, uBloom);

    // ideas light up as yellow bulbs at the ray ends; a ray that has leaned
    // toward the existing answer switches its bulb off. More bulbs after forking.
    float bulbs = step(mix(0.88, 0.72, uFork), aRand.z);
    // (stragglers' bulbs go out too: they hang back, they don't have ideas)
    float spark = uGlow * (1.0 - leanFull * (1.0 - uBloom)) * smoothstep(0.78, 0.96, t) * bulbs;
    // a soft, per-bulb flicker as it switches on
    spark *= 0.82 + 0.18 * sin(uTime * 3.0 + aRand.x * 40.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aRand.w * uPixelRatio * (1.0 / -mv.z) * (1.0 + spark * 3.6);

    float edge = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.86, 1.0, t) * (1.0 - spark));
    float hangBack = stray * leanFull * (1.0 - uBloom);
    vAlpha = edge * 0.7 * (1.0 - hangBack * 0.45) * (1.0 + uBloom * 0.2);
    // tinted: the patch, and every ray that has given in to it (stragglers stay pale)
    vLean = max(lean * (1.0 - stray * 0.7), anchor) * (1.0 - uBloom);
    vSpark = spark;
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform vec3 uBulb;
  varying float vAlpha;
  varying float vLean;
  varying float vSpark;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // bulbs: white-hot filament core inside a warm yellow halo
    float core = smoothstep(0.5, 0.05, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.45 + smoothstep(0.1, 0.0, d);
    float lit = smoothstep(0.05, 0.35, vSpark);
    float a = mix(core, halo, lit);
    // the existing answer's patch, and the rays that gave in to it, take its tint
    vec3 col = mix(uColor, uHot, vLean);
    vec3 bulb = mix(uBulb, vec3(1.0, 0.98, 0.9), smoothstep(0.12, 0.0, d));
    col = mix(col, bulb, lit);
    gl_FragColor = vec4(col, a * vAlpha * (1.0 + vSpark * 1.4));
  }
`
