#!/usr/bin/env node
// Static checks for the skill repo: Agent Skills spec rules for every
// SKILL.md, the Claude Code and Codex manifests, and that names, versions
// and paths agree everywhere. No dependencies; run with `node scripts/validate.mjs`.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const fail = (where, msg) => errors.push(`${relative(ROOT, where) || '.'}: ${msg}`)
const readJson = (p) => {
  try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) { fail(p, `invalid JSON (${e.message})`); return null }
}
const dirs = (p) => (existsSync(p) ? readdirSync(p).filter((n) => statSync(join(p, n)).isDirectory()) : [])

/** frontmatter as a flat map; one level of nesting (metadata:) is enough here */
function frontmatter(path) {
  const text = readFileSync(path, 'utf8')
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) { fail(path, 'no YAML frontmatter'); return { fm: {}, body: text } }
  const fm = {}
  let parent = null
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const nested = line.match(/^\s+([\w-]+):\s*(.*)$/)
    const top = line.match(/^([\w-]+):\s*(.*)$/)
    const value = (v) => v.replace(/^(["'])(.*)\1$/, '$2')
    if (nested && parent) fm[parent][nested[1]] = value(nested[2])
    else if (top) {
      if (top[2] === '') { fm[top[1]] = {}; parent = top[1] } else { fm[top[1]] = value(top[2]); parent = null }
    } else fail(path, `unreadable frontmatter line: ${line}`)
  }
  return { fm, body: text.slice(m[0].length) }
}

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/
const SPEC_FIELDS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'])

function checkSkill(dir, pluginVersion) {
  const path = join(dir, 'SKILL.md')
  if (!existsSync(path)) return fail(dir, 'missing SKILL.md')
  const { fm, body } = frontmatter(path)
  const dirName = dir.split('/').pop()
  for (const k of Object.keys(fm)) if (!SPEC_FIELDS.has(k)) fail(path, `field "${k}" is not in the Agent Skills spec`)
  if (typeof fm.name !== 'string' || !NAME.test(fm.name) || fm.name.length > 64) fail(path, 'name must be 1-64 lowercase letters, digits and single hyphens')
  if (fm.name !== dirName) fail(path, `name "${fm.name}" must match its directory "${dirName}"`)
  if (typeof fm.description !== 'string' || !fm.description.length || fm.description.length > 1024) fail(path, 'description must be 1-1024 characters')
  if (fm.compatibility !== undefined && (typeof fm.compatibility !== 'string' || fm.compatibility.length > 500)) fail(path, 'compatibility must be at most 500 characters')
  if (fm.metadata !== undefined && typeof fm.metadata !== 'object') fail(path, 'metadata must be a map of strings')
  if (fm.metadata?.version !== pluginVersion) fail(path, `metadata.version "${fm.metadata?.version}" must match the plugin version "${pluginVersion}"`)
  if (body.split('\n').length > 500) fail(path, 'keep SKILL.md under 500 lines')
  // every relative link must point at a file in the skill
  for (const [, target] of body.matchAll(/\]\(([^)#\s]+)\)/g)) {
    if (/^[a-z]+:/i.test(target)) continue
    if (!existsSync(join(dir, target))) fail(path, `link to missing file ${target}`)
  }
  return fm.name
}

function checkPlugin(dir) {
  const claude = readJson(join(dir, '.claude-plugin/plugin.json'))
  const codex = readJson(join(dir, '.codex-plugin/plugin.json'))
  if (!claude || !codex) return null
  const name = dir.split('/').pop()
  for (const [label, m] of [['.claude-plugin', claude], ['.codex-plugin', codex]]) {
    if (m.name !== name) fail(dir, `${label}/plugin.json name "${m.name}" must match the directory "${name}"`)
    if (!/^\d+\.\d+\.\d+/.test(m.version ?? '')) fail(dir, `${label}/plugin.json needs a semver version`)
  }
  for (const k of ['version', 'description', 'license', 'repository']) {
    if (claude[k] !== codex[k]) fail(dir, `"${k}" differs between .claude-plugin and .codex-plugin`)
  }
  for (const p of [codex.skills, codex.interface?.composerIcon, codex.interface?.logo].filter(Boolean)) {
    if (!p.startsWith('./')) fail(dir, `.codex-plugin path "${p}" must start with ./`)
    if (!existsSync(join(dir, p))) fail(dir, `.codex-plugin points at missing ${p}`)
  }
  const skills = dirs(join(dir, 'skills')).map((s) => checkSkill(join(dir, 'skills', s), claude.version))
  if (!skills.length) fail(dir, 'plugin has no skills')
  return { name, version: claude.version }
}

const plugins = new Map()
for (const p of dirs(join(ROOT, 'plugins'))) {
  const info = checkPlugin(join(ROOT, 'plugins', p))
  if (info) plugins.set(info.name, info)
}

// Claude Code marketplace
const ccPath = join(ROOT, '.claude-plugin/marketplace.json')
const cc = readJson(ccPath)
if (cc) {
  if (!cc.name || !cc.owner?.name) fail(ccPath, 'needs name and owner.name')
  for (const e of cc.plugins ?? []) {
    const src = typeof e.source === 'string' ? e.source : null
    if (!src || !existsSync(join(ROOT, src, '.claude-plugin/plugin.json'))) { fail(ccPath, `"${e.name}" source must be a plugin directory`); continue }
    const p = plugins.get(e.name)
    if (!p) fail(ccPath, `lists unknown plugin "${e.name}"`)
    else if (e.version && e.version !== p.version) fail(ccPath, `"${e.name}" version ${e.version} must match plugin.json ${p.version}`)
  }
  for (const name of plugins.keys()) if (!cc.plugins?.some((e) => e.name === name)) fail(ccPath, `plugin "${name}" is not listed`)
}

// Codex marketplace
const cxPath = join(ROOT, '.agents/plugins/marketplace.json')
const cx = readJson(cxPath)
if (cx) {
  if (!cx.name) fail(cxPath, 'needs a name')
  for (const e of cx.plugins ?? []) {
    const path = typeof e.source === 'string' ? e.source : e.source?.path
    if (!path || !existsSync(join(ROOT, path, '.codex-plugin/plugin.json'))) fail(cxPath, `"${e.name}" source must be a plugin directory`)
    if (!['AVAILABLE', 'INSTALLED_BY_DEFAULT', 'NOT_AVAILABLE'].includes(e.policy?.installation)) fail(cxPath, `"${e.name}" needs policy.installation`)
    if (!e.category) fail(cxPath, `"${e.name}" needs a category`)
    if (!plugins.has(e.name)) fail(cxPath, `lists unknown plugin "${e.name}"`)
  }
  for (const name of plugins.keys()) if (!cx.plugins?.some((e) => e.name === name)) fail(cxPath, `plugin "${name}" is not listed`)
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'))
  process.exit(1)
}
console.log(`✓ ${plugins.size} plugin(s): ${[...plugins.values()].map((p) => `${p.name}@${p.version}`).join(', ')}; skills and both marketplaces agree`)
