# 📋 PI-PAI - PI-MONO EXTENSION

## Overview

**pi-pai** is a comprehensive extension for **pi-mono** (the official Pi Coding Agent platform). It provides Personal AI Infrastructure (PAI) - Daniel Miessler's framework for goal pursuit and scientific method loops - as an extension that integrates with pi-mono's Discord bot, MCP registry, expertise system, and security protection.

**Status:** ✅ **Extension for pi-mono**

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
- ✅ Iteration loop with max-iterations limit
- ✅ Completion promise detection via <promise>TAG</promise> tags
- ✅ Iteration counter displayed in status bar
- ✅ Widget display showing loop progress above editor
- ✅ Custom message renderer for Ralph loop messages
- ✅ Ctrl+R keyboard shortcut to cancel loop
- ✅ Prompt from file support (--file)
- ✅ Status preservation across sessions
- ✅ Strict validation (requires prompt + either max-iterations or completion-promise)
- ✅ Optional subagent mode flag
- ✅ Detailed completion summaries with iteration count and duration
- ✅ Error recovery (continues loop on errors - errors are part of iteration)

### 3. Damage Control (Security)

**Purpose:** Defense-in-depth protection for pi-mono platform

**100+ Protection Patterns:**
- Destructive commands (rm -rf, dd of=, git clean -fd, git reset --hard)
- Git destructive commands (git reset --hard, git push --force, git clean -fd, git branch -D)
- Cloud platform commands (AWS S3, RDS, GCP, Firebase, Vercel, Netlify, Heroku)
- Database commands (DROP TABLE, TRUNCATE TABLE, DELETE FROM, FLUSHALL, VACUUM)
- Docker commands (system prune, rmi, container rm, volume rm)
- Kubernetes commands (delete namespace, delete pod, delete deployment)

**Three Protection Levels:**
1. **Zero Access** - No read, write, edit, delete for secrets
2. **Read Only** - Read allowed, modifications blocked
3. **No Delete** - Read/write/edit allowed, delete blocked

---

## 🏗 EXTENSION ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│         PI-PAI EXTENSION FOR PI-MONO             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌───────────┐  │
│  │  PAI Loops    │────▶│  Ralph Loop   │────▶│  Damage Ctl │  │
│  │  (Scientific   │     │  (Simple     │     │ (Security)  │  │
│  │   Method)     │     │  Iteration)  │     │ (100+ patterns)│
│  └──────┬───────┘     └──────┬───────┘     └─────┬──────┘  │
│         │                       │                      │          │  │
│         ▼                       ▼                      ▼          │  │
│  ┌───────────────────────────────────────────────┐   │
│  │           INTEGRATION LAYER                │   │
│  ├───────────────────────────────────────────────┤   │
│  │  • Discord Bot Commands (81 available)      │   │
│  │  • CLI Integration                            │   │
│  │  • MCP Registry Access (927 servers)       │   │
│  │  • Expertise System Sharing (35 domains)    │   │
│  │  • Act-Learn-Reuse (compound learning)      │   │
│  └───────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 QUICK START

### Installation

pi-pai is automatically loaded as an extension in pi-mono.

```bash
# Verify extension is loaded
pi status extensions

# Should show:
# @badlogic/pi-mono-pai loaded
```

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

## 📊 FEATURES

### PAI Features
- ✅ Two-loop architecture (Outer + Inner)
- ✅ 7-phase scientific method
- ✅ Goal pursuit system
- ✅ Strategy generation
- ✅ Gap analysis

### Ralph Wiggum Features
- ✅ Simple iteration loop
- ✅ Self-referential learning from git history
- ✅ Completion promise detection
- ✅ Iteration counter and status bar
- ✅ Widget display above editor
- ✅ Custom message renderer
- ✅ Ctrl+R keyboard shortcut
- ✅ Prompt from file support
- ✅ Status preservation
- ✅ Strict validation
- ✅ Optional subagent mode
- ✅ Detailed completion summaries
- ✅ Error recovery

### Damage Control Features
- ✅ 100+ protection patterns
- ✅ Three protection levels (zero-access, read-only, no-delete)
- ✅ Pattern-based command detection
- ✅ Path protection for sensitive files
- ✅ Pre-tool-use validation
- ✅ Post-tool-use logging
- ✅ Confirmation dialogs for dangerous operations
- ✅ Audit logging for security events

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

## 📚 DOCUMENTATION

- [PAI Architecture](docs/PAI-ARCHITECTURE.md)
- [Ralph Wiggum Guide](docs/RALPH-WIGGUM-GUIDE.md)
- [Damage Control Guide](docs/DAMAGE-CONTROL-GUIDE.md)
- [Integration Guide](docs/INTEGRATION-GUIDE.md)
- [Development Guide](docs/DEVELOPMENT.md)

---

## 📄 LICENSE

MIT License - Compatible with pi-mono

---

## 📊 REPOSITORY

**pi-mono Platform:** https://github.com/badlogic/pi-mono
**pi-pai Extension:** https://github.com/arosstale/pi-pai

---

## 🎉 SUMMARY

**pi-pai** is a comprehensive extension for **pi-mono** platform that provides:

- ✅ **PAI (Personal AI Infrastructure)** - Daniel Miessler's framework
- ✅ **Ralph Wiggum** - Simple iteration technique
- ✅ **Damage Control** - Security protection

**Result:** A complete goal pursuit and learning system integrated into pi-mono platform!
