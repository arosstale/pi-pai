/**
 * π-PAI v4.2 — Personal AI Infrastructure Extension for Pi
 *
 * Synced with Miessler's PAI v4.0.3 algorithm:
 * - Algorithm: OBSERVE → PLAN → DECIDE → EXECUTE → VERIFY (v4 loop)
 * - ISC decomposition: splitting test, count gates, anti-criteria
 * - 5 effort levels with ISC minimums: Standard(8)/Extended(16)/Advanced(24)/Deep(40)/Comprehensive(64)
 * - Time budgets per effort level with auto-compress at 150%
 * - Capability selection + invocation tracking
 * - Ratings + sentiment tracking with trend analysis
 * - Agent persona dispatch (architect, pentester, designer, etc.)
 * - Plans directory convention (.pi/plans/)
 * - Self-evolution trigger (learning pattern detection)
 * - Enhanced observability: PaiSplittingTest, PaiIscGate, PaiCapability, PaiEffortCompress events
 *
 * Also includes:
 * - Ralph Wiggum deterministic iteration engine
 * - Damage control (YAML-based path/command guards)
 * - Templates (trading, saas, devops, research, agent)
 *
 * v4.2: Full v4.0.3 sync — 7 features:
 *       1. ISC splitting test (atomicity validation)
 *       2. ISC count gate (effort-level minimums)
 *       3. Anti-criteria (/pai isca)
 *       4. Capability selection (/pai capabilities)
 *       5. Capability invocation tracking (tool_call counting)
 *       6. Time budgets with auto-compress warning
 *       7. Enhanced observability events for dashboard
 */

import type { ExtensionAPI, ExtensionContext } from '@mariozechner/pi-coding-agent'
import { Type } from '@sinclair/typebox'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import YAML from 'js-yaml'

// ── Observability Bridge ─────────────────────────────────────────────────────
// Writes events to ~/.claude/history/raw-outputs/ in the same format as
// Claude Code's universal_hook_logger.py — so the PAI dashboard at :5172
// shows Pi sessions alongside Claude Code sessions.

let observeSessionId = `pi-pai-${Date.now().toString(36)}`

