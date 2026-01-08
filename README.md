# 📋 PI-PAI - PI-MONO EXTENSION

## Overview

**pi-pai** is a comprehensive extension for **pi-mono** (the official Pi Coding Agent platform). It provides Personal AI Infrastructure (PAI) and Ralph Wiggum technique for rapid iteration.

**Status:** ✅ **Extension for pi-mono** (NOT standalone)

---

## 🔄 WHAT PI-PAI PROVIDES

### 1. PAI (Personal AI Infrastructure)

**Origin:** Daniel Miessler's Personal_AI_Infrastructure

**The Two Loops:**

**Outer Loop:** Where You Are → Where You Want to Be
- Current state tracking
- Desired state definition
- Gap analysis and measurement
- Priority assessment
- Strategy generation

**Inner Loop:** The Scientific Method (7 Phases)
1. **OBSERVE** - Gather context
2. **THINK** - Generate ideas
3. **PLAN** - Design experiment
4. **DEFINE** - Set success criteria
5. **EXECUTE** - Run the plan
6. **MEASURE** - Collect results
7. **LEARN** - Refine for next iteration

### 2. Ralph Wiggum (Simple Iteration)

**Origin:** Geoffrey Huntley - Ralph Wiggum technique

**Core Philosophy:**
> "Ralph is deterministically bad in an undeterministic world."

**The Loop:**
```bash
while :; do cat PROMPT.md | pi ; done
```

**Features:**
- ✅ Iteration loop with `--max-iterations` limit
- ✅ Completion promise detection via `<promise>TAG</promise>` tags
- ✅ Iteration counter displayed in status bar
- ✅ Widget display showing loop progress above editor
- ✅ Custom message renderer for Ralph loop messages
- ✅ `Ctrl+R` keyboard shortcut to cancel loop
- ✅ Prompt from file support (`--file`)
- ✅ Status preservation across sessions
- ✅ Strict validation (requires prompt + either max-iterations or completion-promise)
- ✅ Optional subagent mode flag
- ✅ Detailed completion summaries with iteration count and duration
- ✅ Error recovery (continues loop on errors - errors are part of iteration)

**When to Use Ralph Wiggum:**
- Simple, iterative tasks
- Rapid prototyping
- Single-agent tasks
- Quick experiments
- When speed matters more than complexity

**Why It Works:**
- Direct, no overhead
- Fast iteration (each loop is quick)
- Easy to debug
- Self-referential (AI sees own git history)
- Time-tested (proven approach)

### 3. Damage Control (Security)

**Origin:** https://github.com/disler/claude-code-damage-control

**Purpose:** Defense-in-depth protection for pi-mono platform

**100+ Protection Patterns:**
- **Destructive Commands:** rm -rf, dd of=, git clean -fd, git reset --hard
- **Git Destructive Commands:** git reset --hard, git push --force, git clean -fd, git branch -D
- **Cloud Platform Commands:** AWS S3, RDS, GCP, Firebase, Vercel, Netlify, Heroku
- **Database Commands:** DROP TABLE, TRUNCATE TABLE, DELETE FROM, FLUSHALL
- **Docker Commands:** system prune, rmi, container rm, volume rm
- **Kubernetes Commands:** delete namespace, delete pod, delete deployment

**Three Protection Levels:**
1. **Zero Access** - No read, write, edit, delete for secrets
2. **Read Only** - Protect system files and configurations
3. **No Delete** - Protect important files from deletion

**Key Benefits:**
- Blocks dangerous commands
- Protects sensitive files and paths
- Prevents destructive operations
- Confirmation dialogs for risky actions
- Audit logging for security events

---

## 🏗 EXTENSION ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│         PI-PAI EXTENSION FOR PI-MONO             │
├─────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌───────────┐  │
│  │  PAI Loops   │────▶│ Ralph Loop   │────▶│ Damage Ctl │  │
│  │  (Scientific  │     │ (Simple    │     │ (Security)  │  │
│  │  Method)     │     │ Iteration)  │     │ (100+ patterns)│  │
│  └──────┬───────┘     └──────┬───────┘     └──────┬─────┘  │
│         │                       │                      │          │  │
│         ▼                       ▼                      ▼          │  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │     INTEGRATION LAYER                    │   │
│  ├─────────────────────────────────────────────────────┤  │
│  │  • Discord Bot Commands (81 available)      │   │
│  │  • CLI Integration                      │   │
│  │  • MCP Registry Access (927 servers)      │   │
│  │  • Act-Learn-Reuse (compound learning)        │   │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 FEATURES COMPARISON

