/**
 * π-PAI v3 — Personal AI Infrastructure Extension for Pi
 *
 * Merges three lineages:
 * 1. Daniel Miessler's PAI v3.0 Algorithm (7-phase, ISC, effort levels, learnings)
 * 2. disler's damage-control patterns (97 bash patterns, zero-access/read-only/no-delete paths)
 * 3. disler's pi-vs-claude-code extension patterns (widgets, tool_call hooks, session persistence)
 *
 * Features:
 * - /pai command: mission, goals, challenges, learnings, 7-phase inner loop with ISC
 * - /ralph command: simple iteration loops (Ralph Wiggum technique)
 * - Damage control: 97+ bash patterns, path protection via YAML rules
 * - Rating capture: /rate <1-10> for signal-based learning
 * - pai_status, pai_learn, pai_rate tools for agent-driven use
 * - Live TUI widget: mission, goals, loop phase, effort level
 * - Session persistence via pi.appendEntry()
 *
 * Usage: pi -e path/to/pi-pai/src/extension.ts
 */

import type { ExtensionAPI, ExtensionContext } from '@mariozechner/pi-coding-agent'
import { Type } from '@sinclair/typebox'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

// ── Types ────────────────────────────────────────────────────────────────────

type AlgorithmPhase = 'OBSERVE' | 'THINK' | 'PLAN' | 'DEFINE' | 'EXECUTE' | 'MEASURE' | 'LEARN'
type EffortLevel = 'instant' | 'fast' | 'standard' | 'extended' | 'deep'
type GoalStatus = 'active' | 'blocked' | 'completed' | 'paused'
type Priority = 'p0' | 'p1' | 'p2' | 'p3'
type SignalRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface Goal {
  id: string
  title: string
  status: GoalStatus
  priority: Priority
  blockedBy?: string[]
  isc?: string[] // Ideal State Criteria
}

interface Challenge {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedGoals: string[]
}

interface Learning {
  insight: string
  confidence: number
  category: 'algorithm' | 'system' | 'domain' | 'process'
  timestamp: Date
  fromRating?: number
}

interface InnerLoopState {
  phase: AlgorithmPhase
  goal: string
  effort: EffortLevel
  isc: string[]
  data: Record<string, string>
  startTime: number
}

interface Rating {
  score: SignalRating
  context: string
  timestamp: Date
}

interface PAIState {
  mission: string | null
  goals: Map<string, Goal>
  challenges: Map<string, Challenge>
  learnings: Learning[]
  ratings: Rating[]
  innerLoop: InnerLoopState | null
  iterationCount: number
  ralphIteration: number
  ralphActive: boolean
}

// ── Damage Control ───────────────────────────────────────────────────────────

interface DamageRule {
  pattern: string
  reason: string
  ask?: boolean
}

interface DamageRules {
  bashToolPatterns: DamageRule[]
  zeroAccessPaths: string[]
  readOnlyPaths: string[]
  noDeletePaths: string[]
}

function loadDamageRules(cwd: string): DamageRules {
  const defaults: DamageRules = {
    bashToolPatterns: [],
    zeroAccessPaths: [],
    readOnlyPaths: [],
    noDeletePaths: [],
  }

  // Try loading from project, then from package
  const candidates = [
    path.join(cwd, '.pi', 'damage-control-rules.yaml'),
    path.join(cwd, 'damage-control-rules.yaml'),
    path.join(__dirname, '..', 'damage-control-rules.yaml'),
  ]

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const content = fs.readFileSync(candidate, 'utf8')
        return parseSimpleYaml(content)
      }
    } catch {}
  }

  return defaults
}

