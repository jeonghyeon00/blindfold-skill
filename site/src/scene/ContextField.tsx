import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders'
import { DIRECTIONS, lerp, phaseAt, smooth, story } from '../lib/story'

const BONE = new THREE.Color('#EDEDE6')
/** the existing answer the thinking is biased toward */
const BIAS = new THREE.Color('#FF5236')
/** ideas, and only ideas, are yellow */
const BULB = new THREE.Color('#FFD23F')

function useParticleData(count: number) {
  return useMemo(() => {
    // deterministic so the composition is the same on every visit
    let seed = 1337
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

    // rays on a Fibonacci sphere: evenly spread in every direction,
    // flattened a little in depth so more of them read on screen
    const dirs = Array.from({ length: DIRECTIONS }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / DIRECTIONS
      const r = Math.sqrt(1 - y * y)
      const a = i * 2.399963
      const v = new THREE.Vector3(Math.cos(a) * r, y * 0.9, Math.sin(a) * r * 0.65).normalize()
      return [v.x, v.y, v.z]
    })

    const position = new Float32Array(count * 3)
    const aDir = new Float32Array(count * 3)
    const aRand = new Float32Array(count * 4)
    const aJitter = new Float32Array(count * 2)
    const aFork = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      aDir.set(dirs[i % DIRECTIONS], i * 3)
      aRand.set([rnd(), 0.02 + rnd() * 0.035, rnd(), 0.6 + rnd() * 1.1], i * 4)
      const ja = rnd() * Math.PI * 2
      const jr = Math.sqrt(rnd())
      aJitter.set([Math.cos(ja) * jr, Math.sin(ja) * jr], i * 2)
      aFork.set([rnd() < 0.5 ? -1 : 1, rnd() < 0.5 ? -1 : 1], i * 2)
    }
    return { position, aDir, aRand, aJitter, aFork }
  }, [count])
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
// camera keyframes
const CAM = {
  open: { pos: V(0, 0.5, 13.5), look: V(0, 0, 0), fov: 46 },
  bloom: { pos: V(0, 1.2, 15), look: V(0, 0, 0), fov: 54 },
  fork: { pos: V(1.6, 2.4, 13), look: V(0.4, 0, 0), fov: 60 },
}

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const data = useParticleData(count)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { camera, gl } = useThree()
  const tmp = useMemo(() => ({ pos: V(0, 0, 0), look: V(0, 0, 0), a: V(0, 0, 0), b: V(0, 0, 0) }), [])
  const ctxSmooth = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uContext: { value: 0 },
      uBloom: { value: 0 },
      uFork: { value: 0 },
      uGlow: { value: 0.55 },
      uSize: { value: 26 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColor: { value: BONE.clone() },
      uHot: { value: BIAS.clone() },
      uBulb: { value: BULB.clone() },
    }),
    [gl],
  )

  useFrame((state, delta) => {
    const m = mat.current
    if (!m) return
    story.p += (story.target - story.p) * Math.min(1, delta * 6)
    const ph = phaseAt(story.p)

    // the context swap happens behind the blindfold, so snap it there
    ctxSmooth.current = ph.blind ? ph.context : lerp(ctxSmooth.current, ph.context, Math.min(1, delta * 8))
    const c = ctxSmooth.current

    if (!reduced) m.uniforms.uTime.value += delta
    m.uniforms.uContext.value = c
    m.uniforms.uBloom.value = ph.bloom
    m.uniforms.uFork.value = ph.fork
    // bulbs: lit at the start, lit again (and more) after the blindfold
    m.uniforms.uGlow.value = ph.blind ? Math.max(0.55 * ph.bloom, ph.fork) : 0.55

    // camera: holds still on the burst while it leans (only a slight
    // tightening), then pulls back wide after the blindfold
    const { pos, look, a, b } = tmp
    pos.copy(CAM.open.pos)
    look.copy(CAM.open.look)
    let fov = lerp(CAM.open.fov, 40, smooth(c))

    if (ph.blind) {
      a.lerpVectors(CAM.bloom.pos, CAM.fork.pos, ph.fork)
      b.lerpVectors(CAM.bloom.look, CAM.fork.look, ph.fork)
      a.x += Math.sin(state.clock.elapsedTime * 0.08) * 1.0
      pos.lerp(a, ph.bloom)
      look.lerp(b, ph.bloom)
      fov = lerp(fov, lerp(CAM.bloom.fov, CAM.fork.fov, ph.fork), ph.bloom)
    }

    const cam = camera as THREE.PerspectiveCamera
    cam.position.set(pos.x + story.mouseX * 0.8, pos.y - story.mouseY * 0.5, pos.z)
    cam.fov = fov
    cam.updateProjectionMatrix()
    cam.lookAt(look)
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.position, 3]} />
        <bufferAttribute attach="attributes-aDir" args={[data.aDir, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[data.aRand, 4]} />
        <bufferAttribute attach="attributes-aJitter" args={[data.aJitter, 2]} />
        <bufferAttribute attach="attributes-aFork" args={[data.aFork, 2]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ContextField({ active, reduced }: { active: boolean; reduced: boolean }) {
  const small = typeof window !== 'undefined' && window.innerWidth < 760
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 13.5], fov: 46, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <Particles count={small ? 12000 : 30000} reduced={reduced} />
    </Canvas>
  )
}
