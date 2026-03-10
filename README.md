# π-PAI v4.0 — Personal AI Infrastructure for Pi

A Pi Coding Agent extension implementing [Daniel Miessler's PAI framework](https://github.com/danielmiessler/Personal_AI_Infrastructure) (9.6K ⭐), synced with **PAI v4.0.3**. Includes the Ralph Wiggum iteration technique, damage control, and 5 features ported from Miessler's full system.

## Install

```bash
pi install npm:pi-pai
```

## What's New in v4.0

### Synced with Miessler's PAI v4.0.3

| Feature | Source | Implementation |
|---------|--------|---------------|
| **v4 Algorithm** | PAI v4.0.3 | OBSERVE → PLAN → DECIDE → EXECUTE → VERIFY (was 7-phase, now 5) |
| **Sentiment tracking** | PAI Observability | Every rating gets sentiment (positive/neutral/negative) + trend analysis |
| **Agent personas** | PAI 14 agents | 7 personas: architect, engineer, pentester, designer, reviewer, researcher, qa |
| **Self-evolution** | PAI self-upgrade | Detects repeating learning patterns (3+ occurrences), triggers `/pai evolve` |
| **Plans convention** | PAI Plans dir | Auto-creates `.pi/plans/`, lists plans via `/pai plans` |

## Commands

### `/pai` — Goal-Driven Algorithm

```bash
# Setup
/pai mission Build a profitable trading system
/pai goal Deploy live stat-arb strategy
/pai challenge Overfitting risk on historical data

# Run the v4 algorithm loop
/pai loop Deploy live strategy    # Start: OBSERVE
/pai isc Strategy achieves Sharpe >1.5 on 5-year backtest
/pai next Observed: spread mean-reverts at 3.2 std
/pai next Plan: backtest 2020-2025, then paper trade 2 weeks
/pai next Decision: go with mean-reversion, tight stops
/pai next Executed: deployed to paper trading
/pai next Verified: 58% win rate, Sharpe 1.8

# Templates
/pai template trading    # Pre-built mission + goals + challenges
/pai template saas|devops|research|agent

# Agent personas (NEW in v4)
/pai agent architect Design the auth system for a multi-tenant SaaS
/pai agent pentester Review this API for security vulnerabilities
/pai agent designer Create the onboarding flow for mobile
/pai agent reviewer Review the feature branch against main

# Sentiment & trends (NEW in v4)
/pai trend              # Rating trend: avg, recent, sentiment distribution
/pai evolve             # Self-evolution: repeating pattern report

# Other
/pai plans              # List .pi/plans/ directory
/pai status             # Full status with all v4 features
/pai learn <insight>    # Record a learning
/pai done g0            # Complete a goal
/pai block g1           # Block a goal
/pai reset              # Clear everything
```

### `/rate` — Sentiment-Aware Ratings

```bash
/rate 9 Clean architecture, fast execution  # → ⭐9 😊 positive
/rate 3 Missed edge cases, slow             # → ⭐3 😞 negative → auto-captures learning
/rate 6                                     # → ⭐6 😐 neutral
```

Ratings track: score (1-10), context, timestamp, **sentiment** (inferred from score + keywords).

Widget shows trend: `⭐7.2 📈8.0 (15 ratings)` — improving/declining/stable.

### `/ralph` — Deterministic Iteration

```bash
/ralph Build a REST API with auth, tests, and docs
# Agent iterates up to 50 times until RALPH_DONE
/ralph stop
```

### 🛡️ Damage Control

Guards via YAML rules (`damage-control-rules.yaml`):
- **Blocked patterns:** `rm -rf`, `git reset --hard`, `git push --force`, `DROP TABLE`
- **Confirm-first:** `git push --delete`, `git branch -D`
- **Zero-access:** `.env`, `~/.ssh/`, `~/.aws/`, `*.pem`
- **Read-only/No-delete:** configurable per project

### 🔧 Agent Tools

| Tool | Description |
|------|-------------|
| `pai_status` | Full status with v4 algorithm, trends, personas, patterns |
| `pai_learn` | Record insight with sentiment |
| `pai_rate` | Rate 1-10 with sentiment + trend tracking |

### 📊 Live Widget

```
  🎯 Build a profitable trading system
  Goals: 2⚡ 0🚫 1✓ │ 5 learnings │ ⭐7.2 📈8.0 (15)
  Loop: ● ● ◉ ○ ○ [DECIDE] standard 42s
  ⚠️ 2 repeating pattern(s) — consider /pai evolve
```

## Agent Personas

| Persona | Focus |
|---------|-------|
| `architect` | System design, scalability, API design, failure modes |
| `engineer` | Production code, error handling, types, tests |
| `pentester` | Security: injection, auth bypass, SSRF, secrets, deps |
| `designer` | UX/UI, accessibility, responsive, interaction patterns |
| `reviewer` | Code review: correctness, edge cases, P1/P2/P3 findings |
| `researcher` | Deep investigation, evidence-based, source citations |
| `qa` | Test planning: happy paths, edge cases, boundaries, regression |

## Lineage

| Project | Author | What |
|---------|--------|------|
| [Personal AI Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure) | [Daniel Miessler](https://danielmiessler.com) | PAI v4.0.3 framework (9.6K ⭐) |
| [pi-ralph](https://github.com/Whamp/pi-ralph) | Whamp | Ralph Wiggum iteration technique |
| [pi-vs-claude-code](https://github.com/disler/pi-vs-claude-code) | disler | Damage control + extension patterns |
| [Pi Coding Agent](https://github.com/badlogic/pi) | Mario Zechner | The platform |

## v3 → v4 Migration

The algorithm changed from 7 phases to 5:
- **Old:** OBSERVE → THINK → PLAN → DEFINE → EXECUTE → MEASURE → LEARN
- **New:** OBSERVE → PLAN → DECIDE → EXECUTE → VERIFY

THINK+PLAN merged into PLAN. DEFINE became DECIDE. MEASURE+LEARN merged into VERIFY.

Active loops will reset on upgrade. All other state (goals, learnings, ratings) carries forward.