| Feature | PAI Loops | Ralph Wiggum | Damage Control | Best For |
|---------|-------------|--------------|---------------|-----------|
| Simplicity | Low | High | Low | Ralph Wiggum (simple tasks) |
| Speed | Medium | High | Low | Ralph Wiggum (rapid iteration) |
| Complexity | High | Low | Medium | PAI Loops (complex workflows) |
| Learning | High | Low | Low | PAI Loops (scientific method) |
| Security | Low | Low | High | Damage Control (any time) |

---

## 🚀 QUICK START

### Installation

pi-pai is automatically loaded as an extension in pi-mono.

### Basic Usage

#### Using PAI (Scientific Method)
```bash
# Set goal
/pai observe "current state"
/pai plan "current" "desired state"
/pai execute "goal"
/pai measure "results"
/pai learn "new learnings"
/pai status "PAI system status"
```

#### Using Ralph Wiggum (Simple Iteration)
```bash
# Start Ralph loop (rapid iteration)
/ralph-loop "Build a REST API" --max-iterations 50

# Start from a prompt file
/ralph-loop --file PROMPT.md --max-iterations 20

# Cancel active loop
/cancel-ralph
```

#### Using Damage Control (Security)
```bash
# Enable damage control
/damage-control enable

# Test a dangerous command
/damage-control test "rm -rf /test"

# Add protected path
/damage-control add-path "~/.ssh" "zero-access"

# List protected paths
/damage-control list-paths
```

---

## 📈 GROWTH METRICS

### Compound Learning
- Each PAI iteration improves system
- Each Ralph iteration provides rapid feedback
- Combined: Fast iteration + Structured learning
- 1 + 1 = 10 (knowledge compounds)

### Scalability
- Works for personal goals
- Scales to team goals
- Extends to organizational goals

---

## 🎯 WHEN TO USE EACH COMPONENT

### 🟢 Use Ralph Wiggum When:
- Simple, iterative tasks
- Rapid prototyping
- "I need this done in 10 minutes"
- Make it work, don't overthink

### 🟡 Use PAI (Scientific Method) When:
- Complex, multi-step workflows
- "Research → Plan → Build → Test → Deploy → Monitor"
- Long-term projects
- Need knowledge compounding

### 🟣 Use Damage Control When:
- Any time (defensive security)
- Working in code repository
- Dealing with production systems
- Need to prevent destructive operations

---

## 📚 DOCUMENTATION

### Extension Documentation
- [Extension Architecture](docs/ARCHITECTURE.md)
- [Integration Guide](docs/INTEGRATION.md)
- [Pack System](docs/PACKS.md)
- [Development Guide](docs/DEVELOPMENT.md)

### Component Documentation
- [PAI Integration](docs/pai-integration.md)
- [Ralph Wiggum Guide](docs/ralph-wiggum-guide.md)
- [Damage Control Guide](docs/damage-control-guide.md)

---

## 📄 LICENSE

MIT License - Compatible with pi-mono

---

## 📊 REPOSITORY

**pi-mono Platform:** https://github.com/badlogic/pi-mono
**pi-pai Extension:** https://github.com/arosstale/pi-pai

**Type:** Extension for pi-mono
**Version:** 1.2.0
**Status:** ✅ TAC Framework references removed
**Status:** ✅ Agentic Horizon references removed
**Status:** ✅ Clean (PAI + Ralph + Damage Control only)

---

## 🎉 SUMMARY

**pi-pai** is a clean extension for **pi-mono** platform that provides:

- ✅ **PAI** - Personal AI Infrastructure (scientific method loops)
- ✅ **Ralph Wiggum** - Simple iteration technique (rapid development)
- ✅ **Damage Control** - Security protection (100+ patterns)
- ✅ **Discord Bot Integration** - All commands available in pi-mono
- ✅ **MCP Registry Access** - 927 servers, 13,062+ tools
- ✅ **Integration Layer** - CLI, PAI, Ralph, Damage Control all integrated

**What Was Removed:**
- ❌ TAC Framework references (8 lessons + 6 modules)
- ❌ Agentic Horizon references
- ❌ All private pi-mono component references

**What Remains:**
- ✅ Pure PAI (Daniel Miessler's framework)
- ✅ Ralph Wiggum (simple iteration)
- ✅ Damage Control (security patterns)
- ✅ Integration with pi-mono platform

**Your Pi-Mono ecosystem is now clean and focused on PAI, Ralph Wiggum, and Damage Control!** 🚀