function parseSimpleYaml(content: string): DamageRules {
  const rules: DamageRules = {
    bashToolPatterns: [],
    zeroAccessPaths: [],
    readOnlyPaths: [],
    noDeletePaths: [],
  }

  let currentSection = ''
  let currentItem: Partial<DamageRule> = {}

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    // Section headers
    if (trimmed === 'bashToolPatterns:') { currentSection = 'bash'; continue }
    if (trimmed === 'zeroAccessPaths:') { currentSection = 'zero'; continue }
    if (trimmed === 'readOnlyPaths:') { currentSection = 'readonly'; continue }
    if (trimmed === 'noDeletePaths:') { currentSection = 'nodelete'; continue }

    if (currentSection === 'bash') {
      const patternMatch = trimmed.match(/^-?\s*pattern:\s*'(.+)'$/)
      const reasonMatch = trimmed.match(/^reason:\s*(.+)$/)
      const askMatch = trimmed.match(/^ask:\s*(true|false)$/)

      if (patternMatch) {
        if (currentItem.pattern) {
          rules.bashToolPatterns.push(currentItem as DamageRule)
        }
        currentItem = { pattern: patternMatch[1] }
      } else if (reasonMatch && currentItem.pattern) {
        currentItem.reason = reasonMatch[1]
      } else if (askMatch && currentItem.pattern) {
        currentItem.ask = askMatch[1] === 'true'
      }
    } else {
      const pathMatch = trimmed.match(/^-\s+"?([^"]+)"?$/) || trimmed.match(/^-\s+(.+)$/)
      if (pathMatch) {
        const p = pathMatch[1].trim().replace(/^"/, '').replace(/"$/, '')
        if (currentSection === 'zero') rules.zeroAccessPaths.push(p)
        else if (currentSection === 'readonly') rules.readOnlyPaths.push(p)
        else if (currentSection === 'nodelete') rules.noDeletePaths.push(p)
      }
    }
  }
  // Flush last item
  if (currentItem.pattern && currentItem.reason) {
    rules.bashToolPatterns.push(currentItem as DamageRule)
  }

  return rules
}

function isPathMatch(targetPath: string, pattern: string, cwd: string): boolean {
  const resolvedPattern = pattern.startsWith('~')
    ? path.join(os.homedir(), pattern.slice(1))
    : pattern

  if (resolvedPattern.endsWith('/')) {
    const abs = path.isAbsolute(resolvedPattern)
      ? resolvedPattern
      : path.resolve(cwd, resolvedPattern)
    return targetPath.startsWith(abs)
  }

  const regexStr = resolvedPattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')

  const regex = new RegExp(`(^|/)${regexStr}($|/)`)
  const rel = path.relative(cwd, targetPath)
  return regex.test(targetPath) || regex.test(rel) || targetPath.includes(resolvedPattern)
}

