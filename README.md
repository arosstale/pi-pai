# π-PAI — Personal AI Infrastructure for Pi

A Pi Coding Agent extension implementing Daniel Miessler's [Personal AI Infrastructure](https://danielmiessler.com/personal-ai-infrastructure/) framework, the Ralph Wiggum iteration technique, and real-time damage control.

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

Track your mission, goals, challenges, and learnings with a 7-phase inner loop:

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

**Inner Loop Phases:** OBSERVE → THINK → PLAN → DEFINE → EXECUTE → MEASURE → LEARN

### `/ralph` — Simple Iteration

The [Ralph Wiggum technique](https://github.com/Whamp/pi-ralph) — deterministic iteration loops:

```bash
/ralph Build a REST API with auth, tests, and docs
# Agent iterates up to 50 times until it says RALPH_DONE
/ralph stop
```

### 🛡️ Damage Control

Automatically intercepts dangerous tool calls:

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

## Credits

- **PAI Framework:** [Daniel Miessler](https://danielmiessler.com/personal-ai-infrastructure/)
- **Ralph Wiggum:** [Geoffrey Huntley](https://github.com/Whamp/pi-ralph)
- **Damage Control patterns:** [disler/claude-code-damage-control](https://github.com/disler/claude-code-damage-control)
- **Pi Agent:** [Mario Zechner](https://github.com/badlogic/pi-mono)

## License

MIT
