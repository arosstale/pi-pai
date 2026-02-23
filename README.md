# π-PAI — Personal AI Infrastructure for Pi

A Pi Coding Agent extension implementing [Daniel Miessler's PAI framework](https://github.com/danielmiessler/Personal_AI_Infrastructure) (9K+ ⭐), the Ralph Wiggum iteration technique, and real-time damage control. Inspired by [disler's pi-vs-claude-code](https://github.com/disler/pi-vs-claude-code) extension patterns.

## Install

```bash
pi install npm:@arosstale/pi-pai
```

Or run directly:

```bash
pi -e path/to/pi-pai/src/extension.ts
```

## What You Get

### `/pai` — Goal-Driven Scientific Method

Implements [Daniel Miessler's PAI Algorithm](https://danielmiessler.com/personal-ai-infrastructure/) — a 7-phase scientific method loop for systematic goal pursuit:

> **Observe → Think → Plan → Define → Execute → Measure → Learn**

Track your mission, goals, challenges, and learnings:

```bash
/pai mission Build a profitable trading system
/pai goal Deploy live stat-arb strategy
/pai goal Achieve >55% win rate on paper trades
/pai challenge Overfitting risk on historical data
/pai loop Deploy live strategy
/pai next Observed: spread mean-reverts with 3.2 std threshold
/pai next Hypothesis: entry at 2.5 std, exit at 0.5 std
/pai next Plan: backtest 2020-2025, then paper trade 2 weeks
/pai next Success criteria: Sharpe >1.5, max DD <15%
/pai next Results: 58% win rate, Sharpe 1.8
/pai next Measurements logged
/pai next Key learning: tighter stops improve Sharpe by 0.3
/pai learn Tighter stops at 1.5 std improve risk-adjusted returns
/pai done g0
/pai status
```

### `/ralph` — Simple Iteration

The [Ralph Wiggum technique](https://github.com/Whamp/pi-ralph) — deterministic iteration loops where the agent keeps working until done:

```bash
/ralph Build a REST API with auth, tests, and docs
# Agent iterates up to 50 times until it says RALPH_DONE
/ralph stop
```

### 🛡️ Damage Control

Inspired by [disler/claude-code-damage-control](https://github.com/disler/claude-code-damage-control) and the `damage-control.ts` extension from [pi-vs-claude-code](https://github.com/disler/pi-vs-claude-code). Intercepts dangerous tool calls in real-time:

- **Blocked:** `rm -rf`, `git reset --hard`, `git push --force`, `DROP TABLE`, `chmod 777`, `dd of=/dev/`
- **Confirm first:** `git push --delete`, `git checkout -- .`, `git branch -D`
- **Zero-access:** `.env`, `~/.ssh/`, `~/.aws/`, `*.pem`, `*.key`

### 🔧 Agent Tools

| Tool | Description |
|------|-------------|
| `pai_status` | Get current mission, goals, challenges, learnings |
| `pai_learn` | Record an insight with confidence score |

### 📊 Live Widget

Persistent TUI widget showing mission, goal counts, and inner loop progress:

```
  🎯 Build a profitable trading system
  Goals: 2 active · 0 blocked · 1 done · 5 learnings
  Loop: ● ● ● ◉ ○ ○ ○ [DEFINE]
```

## Lineage

This extension stands on the shoulders of:

| Project | Author | What |
|---------|--------|------|
| [Personal AI Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure) | [Daniel Miessler](https://danielmiessler.com) | The PAI framework, Algorithm, TELOS goal system (9K+ ⭐) |
| [pi-vs-claude-code](https://github.com/disler/pi-vs-claude-code) | [IndyDevDan (disler)](https://www.youtube.com/@indydevdan) | Pi extension patterns, damage-control, subagent-widget, theme system |
| [claude-code-damage-control](https://github.com/disler/claude-code-damage-control) | disler | 100+ dangerous command patterns |
| [pi-ralph](https://github.com/Whamp/pi-ralph) | Whamp / Geoffrey Huntley | Ralph Wiggum simple iteration technique |
| [Pi Coding Agent](https://github.com/badlogic/pi-mono) | [Mario Zechner](https://x.com/badlogicgames) | The platform that makes all of this possible |

## License

MIT