// ── Extension ────────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  const state: PAIState = {
    mission: null,
    goals: new Map(),
    challenges: new Map(),
    learnings: [],
    ratings: [],
    innerLoop: null,
    iterationCount: 0,
    ralphIteration: 0,
    ralphActive: false,
  }

  let rules: DamageRules = {
    bashToolPatterns: [],
    zeroAccessPaths: [],
    readOnlyPaths: [],
    noDeletePaths: [],
  }

  let widgetCtx: ExtensionContext | null = null

  // ── Widget ───────────────────────────────────────────────────────────────

  function updateWidget() {
    if (!widgetCtx?.hasUI) return

    widgetCtx.ui.setWidget('pai-status', (_tui: any, theme: any) => ({
      render(width: number): string[] {
        const lines: string[] = []

        if (!state.mission) {
          lines.push(theme.fg('dim', '  π-PAI: /pai mission <statement> to begin'))
          return lines
        }

        const missionTrunc = state.mission.length > width - 20
          ? state.mission.slice(0, width - 23) + '...'
          : state.mission
        lines.push(theme.fg('accent', '  🎯 ') + theme.fg('success', missionTrunc))

        const goals = Array.from(state.goals.values())
        const active = goals.filter(g => g.status === 'active').length
        const blocked = goals.filter(g => g.status === 'blocked').length
        const completed = goals.filter(g => g.status === 'completed').length
        const avgRating = state.ratings.length > 0
          ? (state.ratings.reduce((s, r) => s + r.score, 0) / state.ratings.length).toFixed(1)
          : '—'

        if (goals.length > 0 || state.ratings.length > 0) {
          lines.push(
            theme.fg('dim', '  Goals: ') +
            theme.fg('success', `${active}⚡`) +
            theme.fg('dim', ' ') +
            theme.fg('warning', `${blocked}🚫`) +
            theme.fg('dim', ' ') +
            theme.fg('muted', `${completed}✓`) +
            theme.fg('dim', ' │ ') +
            theme.fg('accent', `${state.learnings.length} learnings`) +
            theme.fg('dim', ' │ ') +
            theme.fg('accent', `⭐${avgRating}`) +
            theme.fg('dim', ` (${state.ratings.length})`)
          )
        }

        if (state.innerLoop) {
          const phases: AlgorithmPhase[] = ['OBSERVE', 'THINK', 'PLAN', 'DEFINE', 'EXECUTE', 'MEASURE', 'LEARN']
          const idx = phases.indexOf(state.innerLoop.phase)
          const bar = phases.map((_, i) => {
            if (i < idx) return theme.fg('success', '●')
            if (i === idx) return theme.fg('accent', '◉')
            return theme.fg('dim', '○')
          }).join(' ')
          const elapsed = Math.round((Date.now() - state.innerLoop.startTime) / 1000)
          lines.push(
            theme.fg('dim', '  Loop: ') + bar +
            theme.fg('dim', ` [${state.innerLoop.phase}]`) +
            theme.fg('dim', ` ${state.innerLoop.effort}`) +
            theme.fg('dim', ` ${elapsed}s`)
          )
        }

        if (state.ralphActive) {
          lines.push(
            theme.fg('warning', `  🔄 Ralph #${state.ralphIteration}`) +
            theme.fg('dim', ' running...')
          )
        }

        return lines
      },
      invalidate() {},
    }))
  }

  // ── /pai command ─────────────────────────────────────────────────────────

  pi.registerCommand('pai', {
    description: 'PAI system: /pai mission|goal|done|challenge|learn|loop|next|isc|effort|status',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const parts = (args || '').trim().split(/\s+/)
      const subcmd = parts[0]?.toLowerCase()
      const rest = parts.slice(1).join(' ')

      switch (subcmd) {
        case 'mission': {
          if (!rest) { ctx.ui.notify('Usage: /pai mission <statement>', 'error'); return }
          state.mission = rest
          pi.appendEntry('pai-mission', { mission: rest, ts: new Date().toISOString() })
          ctx.ui.notify(`🎯 Mission: ${rest}`, 'success')
          updateWidget()
          break
        }

        case 'goal': {
          if (!rest) { ctx.ui.notify('Usage: /pai goal <title>', 'error'); return }
          const id = `g${state.goals.size}`
          const goal: Goal = { id, title: rest, status: 'active', priority: 'p1', isc: [] }
          state.goals.set(id, goal)
          pi.appendEntry('pai-goal', { ...goal, ts: new Date().toISOString() })
          ctx.ui.notify(`✅ Goal ${id}: ${rest}`, 'success')
          updateWidget()
          break
        }

        case 'done': {
          const gid = rest.trim()
          const goal = state.goals.get(gid)
          if (!goal) { ctx.ui.notify(`Goal "${gid}" not found`, 'error'); return }
          goal.status = 'completed'
          pi.appendEntry('pai-goal-done', { goalId: gid, ts: new Date().toISOString() })
          ctx.ui.notify(`🎉 Completed: ${goal.title}`, 'success')
          updateWidget()
          break
        }

        case 'challenge': {
          if (!rest) { ctx.ui.notify('Usage: /pai challenge <description>', 'error'); return }
          const cid = `c${state.challenges.size}`
          const ch: Challenge = { id: cid, title: rest, severity: 'medium', affectedGoals: [] }
          state.challenges.set(cid, ch)
          pi.appendEntry('pai-challenge', { ...ch, ts: new Date().toISOString() })
          ctx.ui.notify(`⚠️ Challenge ${cid}: ${rest}`, 'warning')
          updateWidget()
          break
        }

        case 'learn': {
          if (!rest) { ctx.ui.notify('Usage: /pai learn <insight>', 'error'); return }
          const l: Learning = { insight: rest, confidence: 0.8, category: 'domain', timestamp: new Date() }
          state.learnings.push(l)
          pi.appendEntry('pai-learning', { insight: rest, category: 'domain', ts: new Date().toISOString() })
          ctx.ui.notify(`📚 Learning: ${rest}`, 'success')
          updateWidget()
          break
        }

        case 'loop': {
          const loopGoal = rest || state.mission || 'unnamed'
          state.innerLoop = {
            phase: 'OBSERVE',
            goal: loopGoal,
            effort: 'standard',
            isc: [],
            data: {},
            startTime: Date.now(),
          }
          ctx.ui.notify(`🔄 Algorithm started: ${loopGoal} [OBSERVE]`, 'info')
          updateWidget()
          break
        }

        case 'effort': {
          if (!state.innerLoop) { ctx.ui.notify('No active loop', 'error'); return }
          const level = rest.toLowerCase() as EffortLevel
          const valid: EffortLevel[] = ['instant', 'fast', 'standard', 'extended', 'deep']
          if (!valid.includes(level)) {
            ctx.ui.notify(`Usage: /pai effort ${valid.join('|')}`, 'error')
            return
          }
          state.innerLoop.effort = level
          ctx.ui.notify(`⚡ Effort: ${level}`, 'info')
          updateWidget()
          break
        }

        case 'isc': {
          if (!state.innerLoop) { ctx.ui.notify('No active loop', 'error'); return }
          if (!rest) { ctx.ui.notify('Usage: /pai isc <8-12 word testable criterion>', 'error'); return }
          state.innerLoop.isc.push(rest)
          pi.appendEntry('pai-isc', { criterion: rest, phase: state.innerLoop.phase, ts: new Date().toISOString() })
          ctx.ui.notify(`📋 ISC-${state.innerLoop.isc.length}: ${rest}`, 'success')
          break
        }

        case 'next': {
          if (!state.innerLoop) { ctx.ui.notify('No active loop. /pai loop <goal>', 'error'); return }
          const phases: AlgorithmPhase[] = ['OBSERVE', 'THINK', 'PLAN', 'DEFINE', 'EXECUTE', 'MEASURE', 'LEARN']
          const idx = phases.indexOf(state.innerLoop.phase)
          if (rest) state.innerLoop.data[state.innerLoop.phase] = rest

          if (idx < phases.length - 1) {
            state.innerLoop.phase = phases[idx + 1]
            ctx.ui.notify(`→ ${state.innerLoop.phase}`, 'info')
          } else {
            state.iterationCount++
            const elapsed = Math.round((Date.now() - state.innerLoop.startTime) / 1000)
            pi.appendEntry('pai-loop-complete', {
              goal: state.innerLoop.goal,
              iteration: state.iterationCount,
              effort: state.innerLoop.effort,
              isc: state.innerLoop.isc,
              data: state.innerLoop.data,
              elapsed,
              ts: new Date().toISOString(),
            })
            ctx.ui.notify(`✅ Loop #${state.iterationCount} complete (${elapsed}s)`, 'success')
            state.innerLoop = null
          }
          updateWidget()
          break
        }

        case 'status': {
          const goals = Array.from(state.goals.values())
          const challenges = Array.from(state.challenges.values())
          const avgRating = state.ratings.length > 0
            ? (state.ratings.reduce((s, r) => s + r.score, 0) / state.ratings.length).toFixed(1)
            : 'none'

          let report = `# PAI Status\n\n`
          report += `**Mission:** ${state.mission || 'Not set'}\n`
          report += `**Iterations:** ${state.iterationCount} | **Avg Rating:** ${avgRating} (${state.ratings.length} signals)\n\n`

          report += `## Goals (${goals.length})\n`
          goals.forEach(g => {
            const icon = g.status === 'completed' ? '✅' : g.status === 'blocked' ? '🚫' : '🎯'
            report += `- ${icon} **${g.id}** ${g.title} (${g.status}, ${g.priority})\n`
            if (g.isc?.length) g.isc.forEach(c => { report += `  - ISC: ${c}\n` })
          })

          report += `\n## Challenges (${challenges.length})\n`
          challenges.forEach(c => { report += `- ⚠️ **${c.id}** ${c.title} (${c.severity})\n` })

          report += `\n## Recent Learnings\n`
          state.learnings.slice(-5).forEach(l => {
            report += `- 📚 [${l.category}] ${l.insight}${l.fromRating ? ` (from ⭐${l.fromRating})` : ''}\n`
          })

          if (state.innerLoop) {
            report += `\n## Active Loop\n`
            report += `**Phase:** ${state.innerLoop.phase} | **Effort:** ${state.innerLoop.effort} | **Goal:** ${state.innerLoop.goal}\n`
            if (state.innerLoop.isc.length) {
              report += `**ISC:**\n`
              state.innerLoop.isc.forEach((c, i) => { report += `- ISC-${i + 1}: ${c}\n` })
            }
          }

          report += `\n## Damage Control\n`
          report += `${rules.bashToolPatterns.length} bash patterns | ${rules.zeroAccessPaths.length} zero-access | ${rules.readOnlyPaths.length} read-only | ${rules.noDeletePaths.length} no-delete\n`

          pi.sendMessage({ content: report, display: true }, { deliverAs: 'followUp', triggerTurn: false })
          break
        }

        default:
          ctx.ui.notify('/pai mission|goal|done|challenge|learn|loop|next|isc|effort|status', 'info')
      }
    },
  })

  // ── /rate command (Miessler's rating capture) ────────────────────────────

  pi.registerCommand('rate', {
    description: 'Rate last output 1-10: /rate <score> [context]',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const parts = (args || '').trim().split(/\s+/)
      const score = parseInt(parts[0], 10)
      const context = parts.slice(1).join(' ') || ''

      if (isNaN(score) || score < 1 || score > 10) {
        ctx.ui.notify('Usage: /rate <1-10> [context]', 'error')
        return
      }

      const rating: Rating = { score: score as SignalRating, context, timestamp: new Date() }
      state.ratings.push(rating)
      pi.appendEntry('pai-rating', { score, context, ts: new Date().toISOString() })

      if (score <= 3) {
        const learning: Learning = {
          insight: `Low rating (${score}): ${context || 'output quality below expectations'}`,
          confidence: 0.9,
          category: 'algorithm',
          timestamp: new Date(),
          fromRating: score,
        }
        state.learnings.push(learning)
        pi.appendEntry('pai-learning', { ...learning, ts: new Date().toISOString() })
        ctx.ui.notify(`⭐${score} — Learning captured from low rating`, 'warning')
      } else if (score >= 8) {
        ctx.ui.notify(`⭐${score} — Excellent!`, 'success')
      } else {
        ctx.ui.notify(`⭐${score}`, 'info')
      }
      updateWidget()
    },
  })

  // ── /ralph command ───────────────────────────────────────────────────────

  pi.registerCommand('ralph', {
    description: 'Ralph Wiggum iteration: /ralph <task> or /ralph stop',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const task = (args || '').trim()

      if (task.toLowerCase() === 'stop') {
        state.ralphActive = false
        ctx.ui.notify(`🛑 Ralph stopped after ${state.ralphIteration} iterations`, 'warning')
        updateWidget()
        return
      }

      if (!task) { ctx.ui.notify('Usage: /ralph <task> or /ralph stop', 'error'); return }

      state.ralphActive = true
      state.ralphIteration = 0
      ctx.ui.notify(`🔄 Ralph starting: ${task}`, 'info')
      updateWidget()

      pi.sendMessage({
        content: `[Ralph Wiggum Iteration #${++state.ralphIteration}]\n\nTask: ${task}\n\nExecute this task. When done, say "RALPH_DONE". If not done, describe what remains.`,
        display: true,
      }, { deliverAs: 'followUp', triggerTurn: true })
    },
  })

  pi.on('message_end', async (event, ctx) => {
    if (!state.ralphActive) return
    if (state.ralphIteration >= 50) {
      state.ralphActive = false
      ctx.ui.notify(`🛑 Ralph hit 50 iterations`, 'warning')
      updateWidget()
      return
    }

    const text = (event as any)?.text || ''
    if (text.includes('RALPH_DONE')) {
      state.ralphActive = false
      ctx.ui.notify(`✅ Ralph done in ${state.ralphIteration} iterations`, 'success')
      updateWidget()
      return
    }

    pi.sendMessage({
      content: `[Ralph #${++state.ralphIteration}] Continue. Review git history for context. Say "RALPH_DONE" when finished.`,
      display: true,
    }, { deliverAs: 'followUp', triggerTurn: true })
    updateWidget()
  })

  // ── Tools ────────────────────────────────────────────────────────────────

  pi.registerTool({
    name: 'pai_status',
    description: 'Get PAI system status: mission, goals, challenges, learnings, loop phase, ratings.',
    parameters: Type.Object({}),
    execute: async () => ({
      content: [{
        type: 'text',
        text: JSON.stringify({
          mission: state.mission,
          goals: Array.from(state.goals.values()),
          challenges: Array.from(state.challenges.values()),
          learnings: state.learnings.slice(-10).map(l => ({ insight: l.insight, category: l.category })),
          innerLoop: state.innerLoop ? { phase: state.innerLoop.phase, effort: state.innerLoop.effort, goal: state.innerLoop.goal, isc: state.innerLoop.isc } : null,
          iterations: state.iterationCount,
          avgRating: state.ratings.length ? +(state.ratings.reduce((s, r) => s + r.score, 0) / state.ratings.length).toFixed(1) : null,
          ratingCount: state.ratings.length,
        }, null, 2),
      }],
    }),
  })

  pi.registerTool({
    name: 'pai_learn',
    description: 'Record a learning/insight into PAI for future reference.',
    parameters: Type.Object({
      insight: Type.String({ description: 'The learning or insight' }),
      category: Type.Optional(Type.String({ description: 'algorithm|system|domain|process' })),
      confidence: Type.Optional(Type.Number({ description: '0-1, default 0.8' })),
    }),
    execute: async (_callId, args) => {
      const l: Learning = {
        insight: args.insight,
        confidence: args.confidence ?? 0.8,
        category: (args.category as Learning['category']) || 'domain',
        timestamp: new Date(),
      }
      state.learnings.push(l)
      pi.appendEntry('pai-learning', { ...l, ts: new Date().toISOString() })
      updateWidget()
      return { content: [{ type: 'text', text: `Learning [${l.category}]: ${args.insight}` }] }
    },
  })

  pi.registerTool({
    name: 'pai_rate',
    description: 'Rate the quality of the last output (1-10). Low ratings auto-capture learnings.',
    parameters: Type.Object({
      score: Type.Number({ description: 'Rating 1-10' }),
      context: Type.Optional(Type.String({ description: 'Why this rating' })),
    }),
    execute: async (_callId, args) => {
      const score = Math.max(1, Math.min(10, Math.round(args.score))) as SignalRating
      const rating: Rating = { score, context: args.context || '', timestamp: new Date() }
      state.ratings.push(rating)
      pi.appendEntry('pai-rating', { score, context: args.context, ts: new Date().toISOString() })

      if (score <= 3) {
        const l: Learning = {
          insight: `Low rating (${score}): ${args.context || 'below expectations'}`,
          confidence: 0.9, category: 'algorithm', timestamp: new Date(), fromRating: score,
        }
        state.learnings.push(l)
        pi.appendEntry('pai-learning', { ...l, ts: new Date().toISOString() })
      }
      updateWidget()
      return { content: [{ type: 'text', text: `Rated ⭐${score}${args.context ? ': ' + args.context : ''}` }] }
    },
  })

  // ── Damage Control — tool_call interception ──────────────────────────────

  pi.on('tool_call', async (event, ctx) => {
    const { isToolCallEventType } = await import('@mariozechner/pi-coding-agent')

    // Bash patterns
    if (isToolCallEventType('bash', event)) {
      const command = event.input.command || ''

      for (const rule of rules.bashToolPatterns) {
        try {
          const regex = new RegExp(rule.pattern)
          if (regex.test(command)) {
            if (rule.ask) {
              const ok = await ctx.ui.confirm('🛡️ PAI Damage Control',
                `${rule.reason}\n\nCommand: ${command}\n\nAllow?`, { timeout: 30000 })
              if (!ok) {
                pi.appendEntry('pai-dc-blocked', { command, reason: rule.reason, action: 'user_denied' })
                ctx.abort()
                return { block: true, reason: `🛑 PAI: ${rule.reason}. DO NOT retry or work around.` }
              }
              return { block: false }
            }
            pi.appendEntry('pai-dc-blocked', { command, reason: rule.reason, action: 'auto' })
            ctx.ui.notify(`🛡️ Blocked: ${rule.reason}`, 'error')
            ctx.abort()
            return { block: true, reason: `🛑 PAI: ${rule.reason}. DO NOT retry or work around.` }
          }
        } catch {}
      }

      // Zero-access in bash commands
      for (const zap of rules.zeroAccessPaths) {
        const clean = zap.replace('~/', '').replace(/^\*/, '')
        if (clean && command.includes(clean)) {
          pi.appendEntry('pai-dc-blocked', { command, reason: `zero-access: ${zap}`, action: 'auto' })
          ctx.abort()
          return { block: true, reason: `🛑 PAI: zero-access path ${zap}. DO NOT retry.` }
        }
      }
    }

    // File tool path checks
    if (isToolCallEventType('read', event) || isToolCallEventType('write', event) || isToolCallEventType('edit', event)) {
      const filePath = event.input.path || ''
      const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(ctx.cwd, filePath)

      for (const zap of rules.zeroAccessPaths) {
        if (isPathMatch(resolved, zap, ctx.cwd)) {
          pi.appendEntry('pai-dc-blocked', { path: filePath, reason: `zero-access: ${zap}`, action: 'auto' })
          ctx.ui.notify(`🛡️ Blocked: ${zap}`, 'error')
          ctx.abort()
          return { block: true, reason: `🛑 PAI: zero-access ${zap}. DO NOT retry.` }
        }
      }

      // Read-only check for write/edit
      if (isToolCallEventType('write', event) || isToolCallEventType('edit', event)) {
        for (const rop of rules.readOnlyPaths) {
          if (isPathMatch(resolved, rop, ctx.cwd)) {
            pi.appendEntry('pai-dc-blocked', { path: filePath, reason: `read-only: ${rop}`, action: 'auto' })
            ctx.abort()
            return { block: true, reason: `🛑 PAI: read-only path ${rop}. DO NOT modify.` }
          }
        }
      }
    }

    return { block: false }
  })

  // ── Session lifecycle ────────────────────────────────────────────────────

  pi.on('session_start', async (_event, ctx) => {
    widgetCtx = ctx
    rules = loadDamageRules(ctx.cwd)
    const ruleCount = rules.bashToolPatterns.length + rules.zeroAccessPaths.length +
      rules.readOnlyPaths.length + rules.noDeletePaths.length
    updateWidget()

    if (ruleCount > 0) {
      ctx.ui.notify(`🧠 π-PAI v3 | ${ruleCount} damage-control rules | /pai /ralph /rate`, 'info')
    } else {
      ctx.ui.notify('🧠 π-PAI v3 | /pai /ralph /rate', 'info')
    }
  })
}