function emitObserveEvent(hookType: string, payload: Record<string, unknown>) {
  try {
    const now = new Date()
    const dir = path.join(os.homedir(), '.claude', 'history', 'raw-outputs', `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const file = path.join(dir, `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_all-events.jsonl`)
    const entry = {
      source_app: 'pi-pai',
      session_id: observeSessionId,
      hook_event_type: hookType,
      payload: { session_id: observeSessionId, hook_event_name: hookType, ...payload },
      timestamp: Date.now(),
    }
    fs.appendFileSync(file, JSON.stringify(entry) + '\n')
  } catch { /* non-blocking */ }
}

// ── Types ────────────────────────────────────────────────────────────────────

type AlgorithmPhase = 'OBSERVE' | 'PLAN' | 'DECIDE' | 'EXECUTE' | 'VERIFY'
type EffortLevel = 'standard' | 'extended' | 'advanced' | 'deep' | 'comprehensive'
type GoalStatus = 'active' | 'blocked' | 'completed' | 'paused'
type Sentiment = 'positive' | 'neutral' | 'negative'

// ── v4.0.3: ISC Count Minimums & Min Capabilities (Feature #2, #4) ───────────
const ISC_MINIMUMS: Record<EffortLevel, number> = {
  standard: 8, extended: 16, advanced: 24, deep: 40, comprehensive: 64,
}

// ── v4.0.3: Time Budgets in minutes (Feature #6) ────────────────────────────
const TIME_BUDGETS_MIN: Record<EffortLevel, number> = {
  standard: 2, extended: 8, advanced: 16, deep: 32, comprehensive: 120,
}
const TIME_COMPRESS_FACTOR = 1.5 // auto-compress warning at 150% of budget

// ── v4.0.3: ISC Splitting Test (Feature #1) ─────────────────────────────────
// Returns warnings for non-atomic ISC criteria
function splittingTest(criterion: string): string[] {
  const warnings: string[] = []
  // "And" / "With" test
  if (/\b(and|with|including|plus)\b/i.test(criterion)) {
    warnings.push(`Contains "${criterion.match(/\b(and|with|including|plus)\b/i)?.[0]}" — likely two criteria. Split them.`)
  }
  // Scope word test
  if (/\b(all|every|complete|full|each)\b/i.test(criterion)) {
    warnings.push(`Contains "${criterion.match(/\b(all|every|complete|full|each)\b/i)?.[0]}" — enumerate what this means specifically.`)
  }
  // Length test — atomic ISC should be 8-12 words
  const words = criterion.trim().split(/\s+/).length
  if (words > 15) warnings.push(`${words} words — too long for atomic ISC (target 8-12). Split or simplify.`)
  if (words < 4) warnings.push(`${words} words — too vague. Be specific and testable.`)
  // Domain boundary test
  const domains = [/\bUI\b|display|render|visible|button|page/i, /\bAPI\b|endpoint|request|response|status/i, /\bdata|database|schema|field|column/i, /\blogic|flow|condition|branch|validate/i]
  const crossedDomains = domains.filter(d => d.test(criterion))
  if (crossedDomains.length > 1) warnings.push('Crosses multiple domains (UI/API/data/logic) — split per domain boundary.')
  return warnings
}

interface Goal { id: string; title: string; status: GoalStatus; priority: string; isc?: string[] }
interface Challenge { id: string; title: string; severity: string; affectedGoals: string[] }
interface Learning { insight: string; confidence: number; category: string; timestamp: Date; fromRating?: number; sentiment?: Sentiment }
interface Rating { score: number; context: string; timestamp: Date; sentiment: Sentiment }

// v4.0.3: Anti-criteria (Feature #3)
interface AntiCriterion { id: string; description: string; severity: 'critical' | 'high' | 'medium' }

// v4.0.3: Capability tracking (Features #4, #5)
interface Capability { name: string; type: 'tool' | 'skill'; minRequired?: number; invocations: number }

interface InnerLoopState {
  phase: AlgorithmPhase
  goal: string
  effort: EffortLevel
  isc: string[]
  iscA: AntiCriterion[] // v4.0.3: anti-criteria
  capabilities: Map<string, Capability> // v4.0.3: selected capabilities
  data: Record<string, string>
  startTime: number
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

// ── Agent Personas (Steal #2 from Miessler's PAI) ────────────────────────────

interface AgentPersona { name: string; role: string; systemPrompt: string }

const AGENT_PERSONAS: Record<string, AgentPersona> = {
  architect: {
    name: 'Architect',
    role: 'System design and architecture decisions',
    systemPrompt: 'You are a senior system architect. Focus on: scalability, separation of concerns, API design, data flow, and failure modes. Propose 2-3 options with tradeoffs. Be opinionated — recommend the best option. Reference established patterns (hexagonal, event-driven, CQRS) when relevant.',
  },
  engineer: {
    name: 'Engineer',
    role: 'Implementation and code quality',
    systemPrompt: 'You are a senior software engineer. Write production-quality code: proper error handling, types, tests, and documentation. Follow the codebase conventions. No shortcuts — if something needs a test, write the test.',
  },
  pentester: {
    name: 'Pentester',
    role: 'Security review and vulnerability assessment',
    systemPrompt: 'You are a penetration tester and security researcher. Review code for: injection attacks (SQL, command, prompt), auth bypass, SSRF, path traversal, insecure deserialization, secrets in code, and dependency vulnerabilities. Report findings with severity (Critical/High/Medium/Low), exploit scenario, and remediation.',
  },
  designer: {
    name: 'Designer',
    role: 'UX/UI design and user experience',
    systemPrompt: 'You are a senior product designer. Focus on: information architecture, visual hierarchy, accessibility (WCAG 2.1 AA), responsive design, and interaction patterns. Propose designs with rationale. Consider edge cases: empty states, error states, loading states, overflow.',
  },
  reviewer: {
    name: 'Code Reviewer',
    role: 'Code review and quality gates',
    systemPrompt: 'You are a meticulous code reviewer. Check: correctness, edge cases, error handling, naming, complexity, test coverage, and performance. Categorize findings as P1 (must fix), P2 (should fix), P3 (nit). Be direct — if code is wrong, say so.',
  },
  researcher: {
    name: 'Researcher',
    role: 'Deep investigation and analysis',
    systemPrompt: 'You are a thorough researcher. Investigate topics systematically: define the question, gather evidence, analyze findings, synthesize conclusions. Cite sources. Flag uncertainty. Separate facts from opinions.',
  },
  qa: {
    name: 'QA Tester',
    role: 'Quality assurance and test planning',
    systemPrompt: 'You are a QA engineer. Think adversarially: what can go wrong? Create test plans covering: happy paths, edge cases, error paths, boundary values, concurrency, and regression. Write concrete test cases with expected results.',
  },
}

// ── Damage Control Types ─────────────────────────────────────────────────────

interface DamageRule { pattern: string; reason: string; ask?: boolean }
interface DamageRules { bashToolPatterns: DamageRule[]; zeroAccessPaths: string[]; readOnlyPaths: string[]; noDeletePaths: string[] }
const EMPTY_RULES: DamageRules = { bashToolPatterns: [], zeroAccessPaths: [], readOnlyPaths: [], noDeletePaths: [] }

function loadDamageRules(cwd: string): DamageRules {
  const candidates = [
    path.join(cwd, '.pi', 'damage-control-rules.yaml'),
    path.join(cwd, 'damage-control-rules.yaml'),
    path.join(__dirname, '..', 'damage-control-rules.yaml'),
  ]
  for (const f of candidates) {
    try {
      if (!fs.existsSync(f)) continue
      const raw = YAML.load(fs.readFileSync(f, 'utf8')) as Partial<DamageRules>
      return { bashToolPatterns: raw.bashToolPatterns || [], zeroAccessPaths: raw.zeroAccessPaths || [], readOnlyPaths: raw.readOnlyPaths || [], noDeletePaths: raw.noDeletePaths || [] }
    } catch { /* skip bad files */ }
  }
  return EMPTY_RULES
}

function isPathMatch(target: string, pattern: string, cwd: string): boolean {
  const expanded = pattern.startsWith('~') ? path.join(os.homedir(), pattern.slice(1)) : pattern
  const norm = path.normalize(expanded).replace(/\\/g, '/')
  const abs = path.normalize(path.isAbsolute(target) ? target : path.resolve(cwd, target)).replace(/\\/g, '/')
  if (norm.endsWith('/')) return abs.startsWith(norm) || abs.startsWith(norm.slice(0, -1))
  if (norm.includes('*')) {
    const re = new RegExp('^' + norm.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$')
    return re.test(path.basename(abs)) || re.test(abs)
  }
  return path.basename(abs) === norm || abs.endsWith('/' + norm)
}

// ── Templates ────────────────────────────────────────────────────────────────

interface Template { mission: string; goals: string[]; challenges: string[] }

function loadTemplates(): Record<string, Template> {
  const ext = path.join(__dirname, '..', 'templates.json')
  try { if (fs.existsSync(ext)) return JSON.parse(fs.readFileSync(ext, 'utf8')) } catch { /* fall through */ }
  return {
    trading: { mission: 'Build a profitable algorithmic trading system', goals: ['Develop and backtest core strategy', 'Achieve >55% win rate on paper trades', 'Deploy live with risk management', 'Maintain Sharpe ratio >1.5'], challenges: ['Overfitting risk on historical data', 'Execution latency in live markets'] },
    saas: { mission: 'Launch a production SaaS product', goals: ['Ship MVP with auth, billing, and core feature', 'Acquire first 10 paying users', 'Achieve <2s p95 page load', 'Set up CI/CD and monitoring'], challenges: ['Scope creep', 'Premature optimization'] },
    devops: { mission: 'Build reliable infrastructure and deployment pipeline', goals: ['Automate deployments with zero downtime', 'Set up monitoring and alerting', 'Achieve 99.9% uptime SLA', 'Document runbooks for on-call'], challenges: ['Alert fatigue', 'Configuration drift'] },
    research: { mission: 'Complete deep research project with actionable findings', goals: ['Define research questions and scope', 'Collect and analyze primary sources', 'Synthesize findings into report', 'Present recommendations'], challenges: ['Source reliability', 'Scope management'] },
    agent: { mission: 'Build and ship a production AI agent', goals: ['Define agent capabilities and constraints', 'Implement tool use and error handling', 'Test with adversarial inputs', 'Deploy with monitoring and kill switch'], challenges: ['Prompt injection risk', 'Cost control', 'Hallucination detection'] },
  }
}

// ── Sentiment Analysis (Steal #3) ────────────────────────────────────────────

function inferSentiment(score: number, context: string): Sentiment {
  if (score >= 7) return 'positive'
  if (score <= 3) return 'negative'
  const neg = /bad|broken|wrong|fail|slow|bug|crash|awful|terrible|worse|hate|frustrat/i
  const pos = /great|fast|clean|nice|perfect|love|excellent|smooth|solid/i
  if (neg.test(context)) return 'negative'
  if (pos.test(context)) return 'positive'
  return 'neutral'
}

function ratingTrend(ratings: Rating[], window: number = 5): { trend: 'improving' | 'declining' | 'stable'; avg: number; recent: number } {
  const avg = ratings.length ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length : 0
  const recent = ratings.slice(-window)
  const recentAvg = recent.length ? recent.reduce((s, r) => s + r.score, 0) / recent.length : 0
  const delta = recentAvg - avg
  return { trend: delta > 0.5 ? 'improving' : delta < -0.5 ? 'declining' : 'stable', avg: +avg.toFixed(1), recent: +recentAvg.toFixed(1) }
}

// ── v4.0.3: ISC Splitting Test (Feature #1) ─────────────────────────────────
// Validates that each ISC is truly atomic — no compound criteria hiding behind
// "and", "with", scope words, or domain boundary violations.

const SPLIT_CONJUNCTIONS = /\b(and|as well as|along with|in addition to|plus|also|while|whilst)\b/i
const SPLIT_SCOPE_WORDS = /\b(all|every|each|any|both|multiple|various|several)\b/i
const SPLIT_DOMAIN_MARKERS = /\b(frontend and backend|client and server|ui and api|read and write|create and delete|input and output)\b/i

interface SplitTestResult { pass: boolean; reason?: string; suggestion?: string }

function iscSplittingTest(criterion: string): SplitTestResult {
  // Check for conjunctions (compound criteria)
  const conjMatch = criterion.match(SPLIT_CONJUNCTIONS)
  if (conjMatch) {
    const parts = criterion.split(SPLIT_CONJUNCTIONS).filter(p => p.trim() && !SPLIT_CONJUNCTIONS.test(p))
    return {
      pass: false,
      reason: `Compound criterion — "${conjMatch[0]}" joins multiple conditions`,
      suggestion: parts.length >= 2
        ? `Split into:\n  1. ${parts[0].trim()}\n  2. ${parts[1].trim()}`
        : `Remove "${conjMatch[0]}" and create separate ISCs for each condition`,
    }
  }

  // Check for scope words (too broad)
  const scopeMatch = criterion.match(SPLIT_SCOPE_WORDS)
  if (scopeMatch) {
    return {
      pass: false,
      reason: `Scope word "${scopeMatch[0]}" — criterion may cover multiple items`,
      suggestion: `Be specific: which exact item(s)? Replace "${scopeMatch[0]}" with a concrete target`,
    }
  }

  // Check for domain boundary violations
  const domainMatch = criterion.match(SPLIT_DOMAIN_MARKERS)
  if (domainMatch) {
    return {
      pass: false,
      reason: `Cross-domain criterion — "${domainMatch[0]}" spans boundaries`,
      suggestion: `Split into separate ISCs per domain`,
    }
  }

  // Check word count (8-12 is ideal for ISC)
  const words = criterion.trim().split(/\s+/).length
  if (words > 20) {
    return { pass: false, reason: `Too long (${words} words) — likely compound`, suggestion: 'Shorten to 8-12 words or split into multiple ISCs' }
  }
  if (words < 4) {
    return { pass: false, reason: `Too short (${words} words) — likely not testable`, suggestion: 'Add specifics: what exactly should be verified?' }
  }

  return { pass: true }
}

// ── Self-Evolution Trigger (Steal #4) ────────────────────────────────────────

function detectRepeatingPatterns(learnings: Learning[]): string[] {
  const counts = new Map<string, number>()
  for (const l of learnings) {
    // Normalize: lowercase, strip punctuation, take first 6 words
    const key = l.insight.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).slice(0, 6).join(' ')
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return Array.from(counts.entries()).filter(([_, c]) => c >= 3).map(([k]) => k)
}

// ── Plans Directory (Steal #5) ───────────────────────────────────────────────

function ensurePlansDir(cwd: string): string {
  const plansDir = path.join(cwd, '.pi', 'plans')
  if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir, { recursive: true })
  return plansDir
}

function listPlans(cwd: string): string[] {
  const dir = path.join(cwd, '.pi', 'plans')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().reverse()
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function persist(pi: ExtensionAPI, key: string, data: Record<string, unknown>) {
  pi.appendEntry(key, { ...data, ts: new Date().toISOString() })
}

// ── Extension ────────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  const state: PAIState = {
    mission: null, goals: new Map(), challenges: new Map(),
    learnings: [], ratings: [], innerLoop: null,
    iterationCount: 0, ralphIteration: 0, ralphActive: false,
  }
  let rules: DamageRules = EMPTY_RULES
  let widgetCtx: ExtensionContext | null = null
  // v4.0.3 algorithm: OBSERVE → PLAN → DECIDE → EXECUTE → VERIFY
  const PHASES: AlgorithmPhase[] = ['OBSERVE', 'PLAN', 'DECIDE', 'EXECUTE', 'VERIFY']
  const EFFORTS: EffortLevel[] = ['standard', 'extended', 'advanced', 'deep', 'comprehensive']

  function notify(msg: string, type: 'error' | 'warning' | 'info' = 'info') {
    widgetCtx?.ui.notify(msg, type)
  }

  // ── Widget ─────────────────────────────────────────────────────────────

  function updateWidget() {
    if (!widgetCtx?.hasUI) return
    widgetCtx.ui.setWidget('pai-status', (_tui: any, theme: any) => ({
      render(width: number): string[] {
        const lines: string[] = []
        if (!state.mission) {
          lines.push(theme.fg('dim', '  π-PAI v4: /pai mission <statement> to begin'))
          return lines
        }

        const raw = state.mission ?? ''
        const m = raw.length > width - 20 ? raw.slice(0, width - 23) + '...' : raw
        lines.push(theme.fg('accent', '  🎯 ') + theme.fg('success', m))

        const goals = Array.from(state.goals.values())
        const a = goals.filter(g => g.status === 'active').length
        const b = goals.filter(g => g.status === 'blocked').length
        const c = goals.filter(g => g.status === 'completed').length
        const { trend, avg, recent } = ratingTrend(state.ratings)
        const trendIcon = trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'

        if (goals.length || state.ratings.length) {
          lines.push(
            theme.fg('dim', '  Goals: ') + theme.fg('success', `${a}⚡`) + ' ' +
            theme.fg('warning', `${b}🚫`) + ' ' + theme.fg('muted', `${c}✓`) +
            theme.fg('dim', ' │ ') + theme.fg('accent', `${state.learnings.length} learnings`) +
            theme.fg('dim', ' │ ⭐') + theme.fg('accent', `${avg}`) +
            theme.fg('dim', ` ${trendIcon}${recent} (${state.ratings.length})`)
          )
        }

        if (state.innerLoop) {
          const idx = PHASES.indexOf(state.innerLoop.phase)
          const bar = PHASES.map((_, i) => i < idx ? theme.fg('success', '●') : i === idx ? theme.fg('accent', '◉') : theme.fg('dim', '○')).join(' ')
          const elapsed = Math.round((Date.now() - state.innerLoop.startTime) / 1000)
          const min = ISC_MINIMUMS[state.innerLoop.effort]
          const iscProgress = `${state.innerLoop.isc.length}/${min}`
          const budget = TIME_BUDGETS_MIN[state.innerLoop.effort]
          const elapsedMin = Math.round(elapsed / 60)
          const timeColor = elapsedMin > budget * TIME_COMPRESS_FACTOR ? 'error' : elapsedMin > budget ? 'warning' : 'dim'
          lines.push(
            theme.fg('dim', '  Loop: ') + bar +
            theme.fg('dim', ` [${state.innerLoop.phase}] ${state.innerLoop.effort}`) +
            theme.fg('dim', ' │ ISC:') + theme.fg(state.innerLoop.isc.length >= min ? 'success' : 'warning', iscProgress) +
            (state.innerLoop.iscA.length ? theme.fg('dim', ' A:') + theme.fg('accent', `${state.innerLoop.iscA.length}`) : '') +
            theme.fg('dim', ' │ ') + theme.fg(timeColor, `${elapsedMin}/${budget}min`)
          )
        }

        if (state.ralphActive) lines.push(theme.fg('warning', `  🔄 Ralph #${state.ralphIteration}`) + theme.fg('dim', ' running...'))

        // Self-evolution warning
        const patterns = detectRepeatingPatterns(state.learnings)
        if (patterns.length) lines.push(theme.fg('warning', `  ⚠️ ${patterns.length} repeating pattern(s) — consider /pai evolve`))

        return lines
      },
      invalidate() {},
    }))
  }

  // ── /pai subcommand dispatch table ─────────────────────────────────────

  const paiCommands: Record<string, (rest: string, ctx: ExtensionContext) => void> = {
    mission(rest) {
      if (!rest) { notify('Usage: /pai mission <statement>', 'error'); return }
      state.mission = rest
      persist(pi, 'pai-mission', { mission: rest })
      emitObserveEvent('PaiMission', { mission: rest })
      notify(`🎯 Mission: ${rest}`, 'info')
      updateWidget()
    },

    goal(rest) {
      if (!rest) { notify('Usage: /pai goal <title>', 'error'); return }
      const id = `g${state.goals.size}`
      state.goals.set(id, { id, title: rest, status: 'active', priority: 'p1', isc: [] })
      persist(pi, 'pai-goal', { id, title: rest, status: 'active' })
      emitObserveEvent('PaiGoal', { goal_id: id, title: rest, status: 'active' })
      notify(`✅ Goal ${id}: ${rest}`, 'info')
      updateWidget()
    },

    done(rest) {
      const goal = state.goals.get(rest.trim())
      if (!goal) { notify(`Goal "${rest.trim()}" not found`, 'error'); return }
      goal.status = 'completed'
      persist(pi, 'pai-goal-done', { goalId: rest.trim() })
      notify(`🎉 Completed: ${goal.title}`, 'info')
      updateWidget()
    },

    block(rest) {
      const goal = state.goals.get(rest.trim())
      if (!goal) { notify(`Goal "${rest.trim()}" not found`, 'error'); return }
      goal.status = 'blocked'
      persist(pi, 'pai-goal-blocked', { goalId: rest.trim() })
      notify(`🚫 Blocked: ${goal.title}`, 'warning')
      updateWidget()
    },

    challenge(rest) {
      if (!rest) { notify('Usage: /pai challenge <description>', 'error'); return }
      const id = `c${state.challenges.size}`
      state.challenges.set(id, { id, title: rest, severity: 'medium', affectedGoals: [] })
      persist(pi, 'pai-challenge', { id, title: rest })
      notify(`⚠️ Challenge ${id}: ${rest}`, 'warning')
      updateWidget()
    },

    learn(rest) {
      if (!rest) { notify('Usage: /pai learn <insight>', 'error'); return }
      const sentiment = inferSentiment(5, rest)
      state.learnings.push({ insight: rest, confidence: 0.8, category: 'domain', timestamp: new Date(), sentiment })
      persist(pi, 'pai-learning', { insight: rest, category: 'domain', sentiment })
      emitObserveEvent('PaiLearning', { insight: rest, category: 'domain', sentiment })
      notify(`📚 Learning: ${rest}`, 'info')

      // Self-evolution trigger: check for repeating patterns
      const patterns = detectRepeatingPatterns(state.learnings)
      if (patterns.length) notify(`⚠️ ${patterns.length} pattern(s) repeating 3+ times — run /pai evolve to address`, 'warning')

      updateWidget()
    },

    loop(rest) {
      const goal = rest || state.mission || 'unnamed'
      state.innerLoop = { phase: 'OBSERVE', goal, effort: 'standard', isc: [], iscA: [], capabilities: new Map(), data: {}, startTime: Date.now() }
      emitObserveEvent('PaiAlgorithmStart', { goal, phase: 'OBSERVE', effort: 'standard' })
      notify(`🔄 Algorithm started: ${goal} [OBSERVE]`, 'info')
      updateWidget()
    },

    effort(rest) {
      if (!state.innerLoop) { notify('No active loop', 'error'); return }
      const level = rest.toLowerCase() as EffortLevel
      if (!EFFORTS.includes(level)) { notify(`Usage: /pai effort ${EFFORTS.join('|')}`, 'error'); return }
      state.innerLoop.effort = level
      notify(`⚡ Effort: ${level}`, 'info')
      updateWidget()
    },

    isc(rest) {
      if (!state.innerLoop) { notify('No active loop', 'error'); return }
      if (!rest) { notify('Usage: /pai isc <8-12 word testable criterion>', 'error'); return }

      // v4.0.3 Feature #1: Splitting test
      const test = iscSplittingTest(rest)
      if (!test.pass) {
        emitObserveEvent('PaiSplittingTest', { criterion: rest, pass: false, reason: test.reason })
        notify(`❌ ISC failed splitting test: ${test.reason}`, 'warning')
        if (test.suggestion) notify(`💡 ${test.suggestion}`, 'info')
        return
      }

      state.innerLoop.isc.push(rest)
      persist(pi, 'pai-isc', { criterion: rest, phase: state.innerLoop.phase })
      emitObserveEvent('PaiSplittingTest', { criterion: rest, pass: true })
      notify(`📋 ISC-${state.innerLoop.isc.length}/${ISC_MINIMUMS[state.innerLoop.effort]}: ${rest}`, 'info')
      updateWidget()
    },

    // v4.0.3 Feature #3: Anti-criteria
    isca(rest) {
      if (!state.innerLoop) { notify('No active loop', 'error'); return }
      if (!rest) { notify('Usage: /pai isca <what must NOT happen>', 'error'); return }
      const severity = /critical|security|data.?loss|crash/i.test(rest) ? 'critical' as const : /error|fail|break/i.test(rest) ? 'high' as const : 'medium' as const
      const ac: AntiCriterion = { id: `a${state.innerLoop.iscA.length}`, description: rest, severity }
      state.innerLoop.iscA.push(ac)
      persist(pi, 'pai-isc-anti', { anti: rest, severity })
      emitObserveEvent('PaiIscGate', { type: 'anti', criterion: rest, severity })
      notify(`🚫 ISC-A${state.innerLoop.iscA.length} [${severity}]: ${rest}`, 'info')
      updateWidget()
    },

    // v4.0.3 Feature #4: Capability selection
    capabilities(rest) {
      if (!state.innerLoop) { notify('No active loop', 'error'); return }
      if (!rest) {
        // List current capabilities
        if (!state.innerLoop.capabilities.size) { notify('No capabilities selected. /pai capabilities add <tool|skill> <name> [min]', 'info'); return }
        const caps = Array.from(state.innerLoop.capabilities.values())
        const list = caps.map(c => `  ${c.type}:${c.name} — ${c.invocations}/${c.minRequired ?? '∞'} invocations`).join('\n')
        pi.sendMessage({ customType: 'pai-capabilities', content: `# Selected Capabilities\n\n${list}`, display: true, details: undefined }, { triggerTurn: false })
        return
      }
      const parts = rest.split(/\s+/)
      if (parts[0] === 'add' && parts.length >= 3) {
        const type = parts[1] as 'tool' | 'skill'
        const name = parts[2]
        const min = parts[3] ? parseInt(parts[3], 10) : undefined
        if (type !== 'tool' && type !== 'skill') { notify('Type must be "tool" or "skill"', 'error'); return }
        state.innerLoop.capabilities.set(name, { name, type, minRequired: min, invocations: 0 })
        emitObserveEvent('PaiCapability', { action: 'add', name, type, minRequired: min })
        notify(`🔧 Capability: ${type}:${name}${min ? ` (min ${min})` : ''}`, 'info')
        return
      }
      notify('Usage: /pai capabilities add <tool|skill> <name> [min]', 'error')
    },

    next(rest) {
      if (!state.innerLoop) { notify('No active loop. /pai loop <goal>', 'error'); return }
      if (rest) state.innerLoop.data[state.innerLoop.phase] = rest
      const idx = PHASES.indexOf(state.innerLoop.phase)

      // v4.0.3 Feature #2: ISC count gate before EXECUTE phase
      if (state.innerLoop.phase === 'DECIDE') {
        const min = ISC_MINIMUMS[state.innerLoop.effort]
        const count = state.innerLoop.isc.length
        if (count < min) {
          emitObserveEvent('PaiIscGate', { type: 'count', count, minimum: min, effort: state.innerLoop.effort, pass: false })
          notify(`❌ ISC gate: ${count}/${min} criteria (${state.innerLoop.effort} requires ${min}). Add more with /pai isc`, 'error')
          return
        }
        emitObserveEvent('PaiIscGate', { type: 'count', count, minimum: min, effort: state.innerLoop.effort, pass: true })
      }

      // v4.0.3 Feature #5: Capability invocation check before VERIFY
      if (state.innerLoop.phase === 'EXECUTE' && state.innerLoop.capabilities.size > 0) {
        const unmet: string[] = []
        const capEntries = Array.from(state.innerLoop.capabilities.entries())
        for (let ci = 0; ci < capEntries.length; ci++) {
          const [name, cap] = capEntries[ci]
          if (cap.minRequired && cap.invocations < cap.minRequired) {
            unmet.push(`${cap.type}:${name} (${cap.invocations}/${cap.minRequired})`)
          }
        }
        if (unmet.length) {
          notify(`⚠️ Unmet capabilities: ${unmet.join(', ')}`, 'warning')
        }
      }

      if (idx < PHASES.length - 1) {
        state.innerLoop.phase = PHASES[idx + 1]
        emitObserveEvent('PaiPhaseTransition', { phase: state.innerLoop.phase, goal: state.innerLoop.goal, effort: state.innerLoop.effort })
        notify(`→ ${state.innerLoop.phase}`, 'info')

        // v4.0.3 Feature #6: Time budget check
        const elapsedMin = (Date.now() - state.innerLoop.startTime) / 60000
        const budget = TIME_BUDGETS_MIN[state.innerLoop.effort]
        if (elapsedMin > budget * TIME_COMPRESS_FACTOR) {
          emitObserveEvent('PaiEffortCompress', { elapsed: +elapsedMin.toFixed(1), budget, effort: state.innerLoop.effort })
          notify(`⏰ Over time budget (${Math.round(elapsedMin)}min / ${budget}min) — compressing scope`, 'warning')
        } else if (elapsedMin > budget) {
          notify(`⏰ At time budget (${Math.round(elapsedMin)}min / ${budget}min)`, 'info')
        }
      } else {
        state.iterationCount++
        const elapsed = Math.round((Date.now() - state.innerLoop.startTime) / 1000)

        // v4.0.3 Feature #5: Final capability report
        const capReport = state.innerLoop.capabilities.size > 0
          ? Array.from(state.innerLoop.capabilities.values()).map(c => `${c.type}:${c.name}=${c.invocations}`).join(', ')
          : 'none'

        persist(pi, 'pai-loop-complete', {
          goal: state.innerLoop.goal, iteration: state.iterationCount,
          effort: state.innerLoop.effort, isc: state.innerLoop.isc,
          iscA: state.innerLoop.iscA.map(a => a.description),
          capabilities: capReport,
          data: state.innerLoop.data, elapsed,
        })
        emitObserveEvent('PaiLoopComplete', {
          goal: state.innerLoop.goal, iteration: state.iterationCount,
          effort: state.innerLoop.effort, elapsed,
          isc_count: state.innerLoop.isc.length,
          isc_anti_count: state.innerLoop.iscA.length,
          capabilities: capReport,
        })
        notify(`✅ Loop #${state.iterationCount} complete (${elapsed}s) | ${state.innerLoop.isc.length} ISC, ${state.innerLoop.iscA.length} anti`, 'info')
        state.innerLoop = null
      }
      updateWidget()
    },

    template(rest) {
      const templates = loadTemplates()
      const name = rest.trim().toLowerCase()
      if (!name || !templates[name]) { notify(`Templates: ${Object.keys(templates).join(', ')}`, 'info'); return }
      const t = templates[name]
      state.mission = t.mission
      persist(pi, 'pai-mission', { mission: t.mission, template: name })
      for (const title of t.goals) {
        const id = `g${state.goals.size}`
        state.goals.set(id, { id, title, status: 'active', priority: 'p1', isc: [] })
        persist(pi, 'pai-goal', { id, title, status: 'active' })
      }
      for (const title of t.challenges) {
        const id = `c${state.challenges.size}`
        state.challenges.set(id, { id, title, severity: 'medium', affectedGoals: [] })
        persist(pi, 'pai-challenge', { id, title })
      }
      notify(`📋 Template "${name}": ${t.goals.length} goals, ${t.challenges.length} challenges`, 'info')
      updateWidget()
    },

    // Steal #2: Agent Personas
    agent(rest) {
      const name = rest.trim().toLowerCase()
      if (!name || !AGENT_PERSONAS[name]) {
        const list = Object.entries(AGENT_PERSONAS).map(([k, v]) => `  ${k}: ${v.role}`).join('\n')
        pi.sendMessage({ customType: 'pai-agents', content: `# Available Agent Personas\n\n${list}\n\nUsage: /pai agent <name> <task>`, display: true, details: undefined }, { triggerTurn: false })
        return
      }
      const taskStart = rest.indexOf(' ')
      const task = taskStart > 0 ? rest.slice(taskStart + 1).trim() : ''
      if (!task) { notify(`Usage: /pai agent ${name} <task description>`, 'error'); return }
      const persona = AGENT_PERSONAS[name]
      pi.sendMessage({
        customType: 'pai-agent-dispatch',
        content: `# ${persona.name} Mode\n\n**System:** ${persona.systemPrompt}\n\n**Task:** ${task}`,
        display: true,
        details: undefined,
      }, { triggerTurn: true })
      notify(`🎭 ${persona.name}: ${task.slice(0, 60)}...`, 'info')
    },

    // Steal #5: Plans directory
    plans(rest, ctx) {
      const plans = listPlans(ctx.cwd)
      if (!plans.length) {
        notify('No plans in .pi/plans/ — use brainstorm skill to create one', 'info')
        return
      }
      const list = plans.map(p => `- ${p}`).join('\n')
      pi.sendMessage({ customType: 'pai-plans', content: `# Plans\n\n${list}\n\nPlans dir: .pi/plans/`, display: true, details: undefined }, { triggerTurn: false })
    },

    // Steal #4: Self-evolution
    evolve() {
      const patterns = detectRepeatingPatterns(state.learnings)
      if (!patterns.length) { notify('No repeating patterns detected yet', 'info'); return }

      const report = patterns.map((p, i) => `${i + 1}. "${p}" (3+ occurrences)`).join('\n')
      const sentimentDist = { positive: 0, neutral: 0, negative: 0 }
      for (const l of state.learnings) sentimentDist[l.sentiment || 'neutral']++

      pi.sendMessage({
        customType: 'pai-evolve',
        content: `# Evolution Trigger Report\n\n## Repeating Learning Patterns\n${report}\n\n## Sentiment Distribution\n- Positive: ${sentimentDist.positive}\n- Neutral: ${sentimentDist.neutral}\n- Negative: ${sentimentDist.negative}\n\n## Recommended Actions\nThese patterns indicate recurring issues. Consider:\n1. **Run /gepa** on related skills to evolve them\n2. **Create a new skill** to address the pattern\n3. **Update AGENTS.md** with the learning\n\nUse \`pi-gepa\` extension for automated skill evolution.`,
        display: true,
        details: undefined,
      }, { triggerTurn: false })
    },

    // Steal #3: Detailed trend report
    trend() {
      if (!state.ratings.length) { notify('No ratings yet — use /rate <1-10> after tasks', 'info'); return }

      const { trend, avg, recent } = ratingTrend(state.ratings)
      const sentimentDist = { positive: 0, neutral: 0, negative: 0 }
      for (const r of state.ratings) sentimentDist[r.sentiment]++

      const recentRatings = state.ratings.slice(-10).map(r => {
        const icon = r.sentiment === 'positive' ? '😊' : r.sentiment === 'negative' ? '😞' : '😐'
        return `- ⭐${r.score} ${icon} ${r.context || '(no context)'}`
      }).join('\n')

      pi.sendMessage({
        customType: 'pai-trend',
        content: `# Rating Trend\n\n**Overall:** ⭐${avg} (${state.ratings.length} ratings)\n**Recent (last 5):** ⭐${recent} ${trend === 'improving' ? '📈 Improving' : trend === 'declining' ? '📉 Declining' : '➡️ Stable'}\n\n## Sentiment\n- 😊 Positive: ${sentimentDist.positive}\n- 😐 Neutral: ${sentimentDist.neutral}\n- 😞 Negative: ${sentimentDist.negative}\n\n## Recent Ratings\n${recentRatings}`,
        display: true,
        details: undefined,
      }, { triggerTurn: false })
    },

    reset() {
      state.mission = null; state.goals.clear(); state.challenges.clear()
      state.learnings = []; state.ratings = []; state.innerLoop = null
      state.iterationCount = 0; state.ralphIteration = 0; state.ralphActive = false
      persist(pi, 'pai-reset', {})
      notify('🗑️ PAI state reset', 'warning')
      updateWidget()
    },

    status(_rest, ctx) {
      const goals = Array.from(state.goals.values())
      const challenges = Array.from(state.challenges.values())
      const { trend, avg, recent } = ratingTrend(state.ratings)
      const trendIcon = trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'
      const patterns = detectRepeatingPatterns(state.learnings)
      const plans = listPlans(ctx.cwd)

      let r = `# PAI Status (v4.2 — full v4.0.3 sync: splitting test, count gate, anti-criteria, capabilities, time budgets)\n\n`
      r += `**Mission:** ${state.mission || 'Not set'}\n`
      r += `**Iterations:** ${state.iterationCount} | **Rating:** ⭐${avg} ${trendIcon}${recent} (${state.ratings.length} signals)\n`
      if (patterns.length) r += `**⚠️ Repeating patterns:** ${patterns.length} — run /pai evolve\n`
      r += '\n'

      r += `## Goals (${goals.length})\n`
      for (const g of goals) {
        const icon = g.status === 'completed' ? '✅' : g.status === 'blocked' ? '🚫' : '🎯'
        r += `- ${icon} **${g.id}** ${g.title} (${g.status})\n`
      }

      r += `\n## Challenges (${challenges.length})\n`
      for (const c of challenges) r += `- ⚠️ **${c.id}** ${c.title}\n`

      r += `\n## Recent Learnings\n`
      for (const l of state.learnings.slice(-5)) {
        const sIcon = l.sentiment === 'positive' ? '😊' : l.sentiment === 'negative' ? '😞' : '📚'
        r += `- ${sIcon} [${l.category}] ${l.insight}${l.fromRating ? ` (⭐${l.fromRating})` : ''}\n`
      }

      if (state.innerLoop) {
        const min = ISC_MINIMUMS[state.innerLoop.effort]
        const budget = TIME_BUDGETS_MIN[state.innerLoop.effort]
        const elapsedMin = Math.round((Date.now() - state.innerLoop.startTime) / 60000)
        r += `\n## Active Loop (v4.0.3 Algorithm)\n`
        r += `**Phase:** ${state.innerLoop.phase} | **Effort:** ${state.innerLoop.effort} | **Goal:** ${state.innerLoop.goal}\n`
        r += `**ISC:** ${state.innerLoop.isc.length}/${min} | **Anti:** ${state.innerLoop.iscA.length} | **Time:** ${elapsedMin}/${budget}min\n`
        r += `**Phases:** OBSERVE → PLAN → DECIDE → EXECUTE → VERIFY\n`
        for (let ii = 0; ii < state.innerLoop.isc.length; ii++) r += `- ISC-${ii + 1}: ${state.innerLoop.isc[ii]}\n`
        if (state.innerLoop.iscA.length) {
          r += `\n**Anti-Criteria (must NOT happen):**\n`
          for (const ac of state.innerLoop.iscA) r += `- 🚫 [${ac.severity}] ${ac.description}\n`
        }
        if (state.innerLoop.capabilities.size) {
          r += `\n**Capabilities:**\n`
          const statusCaps = Array.from(state.innerLoop.capabilities.values())
          for (let ci = 0; ci < statusCaps.length; ci++) {
            const cap = statusCaps[ci]
            r += `- 🔧 ${cap.type}:${cap.name} — ${cap.invocations}/${cap.minRequired ?? '∞'}\n`
          }
        }
      }

      r += `\n## Agent Personas\n${Object.entries(AGENT_PERSONAS).map(([k, v]) => `- **${k}**: ${v.role}`).join('\n')}\n`

      if (plans.length) r += `\n## Plans (.pi/plans/)\n${plans.slice(0, 5).map(p => `- ${p}`).join('\n')}\n`

      r += `\n## Damage Control\n${rules.bashToolPatterns.length} bash | ${rules.zeroAccessPaths.length} zero-access | ${rules.readOnlyPaths.length} read-only | ${rules.noDeletePaths.length} no-delete\n`

      pi.sendMessage({ customType: 'pai-status', content: r, display: true, details: undefined }, { triggerTurn: false })
    },
  }

  // ── /pai command ───────────────────────────────────────────────────────

  pi.registerCommand('pai', {
    description: 'PAI v4.2: /pai mission|goal|done|block|challenge|learn|loop|next|isc|isca|effort|capabilities|template|agent|plans|trend|evolve|sessions|replay|reset|status',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      ensurePlansDir(ctx.cwd)
      const parts = (args || '').trim().split(/\s+/)
      const sub = parts[0]?.toLowerCase()
      const rest = parts.slice(1).join(' ')
      const fn = paiCommands[sub]
      if (fn) fn(rest, ctx)
      else notify(`/pai ${Object.keys(paiCommands).join('|')}`, 'info')
    },
  })

  // ── /rate (enhanced with sentiment) ────────────────────────────────────

  pi.registerCommand('rate', {
    description: 'Rate last output 1-10 with sentiment: /rate <score> [context]',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const parts = (args || '').trim().split(/\s+/)
      const score = parseInt(parts[0], 10)
      const context = parts.slice(1).join(' ')

      if (isNaN(score) || score < 1 || score > 10) { notify('Usage: /rate <1-10> [context]', 'error'); return }

      const sentiment = inferSentiment(score, context)
      state.ratings.push({ score, context, timestamp: new Date(), sentiment })
      persist(pi, 'pai-rating', { score, context, sentiment })
      emitObserveEvent('PaiRating', { score, context, sentiment })

      if (score <= 3) {
        const l: Learning = { insight: `Low rating (${score}): ${context || 'below expectations'}`, confidence: 0.9, category: 'algorithm', timestamp: new Date(), fromRating: score, sentiment: 'negative' }
        state.learnings.push(l)
        persist(pi, 'pai-learning', { insight: l.insight, category: 'algorithm', fromRating: score, sentiment: 'negative' })
        notify(`⭐${score} 😞 — Learning captured`, 'warning')
      } else {
        const sIcon = sentiment === 'positive' ? '😊' : '😐'
        notify(`⭐${score} ${sIcon}${score >= 8 ? ' — Excellent!' : ''}`, 'info')
      }
      updateWidget()
    },
  })

  // ── /ralph ─────────────────────────────────────────────────────────────

  pi.registerCommand('ralph', {
    description: 'Ralph Wiggum iteration: /ralph <task> or /ralph stop',
    handler: async (args, ctx) => {
      widgetCtx = ctx
      const task = (args || '').trim()
      if (task.toLowerCase() === 'stop') {
        state.ralphActive = false
        notify(`🛑 Ralph stopped after ${state.ralphIteration} iterations`, 'warning')
        updateWidget()
        return
      }
      if (!task) { notify('Usage: /ralph <task> or /ralph stop', 'error'); return }
      state.ralphActive = true
      state.ralphIteration = 0
      notify(`🔄 Ralph starting: ${task}`, 'info')
      updateWidget()
      pi.sendMessage({ customType: 'pai-ralph', content: `[Ralph #${++state.ralphIteration}]\n\nTask: ${task}\n\nExecute this task. Say "RALPH_DONE" when finished.`, display: true, details: undefined }, { triggerTurn: true })
    },
  })

  pi.on('message_end', async (event) => {
    if (!state.ralphActive) return
    if (state.ralphIteration >= 50) { state.ralphActive = false; notify('🛑 Ralph: 50 limit', 'warning'); updateWidget(); return }
    const text = typeof event === 'object' && event !== null && 'text' in event ? String((event as Record<string, unknown>).text) : ''
    if (text.includes('RALPH_DONE')) { state.ralphActive = false; notify(`✅ Ralph done in ${state.ralphIteration}`, 'info'); updateWidget(); return }
    pi.sendMessage({ customType: 'pai-ralph', content: `[Ralph #${++state.ralphIteration}] Continue. Say "RALPH_DONE" when finished.`, display: true, details: undefined }, { triggerTurn: true })
    updateWidget()
  })

  // ── Tools ──────────────────────────────────────────────────────────────

  pi.registerTool({
    name: 'pai_status',
    label: 'PAI Status',
    description: 'Get PAI status: mission, goals, challenges, learnings, loop, ratings, trends, personas.',
    parameters: Type.Object({}),
    execute: async () => {
      const { trend, avg, recent } = ratingTrend(state.ratings)
      const patterns = detectRepeatingPatterns(state.learnings)
      return {
        details: undefined,
        content: [{ type: 'text' as const, text: JSON.stringify({
          version: '4.2.0',
          algorithm: 'OBSERVE → PLAN → DECIDE → EXECUTE → VERIFY',
          effortLevels: 'Standard(8)|Extended(16)|Advanced(24)|Deep(40)|Comprehensive(64)',
          iscMethodology: 'splitting test + count gate + anti-criteria + capability tracking',
          timeBudgets: TIME_BUDGETS_MIN,
          mission: state.mission,
          goals: Array.from(state.goals.values()),
          challenges: Array.from(state.challenges.values()),
          learnings: state.learnings.slice(-10).map(l => ({ insight: l.insight, category: l.category, sentiment: l.sentiment })),
          innerLoop: state.innerLoop ? {
            phase: state.innerLoop.phase, effort: state.innerLoop.effort, goal: state.innerLoop.goal,
            isc: state.innerLoop.isc,
            iscMinimum: ISC_MINIMUMS[state.innerLoop.effort],
            iscAnti: state.innerLoop.iscA.map(a => ({ severity: a.severity, description: a.description })),
            capabilities: Array.from(state.innerLoop.capabilities.values()).map(c => ({ name: c.name, type: c.type, invocations: c.invocations, minRequired: c.minRequired })),
            elapsedMin: +((Date.now() - state.innerLoop.startTime) / 60000).toFixed(1),
            timeBudgetMin: TIME_BUDGETS_MIN[state.innerLoop.effort],
          } : null,
          iterations: state.iterationCount,
          ratings: { avg, recent, trend: trend, count: state.ratings.length },
          repeatingPatterns: patterns,
          agentPersonas: Object.keys(AGENT_PERSONAS),
        }, null, 2) }],
      }
    },
  })

  pi.registerTool({
    name: 'pai_learn',
    label: 'PAI Learn',
    description: 'Record a learning/insight into PAI.',
    parameters: Type.Object({
      insight: Type.String({ description: 'The learning or insight' }),
      category: Type.Optional(Type.String({ description: 'algorithm|system|domain|process' })),
      confidence: Type.Optional(Type.Number({ description: '0-1' })),
    }),
    execute: async (_callId, args) => {
      const sentiment = inferSentiment(5, args.insight)
      state.learnings.push({ insight: args.insight, confidence: args.confidence ?? 0.8, category: args.category || 'domain', timestamp: new Date(), sentiment })
      persist(pi, 'pai-learning', { insight: args.insight, category: args.category || 'domain', sentiment })
      updateWidget()
      return { details: undefined, content: [{ type: 'text' as const, text: `Learning [${args.category || 'domain'}] ${sentiment}: ${args.insight}` }] }
    },
  })

  pi.registerTool({
    name: 'pai_rate',
    label: 'PAI Rate',
    description: 'Rate output quality 1-10 with sentiment tracking. Low ratings auto-capture learnings.',
    parameters: Type.Object({
      score: Type.Number({ description: 'Rating 1-10' }),
      context: Type.Optional(Type.String({ description: 'Why' })),
    }),
    execute: async (_callId, args) => {
      const score = Math.max(1, Math.min(10, Math.round(args.score)))
      const sentiment = inferSentiment(score, args.context || '')
      state.ratings.push({ score, context: args.context || '', timestamp: new Date(), sentiment })
      persist(pi, 'pai-rating', { score, context: args.context, sentiment })
      if (score <= 3) {
        state.learnings.push({ insight: `Low rating (${score}): ${args.context || 'below expectations'}`, confidence: 0.9, category: 'algorithm', timestamp: new Date(), fromRating: score, sentiment: 'negative' })
        persist(pi, 'pai-learning', { insight: `Low rating (${score})`, category: 'algorithm', fromRating: score, sentiment: 'negative' })
      }
      updateWidget()
      const { trend, avg } = ratingTrend(state.ratings)
      return { details: undefined, content: [{ type: 'text' as const, text: `Rated ⭐${score} ${sentiment} | Avg: ${avg} (${trend})${args.context ? ' — ' + args.context : ''}` }] }
    },
  })

  // ── Damage Control ─────────────────────────────────────────────────────

  pi.on('tool_call', async (event, ctx) => {
    const { isToolCallEventType } = await import('@mariozechner/pi-coding-agent')

    // Emit tool call to observability dashboard
    const toolName = (event as any)?.name || (event as any)?.tool || 'unknown'
    emitObserveEvent('PostToolUse', { tool_name: toolName, source: 'pi-pai' })

    // v4.0.3 Feature #5: Track capability invocations
    if (state.innerLoop?.capabilities.size) {
      const cap = state.innerLoop.capabilities.get(toolName)
      if (cap) {
        cap.invocations++
        emitObserveEvent('PaiCapability', { action: 'invoke', name: toolName, count: cap.invocations })
      }
    }

    if (isToolCallEventType('bash', event)) {
      const cmd = event.input.command || ''
      for (const rule of rules.bashToolPatterns) {
        try {
          if (new RegExp(rule.pattern).test(cmd)) {
            if (rule.ask) {
              const ok = await ctx.ui.confirm('🛡️ PAI', `${rule.reason}\n\n${cmd}\n\nAllow?`, { timeout: 30000 })
              if (!ok) { persist(pi, 'pai-dc', { cmd, reason: rule.reason, action: 'denied' }); ctx.abort(); return { block: true, reason: `🛑 ${rule.reason}. DO NOT retry.` } }
              return { block: false }
            }
            persist(pi, 'pai-dc', { cmd, reason: rule.reason, action: 'blocked' })
            ctx.abort()
            return { block: true, reason: `🛑 ${rule.reason}. DO NOT retry.` }
          }
        } catch { /* bad regex, skip */ }
      }
    }

    if (isToolCallEventType('read', event) || isToolCallEventType('write', event) || isToolCallEventType('edit', event)) {
      const filePath = event.input.path || ''
      const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(ctx.cwd, filePath)
      for (const zap of rules.zeroAccessPaths) {
        if (isPathMatch(resolved, zap, ctx.cwd)) { ctx.abort(); return { block: true, reason: `🛑 zero-access: ${zap}. DO NOT retry.` } }
      }
      if (isToolCallEventType('write', event) || isToolCallEventType('edit', event)) {
        for (const rop of rules.readOnlyPaths) {
          if (isPathMatch(resolved, rop, ctx.cwd)) { ctx.abort(); return { block: true, reason: `🛑 read-only: ${rop}. DO NOT modify.` } }
        }
      }
    }

    if (isToolCallEventType('bash', event)) {
      const cmd = event.input.command || ''
      if (/\b(rm|del|rmdir|Remove-Item)\b/i.test(cmd)) {
        for (const ndp of rules.noDeletePaths) {
          const clean = ndp.replace(/^~\//, '').replace(/^\*/, '')
          if (clean && cmd.includes(clean)) {
            persist(pi, 'pai-dc', { cmd, reason: `no-delete: ${ndp}`, action: 'blocked' })
            ctx.abort()
            return { block: true, reason: `🛑 no-delete: ${ndp}. DO NOT retry.` }
          }
        }
      }
    }

    return { block: false }
  })

  // ── Session lifecycle ──────────────────────────────────────────────────

  // ── /pai sessions — list and replay pi sessions into the dashboard ───

  paiCommands['sessions'] = function(_rest, ctx) {
    const sessDir = path.join(os.homedir(), '.pi', 'agent', 'sessions')
    if (!fs.existsSync(sessDir)) { notify('No sessions found', 'info'); return }

    // Find session dirs and get latest file from each
    const dirs = fs.readdirSync(sessDir).filter(d => {
      try { return fs.statSync(path.join(sessDir, d)).isDirectory() } catch { return false }
    })

    const sessions: { dir: string; file: string; time: Date; lines: number }[] = []
    for (const dir of dirs) {
      const files = fs.readdirSync(path.join(sessDir, dir)).filter(f => f.endsWith('.jsonl')).sort().reverse()
      if (files.length) {
        const filePath = path.join(sessDir, dir, files[0])
        try {
          const stat = fs.statSync(filePath)
          const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n').length
          sessions.push({ dir, file: files[0], time: stat.mtime, lines })
        } catch { /* skip */ }
      }
    }

    sessions.sort((a, b) => b.time.getTime() - a.time.getTime())

    let r = `# Pi Sessions (${sessions.length})\n\n`
    r += `| # | Project | File | Events | Last Modified |\n|---|---------|------|--------|---------------|\n`
    const displaySessions = sessions.slice(0, 15)
    for (let si = 0; si < displaySessions.length; si++) {
      const s = displaySessions[si]
      const proj = s.dir.replace(/^--/, '').replace(/--$/, '').replace(/-/g, '/').slice(0, 40)
      r += `| ${si + 1} | ${proj} | ${s.file.slice(0, 30)} | ${s.lines} | ${s.time.toLocaleString()} |\n`
    }
    r += `\n**Replay to dashboard:** \`/pai replay <session-number>\`\n`
    r += `**Session dir:** ~/.pi/agent/sessions/\n`

    pi.sendMessage({ customType: 'pai-sessions', content: r, display: true, details: undefined }, { triggerTurn: false })
  }

  paiCommands['replay'] = function(rest) {
    const sessDir = path.join(os.homedir(), '.pi', 'agent', 'sessions')
    if (!fs.existsSync(sessDir)) { notify('No sessions found', 'error'); return }

    // Find all sessions sorted by time
    const dirs = fs.readdirSync(sessDir).filter(d => {
      try { return fs.statSync(path.join(sessDir, d)).isDirectory() } catch { return false }
    })
    const sessions: string[] = []
    for (const dir of dirs) {
      const files = fs.readdirSync(path.join(sessDir, dir)).filter(f => f.endsWith('.jsonl')).sort().reverse()
      if (files.length) sessions.push(path.join(sessDir, dir, files[0]))
    }
    sessions.sort((a, b) => {
      try { return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime() } catch { return 0 }
    })

    const idx = parseInt(rest.trim()) - 1
    if (isNaN(idx) || idx < 0 || idx >= sessions.length) { notify(`Usage: /pai replay <1-${sessions.length}>`, 'error'); return }

    const sessionFile = sessions[idx]
    let replayed = 0

    try {
      const lines = fs.readFileSync(sessionFile, 'utf8').trim().split('\n')
      for (const line of lines) {
        try {
          const ev = JSON.parse(line)
          // Map pi session events to observability format
          if (ev.type === 'session') {
            emitObserveEvent('SessionStart', { cwd: ev.cwd, source: 'pi-session-replay', session_id: ev.id })
            replayed++
          } else if (ev.type === 'message' && ev.message?.content) {
            for (const c of ev.message.content) {
              if (c.type === 'toolCall') {
                emitObserveEvent('PostToolUse', {
                  tool_name: c.name,
                  tool_input: c.arguments,
                  source: 'pi-session-replay',
                  session_id: ev.id,
                })
                replayed++
              }
            }
            // Emit token usage
            if (ev.message?.usage) {
              emitObserveEvent('PaiTokenUsage', {
                input: ev.message.usage.input,
                output: ev.message.usage.output,
                cost: ev.message.usage.cost,
                model: ev.message.model,
                source: 'pi-session-replay',
              })
              replayed++
            }
          } else if (ev.type === 'compaction') {
            emitObserveEvent('PaiCompaction', { source: 'pi-session-replay' })
            replayed++
          }
        } catch { /* skip bad lines */ }
      }
    } catch (e: any) { notify(`Failed to read session: ${e.message}`, 'error'); return }

    notify(`📊 Replayed ${replayed} events from ${path.basename(sessionFile)} → dashboard`, 'info')
  }

  pi.on('session_start', async (_event, ctx) => {
    widgetCtx = ctx
    rules = loadDamageRules(ctx.cwd)
    ensurePlansDir(ctx.cwd)
    observeSessionId = `pi-pai-${Date.now().toString(36)}`
    emitObserveEvent('SessionStart', { cwd: ctx.cwd, source: 'pi-pai', version: '4.1.0' })
    updateWidget()
    const n = rules.bashToolPatterns.length + rules.zeroAccessPaths.length + rules.readOnlyPaths.length + rules.noDeletePaths.length
    ctx.ui.notify(`🧠 π-PAI v4.2 (v4.0.3 full sync) | ${n ? n + ' rules' : 'no rules'} | /pai /ralph /rate`, 'info')
  })
}
