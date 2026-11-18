#!/usr/bin/env node
/**
 * Static checks for the particle shaders. A broken shader only shows up at
 * runtime, as an empty canvas, so it is checked here instead:
 *
 *   1. each shader parses as GLSL, with no undefined variables or functions
 *   2. every uniform a shader declares is supplied by ContextField.tsx, and
 *      every uniform supplied there is declared by a shader
 *   3. every attribute the vertex shader reads is attached to the geometry
 *   4. every varying the fragment shader reads is written by the vertex shader
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parser } from '@shaderfrog/glsl-parser/index.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (p) => readFileSync(root + p, 'utf8')
const SHADERS = 'src/scene/shaders.ts'
const SCENE = 'src/scene/ContextField.tsx'

const errors = []
const fail = (msg) => errors.push(msg)

// --- pull the GLSL out of shaders.ts --------------------------------------
const src = read(SHADERS)
const shaders = {}
for (const m of src.matchAll(/export const (\w+) = \/\* glsl \*\/ `([^`]*)`/g)) {
  if (m[2].includes('${')) fail(`${SHADERS}: ${m[1]} interpolates JS (\${...}); this check reads the GLSL as written, so inline it`)
  shaders[m[1]] = m[2]
}
const vert = shaders.vertexShader
const frag = shaders.fragmentShader
if (!vert || !frag) {
  console.error(`✖ ${SHADERS}: expected vertexShader and fragmentShader as /* glsl */ template literals`)
  process.exit(1)
}

// --- 1. parse -------------------------------------------------------------
// GLSL built-ins the parser does not know, and what three.js's ShaderMaterial
// prepends to every shader
const BUILTINS = 'vec4 gl_Position; float gl_PointSize; vec4 gl_FragColor; vec2 gl_PointCoord; vec4 gl_FragCoord;\n'
const THREE_COMMON = 'uniform mat4 viewMatrix; uniform vec3 cameraPosition; uniform bool isOrthographic;\n'
const THREE_VERT = THREE_COMMON +
  'uniform mat4 modelMatrix; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; uniform mat3 normalMatrix;\n' +
  'attribute vec3 position; attribute vec3 normal; attribute vec2 uv;\n'
const preludes = { vertexShader: BUILTINS + THREE_VERT, fragmentShader: BUILTINS + THREE_COMMON }
for (const [name, glsl] of Object.entries({ vertexShader: vert, fragmentShader: frag })) {
  const prelude = preludes[name]
  try {
    parser.parse(prelude + glsl, { failOnWarn: true, quiet: true })
  } catch (e) {
    // report the line in shaders.ts, not in prelude + shader
    const offset = prelude.split('\n').length - 1
    const at = e.location?.start?.line
    const startLine = src.slice(0, src.indexOf(glsl)).split('\n').length
    const where = at ? `${SHADERS}:${startLine + at - offset - 1}` : SHADERS
    fail(`${where}: ${name}: ${String(e.message).split('\n')[0]}`)
  }
}

// --- 2-4. cross-checks ----------------------------------------------------
const names = (glsl, qualifier) => new Set([...glsl.matchAll(new RegExp(`^\\s*${qualifier}\\s+\\w+\\s+(\\w+)`, 'gm'))].map((m) => m[1]))
const scene = read(SCENE)

const declared = new Set([...names(vert, 'uniform'), ...names(frag, 'uniform')])
const supplied = new Set([...scene.matchAll(/^\s*(u[A-Z]\w*):\s*\{\s*value\b/gm)].map((m) => m[1]))
for (const u of declared) if (!supplied.has(u)) fail(`${SHADERS}: uniform ${u} is declared but ${SCENE} never supplies it (it would silently read 0)`)
for (const u of supplied) if (!declared.has(u)) fail(`${SCENE}: uniform ${u} is supplied but no shader declares it`)

const attached = new Set([...scene.matchAll(/attach="attributes-(\w+)"/g)].map((m) => m[1]))
for (const a of names(vert, 'attribute')) if (!attached.has(a)) fail(`${SHADERS}: attribute ${a} is read but ${SCENE} never attaches it`)

const written = names(vert, 'varying')
for (const v of names(frag, 'varying')) if (!written.has(v)) fail(`${SHADERS}: varying ${v} is read by the fragment shader but the vertex shader does not declare it`)

if (errors.length) {
  for (const e of errors) console.error('✖ ' + e)
  process.exit(1)
}
console.log(`✓ shaders: 2 parsed, ${declared.size} uniforms, ${names(vert, 'attribute').size} attributes, ${written.size} varyings match`)
