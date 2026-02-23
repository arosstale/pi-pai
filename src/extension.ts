/**
 * pi-pai — Personal AI Infrastructure Extension for Pi
 *
 * A real Pi extension implementing:
 * - /pai command with TELOS goal tracking, inner/outer loops
 * - /ralph command for simple iteration loops
 * - Damage control via tool_call interception
 * - Status widget showing mission, goals, and learning metrics
 *
 * Usage: pi -e path/to/pi-pai/src/extension.ts
 */

import type { ExtensionAPI, ExtensionContext } from '@mariozechner/pi-coding-agent'
import { Type } from '@sinclair/typebox'

// ── State ────────────────────────────────────────────────────────────────────

interface Goal {
  id: string
  title: string
  status: 'active' | 'blocked' | 'completed' | 'paused'
  priority: 'p0' | 'p1' | 'p2' | 'p3'
  blockedBy?: string[]
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
  timestamp: Date
}

interface InnerLoopState {
  phase: 'OBSERVE' | 'THINK' | 'PLAN' | 'DEFINE' | 'EXECUTE' | 'MEASURE' | 'LEARN'
  goal: string
  data: Record<string, string>
}

interface PAIState {
  mission: string | null
  goals: Map<string, Goal>
  challenges: Map<string, Challenge>
  learnings: Learning[]
  innerLoop: InnerLoopState | null
  iterationCount: number
  signalCount: number
}

// ── Damage Control Patterns ──────────────────────────────────────────────────

const DANGEROUS_PATTERNS: Array<{ pattern: RegExp; reason: string; ask?: boolean }> = [
  { pattern: /\brm\s+(-[^\s]*)*-[rRf]/,       reason: 'rm with recursive/force flags' },
  { pattern: /\bgit\s+reset\s+--hard\b/,       reason: 'git reset --hard' },
  { pattern: /\bgit\s+clean\s+(-[^\s]*)*-[fd]/,reason: 'git clean with force/directory' },
  { pattern: /\bgit\s+push\s+.*--force(?!-with-lease)/, reason: 'git push --force (use --force-with-lease)' },
  { pattern: /\bDROP\s+(TABLE|DATABASE)\b/i,    reason: 'DROP TABLE/DATABASE' },
  { pattern: /\bTRUNCATE\s+TABLE\b/i,           reason: 'TRUNCATE TABLE' },
  { pattern: /DELETE\s+FROM\s+\w+\s*;/i,        reason: 'DELETE without WHERE clause' },
  { pattern: /\bmkfs\./,                         reason: 'filesystem format command' },
  { pattern: /\bdd\s+.*of=\/dev\//,             reason: 'dd writing to device' },
  { pattern: /\bchmod\s+(-[^\s]+\s+)*777\b/,    reason: 'chmod 777 (world writable)' },
  { pattern: /\bgit\s+stash\s+clear\b/,         reason: 'git stash clear' },
  { pattern: /\bgit\s+push\s+\S+\s+--delete\b/, reason: 'deletes remote branch', ask: true },
  { pattern: /\bgit\s+checkout\s+--\s*\./,       reason: 'discards all uncommitted changes', ask: true },
  { pattern: /\bgit\s+branch\s+(-[^\s]*)*-D/,   reason: 'force deletes branch', ask: true },
]

const ZERO_ACCESS_PATHS = [
  '.env', '.env.local', '.env.production', '~/.ssh/', '~/.aws/',
  '~/.gnupg/', '*.pem', '*.key', '*.p12', '*.tfstate',
]

// ── Extension ────────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  const state: PAIState = {
    mission: null,
    goals: new Map(),
    challenges: new Map(),
    learnings: [],
    innerLoop: null,
    iterationCount: 0,
    signalCount: 0,
  }

  let widgetCtx: ExtensionContext | null = null

  // ── Widget ───────────────────────────────────────────────────────────────

  function updateWidget() {
    if (!widgetCtx?.hasUI) return

    widgetCtx.ui.setWidget('pai-status', (_tui: any, theme: any) => ({
      render(width: number): string[] {
        const lines: string[] = []

        if (!state.mission) {
          lines.push(theme.fg('dim', '  π-PAI: No mission set. Use /pai mission <statement>'))
          return lines
        }

        // Mission line
        const missionTrunc = state.mission.length > width - 20
          ? state.mission.slice(0, width - 23) + '...'
          : state.mission
        lines.push(
          theme.fg('accent', '  🎯 ') +
          theme.fg('success', missionTrunc)
        )

        // Goals summary
        const goals = Array.from(state.goals.values())
        const active = goals.filter(g => g.status === 'active').length
        const blocked = goals.filter(g => g.status === 'blocked').length
        const completed = goals.filter(g => g.status === 'completed').length

        if (goals.length > 0) {
          lines.push(
            theme.fg('dim', '  Goals: ') +
            theme.fg('success', `${active} active`) +
            theme.fg('dim', ' · ') +
            theme.fg('warning', `${blocked} blocked`) +
            theme.fg('dim', ' · ') +
            theme.fg('muted', `${completed} done`) +
            theme.fg('dim', ' · ') +
            theme.fg('accent', `${state.learnings.length} learnings`)
          )
        }

        // Inner loop phase
        if (state.innerLoop) {
          const phases = ['OBSERVE', 'THINK', 'PLAN', 'DEFINE', 'EXECUTE', 'MEASURE', 'LEARN']
          const idx = phases.indexOf(state.innerLoop.phase)
          const bar = phases.map((p, i) => {
            if (i < idx) return theme.fg('success', '●')
            if (i === idx) return theme.fg('accent', '◉')
            return theme.fg('dim', '○')
          }).join(' ')
          lines.push(
            theme.fg('dim', '  Loop: ') + bar +
            theme.fg('dim', ` [${state.innerLoop.phase}]`)
          )
        }

        return lines
      },
      invalidate() {},
    }))
  }

  // ── /pai command ─────────────────────────────────────────────────────────

  pi.registerCommand('pai', {
    description: 'PAI system: /pai mission|goal|challenge|learn|loop|status',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const parts = (args || '').trim().split(/\s+/)
      const subcmd = parts[0]?.toLowerCase()
      const rest = parts.slice(1).join(' ')

      switch (subcmd) {
        case 'mission': {
          if (!rest) {
            ctx.ui.notify('Usage: /pai mission <statement>', 'error')
            return
          }
          state.mission = rest
          pi.appendEntry('pai-mission', { mission: rest, timestamp: new Date().toISOString() })
          ctx.ui.notify(`🎯 Mission set: ${rest}`, 'success')
          updateWidget()
          break
        }

        case 'goal': {
          if (!rest) {
            ctx.ui.notify('Usage: /pai goal <title>', 'error')
            return
          }
          const id = `g${state.goals.size}`
          const goal: Goal = { id, title: rest, status: 'active', priority: 'p1' }
          state.goals.set(id, goal)
          pi.appendEntry('pai-goal', { ...goal, timestamp: new Date().toISOString() })
          ctx.ui.notify(`✅ Goal ${id}: ${rest}`, 'success')
          updateWidget()
          break
        }

        case 'done': {
          const goalId = rest.trim()
          const goal = state.goals.get(goalId)
          if (!goal) {
            ctx.ui.notify(`Goal "${goalId}" not found`, 'error')
            return
          }
          goal.status = 'completed'
          pi.appendEntry('pai-goal-done', { goalId, timestamp: new Date().toISOString() })
          ctx.ui.notify(`🎉 Goal ${goalId} completed: ${goal.title}`, 'success')
          updateWidget()
          break
        }

        case 'challenge': {
          if (!rest) {
            ctx.ui.notify('Usage: /pai challenge <description>', 'error')
            return
          }
          const cid = `c${state.challenges.size}`
          const challenge: Challenge = { id: cid, title: rest, severity: 'medium', affectedGoals: [] }
          state.challenges.set(cid, challenge)
          pi.appendEntry('pai-challenge', { ...challenge, timestamp: new Date().toISOString() })
          ctx.ui.notify(`⚠️ Challenge ${cid}: ${rest}`, 'warning')
          updateWidget()
          break
        }

        case 'learn': {
          if (!rest) {
            ctx.ui.notify('Usage: /pai learn <insight>', 'error')
            return
          }
          const learning: Learning = { insight: rest, confidence: 0.8, timestamp: new Date() }
          state.learnings.push(learning)
          pi.appendEntry('pai-learning', { insight: rest, timestamp: new Date().toISOString() })
          ctx.ui.notify(`📚 Learning captured: ${rest}`, 'success')
          updateWidget()
          break
        }

        case 'loop': {
          const loopGoal = rest || state.mission || 'unnamed goal'
          state.innerLoop = { phase: 'OBSERVE', goal: loopGoal, data: {} }
          ctx.ui.notify(`🔄 Inner loop started for: ${loopGoal}`, 'info')
          updateWidget()
          break
        }

        case 'next': {
          if (!state.innerLoop) {
            ctx.ui.notify('No active inner loop. Use /pai loop <goal>', 'error')
            return
          }
          const phases: InnerLoopState['phase'][] = ['OBSERVE', 'THINK', 'PLAN', 'DEFINE', 'EXECUTE', 'MEASURE', 'LEARN']
          const idx = phases.indexOf(state.innerLoop.phase)
          if (rest) {
            state.innerLoop.data[state.innerLoop.phase] = rest
          }
          if (idx < phases.length - 1) {
            state.innerLoop.phase = phases[idx + 1]
            ctx.ui.notify(`→ Phase: ${state.innerLoop.phase}`, 'info')
          } else {
            state.iterationCount++
            pi.appendEntry('pai-loop-complete', {
              goal: state.innerLoop.goal,
              iteration: state.iterationCount,
              data: state.innerLoop.data,
              timestamp: new Date().toISOString(),
            })
            ctx.ui.notify(`✅ Loop complete! Iteration #${state.iterationCount}`, 'success')
            state.innerLoop = null
          }
          updateWidget()
          break
        }

        case 'status': {
          const goals = Array.from(state.goals.values())
          const challenges = Array.from(state.challenges.values())
          let report = '# PAI Status\n\n'
          report += `**Mission:** ${state.mission || 'Not set'}\n\n`
          report += `**Goals (${goals.length}):**\n`
          goals.forEach(g => {
            const icon = g.status === 'completed' ? '✅' : g.status === 'blocked' ? '🚫' : '🎯'
            report += `- ${icon} [${g.id}] ${g.title} (${g.status}, ${g.priority})\n`
          })
          report += `\n**Challenges (${challenges.length}):**\n`
          challenges.forEach(c => {
            report += `- ⚠️ [${c.id}] ${c.title} (${c.severity})\n`
          })
          report += `\n**Learnings (${state.learnings.length}):**\n`
          state.learnings.slice(-5).forEach(l => {
            report += `- 📚 ${l.insight}\n`
          })
          report += `\n**Iterations:** ${state.iterationCount}\n`
          if (state.innerLoop) {
            report += `**Active Loop:** ${state.innerLoop.phase} → ${state.innerLoop.goal}\n`
          }

          pi.sendMessage({ content: report, display: true }, { deliverAs: 'followUp', triggerTurn: false })
          break
        }

        default: {
          ctx.ui.notify(
            'Usage: /pai mission|goal|done|challenge|learn|loop|next|status',
            'info'
          )
        }
      }
    },
  })

  // ── /ralph command ───────────────────────────────────────────────────────

  let ralphActive = false
  let ralphIteration = 0

  pi.registerCommand('ralph', {
    description: 'Ralph Wiggum iteration: /ralph <task> or /ralph stop',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const task = (args || '').trim()

      if (task.toLowerCase() === 'stop') {
        ralphActive = false
        ctx.ui.notify(`🛑 Ralph stopped after ${ralphIteration} iterations`, 'warning')
        return
      }

      if (!task) {
        ctx.ui.notify('Usage: /ralph <task> or /ralph stop', 'error')
        return
      }

      ralphActive = true
      ralphIteration = 0
      ctx.ui.notify(`🔄 Ralph starting: ${task}`, 'info')

      // Send the task as a prompt to the agent
      pi.sendMessage(
        {
          content: `[Ralph Wiggum Iteration #${++ralphIteration}]\n\nTask: ${task}\n\nExecute this task. When you believe you are done, say "RALPH_DONE" in your response. If not done, describe what remains.`,
          display: true,
        },
        { deliverAs: 'followUp', triggerTurn: true }
      )
    },
  })

  // Ralph auto-continue on message_end
  pi.on('message_end', async (event, ctx) => {
    if (!ralphActive) return
    if (ralphIteration >= 50) {
      ralphActive = false
      ctx.ui.notify(`🛑 Ralph hit max iterations (50)`, 'warning')
      return
    }

    // Check if agent said RALPH_DONE
    const lastText = (event as any)?.text || ''
    if (lastText.includes('RALPH_DONE')) {
      ralphActive = false
      ctx.ui.notify(`✅ Ralph completed after ${ralphIteration} iterations`, 'success')
      return
    }

    // Continue iteration
    pi.sendMessage(
      {
        content: `[Ralph Wiggum Iteration #${++ralphIteration}]\n\nContinue the task. Review your previous output and git history for context. If done, say "RALPH_DONE". If not, keep going.`,
        display: true,
      },
      { deliverAs: 'followUp', triggerTurn: true }
    )
  })

  // ── PAI Tool — let the agent use PAI programmatically ────────────────────

  pi.registerTool({
    name: 'pai_status',
    description: 'Get the current PAI system status including mission, goals, challenges, learnings, and inner loop phase.',
    parameters: Type.Object({}),
    execute: async () => {
      const goals = Array.from(state.goals.values())
      const challenges = Array.from(state.challenges.values())
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            mission: state.mission,
            goals: goals.map(g => ({ id: g.id, title: g.title, status: g.status, priority: g.priority })),
            challenges: challenges.map(c => ({ id: c.id, title: c.title, severity: c.severity })),
            learnings: state.learnings.slice(-10).map(l => l.insight),
            innerLoop: state.innerLoop ? { phase: state.innerLoop.phase, goal: state.innerLoop.goal } : null,
            iterations: state.iterationCount,
          }, null, 2),
        }],
      }
    },
  })

  pi.registerTool({
    name: 'pai_learn',
    description: 'Record a learning/insight into the PAI system for future reference.',
    parameters: Type.Object({
      insight: Type.String({ description: 'The learning or insight to record' }),
      confidence: Type.Optional(Type.Number({ description: 'Confidence level 0-1, default 0.8' })),
    }),
    execute: async (_callId, args) => {
      const learning: Learning = {
        insight: args.insight,
        confidence: args.confidence ?? 0.8,
        timestamp: new Date(),
      }
      state.learnings.push(learning)
      pi.appendEntry('pai-learning', { insight: args.insight, timestamp: new Date().toISOString() })
      updateWidget()
      return {
        content: [{ type: 'text', text: `Learning recorded: ${args.insight}` }],
      }
    },
  })

  // ── Damage Control — tool_call interception ──────────────────────────────

  pi.on('tool_call', async (event, ctx) => {
    const { isToolCallEventType } = await import('@mariozechner/pi-coding-agent')

    if (isToolCallEventType('bash', event)) {
      const command = event.input.command || ''

      for (const rule of DANGEROUS_PATTERNS) {
        if (rule.pattern.test(command)) {
          if (rule.ask) {
            const confirmed = await ctx.ui.confirm(
              '🛡️ PAI Damage Control',
              `Dangerous: ${rule.reason}\nCommand: ${command}\n\nAllow?`,
              { timeout: 30000 }
            )
            if (!confirmed) {
              state.signalCount++
              pi.appendEntry('pai-damage-blocked', { command, reason: rule.reason, action: 'user_denied' })
              ctx.abort()
              return { block: true, reason: `🛑 PAI blocked: ${rule.reason}. DO NOT retry or work around this.` }
            }
            return { block: false }
          }

          state.signalCount++
          pi.appendEntry('pai-damage-blocked', { command, reason: rule.reason, action: 'auto_blocked' })
          ctx.ui.notify(`🛡️ PAI blocked: ${rule.reason}`, 'error')
          ctx.abort()
          return { block: true, reason: `🛑 PAI blocked: ${rule.reason}. DO NOT retry or work around this.` }
        }
      }

      // Check zero-access paths in commands
      for (const zap of ZERO_ACCESS_PATHS) {
        if (command.includes(zap.replace('~/', ''))) {
          state.signalCount++
          ctx.ui.notify(`🛡️ PAI blocked access to: ${zap}`, 'error')
          ctx.abort()
          return { block: true, reason: `🛑 PAI blocked: zero-access path ${zap}. DO NOT retry.` }
        }
      }
    }

    // Check file tools for zero-access paths
    if (isToolCallEventType('read', event) || isToolCallEventType('write', event) || isToolCallEventType('edit', event)) {
      const filePath = event.input.path || ''
      for (const zap of ZERO_ACCESS_PATHS) {
        const cleanZap = zap.replace('~/', '').replace('*', '')
        if (filePath.includes(cleanZap) || filePath.endsWith('.pem') || filePath.endsWith('.key')) {
          state.signalCount++
          ctx.ui.notify(`🛡️ PAI blocked file access: ${filePath}`, 'error')
          ctx.abort()
          return { block: true, reason: `🛑 PAI blocked: sensitive path ${filePath}. DO NOT retry.` }
        }
      }
    }

    return { block: false }
  })

  // ── Session lifecycle ────────────────────────────────────────────────────

  pi.on('session_start', async (_event, ctx) => {
    widgetCtx = ctx
    updateWidget()
    ctx.ui.notify('🧠 π-PAI loaded: /pai, /ralph, damage-control active', 'info')
  })
}
