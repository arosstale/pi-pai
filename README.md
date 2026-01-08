# 📋 PI-PAI - PI-MONO EXTENSION

## Overview

**pi-pai** is a comprehensive extension for **pi-mono** (the official Pi Coding Agent platform). It provides:
- ✅ **PAI (Personal AI Infrastructure)** - Daniel Miessler's framework for goal pursuit and scientific method loops
- ✅ **Ralph Wiggum** - Simple iteration technique for rapid development
- ✅ **Damage Control** - Security protection with 100+ dangerous command patterns
- ✅ **TAC Framework Integration** - 8 lessons + Agentic Horizon (6 modules)
- ✅ **Act-Learn-Reuse** - Compound learning system
- ✅ **MCP Registry Access** - 927 servers, 13,062 tools

**Status:** ✅ **Extension for pi-mono** (NOT standalone)

---

## 🔄 INTEGRATION WITH PI-MONO

### Relationship to pi-mono

```
pi-mono (Core Platform)
  ├── packages/
  │   ├── discord-bot/         # Discord bot with 81 commands
  │   ├── coding-agent/          # Core AI agent system
  │   └── ...                  # Other pi-mono packages
  └── extensions/              # Extensions directory
      ├── @badlogic/pi-mono-pai/  # ⭐ PAI extension (this extension)
      ├── @badlogic/pi-mono-tui/   # Terminal UI
      └── ...                  # Other extensions
```

### Extension Loading

pi-mono automatically loads pi-pai extension:

```json
{
  "pi": {
    "extensions": [
      "./packages/pi-mono-pai/dist/index.js"
    ]
  }
}
```

---

## 🎯 WHAT PI-PAI PROVIDES

### 1. PAI (Personal AI Infrastructure)

**Origin:** Daniel Miessler's Personal_AI_Infrastructure

**The Two Loops:**

**Outer Loop:** Where You Are → Where You Want to Be
- **Current State:** Where you are right now
- **Desired State:** Where you want to be
- **Gap Analysis:** Calculate distance between states
- **Priority Assessment:** Determine urgency
- **Strategy Generation:** Create approaches to close the gap

**Inner Loop:** The Scientific Method (7 Phases)
1. **OBSERVE** - Gather context
2. **THINK** - Generate ideas
3. **PLAN** - Design experiment
4. **DEFINE** - Set success criteria
5. **EXECUTE** - Run the plan
6. **MEASURE** - Collect results
7. **LEARN** - Refine for next iteration

**Key Benefits:**
- ✅ Structured goal pursuit
- ✅ Scientific method for reliable results
- ✅ Knowledge compounding
- ✅ Progress tracking
- ✅ Iterative improvement

**Discord Bot Commands:**
```bash
/pai observe "current state"
/pai plan "current" "desired state"
/pai execute "goal"
/pai measure "results"
/pai learn "new learnings"
/pai status "PAI system status"
```

### 2. Ralph Wiggum (Simple Iteration)

**Origin:** Geoffrey Huntley - Ralph Wiggum technique

**Core Philosophy:**
> "Ralph is deterministically bad in an undeterministic world."

**The Loop:**
```bash
while :; do cat PROMPT.md | pi ; done
```

**Features:**
- ✅ Simple iteration loop (one task per iteration)
- ✅ Completion promise detection via `<promise>TAG</promise>` tags
- ✅ Iteration counter and status bar
- ✅ Self-referential learning (AI sees its own git history)
- ✅ Error recovery (continues loop on errors)
- ✅ Status preservation across sessions
- ✅ `Ctrl+R` keyboard shortcut to cancel

**Key Benefits:**
- ✅ Speed - Rapid iteration for simple tasks
- ✅ Simplicity - Elegant bash loop, minimal overhead
- ✅ Reliability - Time-tested approach
- ✅ Easy to debug - Straightforward logic

**When to Use Ralph Wiggum:**
- Simple, iterative tasks (write function, fix bug)
- Rapid prototyping (try approach, iterate 10x)
- Single-agent tasks (write module, create endpoint)
- When speed matters (need it done in 10 minutes)
- Make it work, don't overthink

**Discord Bot Commands:**
```bash
/ralph-loop "Build a REST API" --max-iterations 50
/ralph-loop --file PROMPT.md --max-iterations 20
/cancel-ralph
```

### 3. Damage Control (Security)

**Origin:** https://github.com/disler/claude-code-damage-control

**Purpose:** Defense-in-depth protection for pi-mono platform

**Protection Levels:**

**Zero Access:** No read, write, edit, delete (secrets and credentials)
- **Paths:** `~/.ssh/`, `~/.aws/`, `.env` files
- **Purpose:** Protect credentials and secrets

**Read Only:** Read allowed, modifications blocked
- **Paths:** `/etc/`, `~/.bashrc`, lock files
- **Purpose:** Protect system files and configurations

**No Delete:** Read/write/edit allowed, delete blocked
- **Paths:** `.claude/`, repository metadata, documentation
- **Purpose:** Protect important files from accidental deletion

**Protection Patterns (100+):**

**Destructive Commands:**
- `rm -rf` - Recursive force delete
- `dd of=/dev/` - Disk destruction
- `git clean -fd` - Git destructive cleanup
- `git reset --hard` - Hard reset history
- `git push --force` - Force push to remote

**Git Destructive Commands:**
- `git reset --hard` - Hard reset
- `git clean -fd` - Force cleanup
- `git push --force` - Force push

**Cloud Platform Commands:**
- `aws s3 rm --recursive` - AWS S3 delete
- `aws rds delete-db-instance` - AWS RDS delete
- `gcloud projects delete` - GCP project delete
- `firebase projects:delete` - Firebase project delete
- `vercel remove` - Vercel deployment delete
- `netlify sites:delete` - Netlify site delete
- `heroku apps:destroy` - Heroku app destroy

**Database Commands:**
- `DROP TABLE` - SQL drop table
- `TRUNCATE TABLE` - SQL truncate table
- `DELETE FROM` - SQL delete rows
- `FLUSHALL` - Redis flush all databases

**Docker Commands:**
- `docker system prune -a` - Remove all Docker data
- `docker rmi -f` - Force remove images
- `docker container rm -f` - Force remove containers
- `docker volume rm -f` - Force remove volumes

**Kubernetes Commands:**
- `kubectl delete namespace` - Delete namespace
- `kubectl delete pod --all` - Delete all pods
- `kubectl delete deployment --all` - Delete all deployments

**Key Benefits:**
- ✅ Blocks dangerous commands (100+ patterns)
- ✅ Protects sensitive files and paths
- ✅ Prevents destructive operations
- ✅ Confirmation dialogs for risky operations
- ✅ Audit logging for security events

**Discord Bot Commands:**
```bash
/damage-control enable
/damage-control status
/damage-control test "rm -rf /test"
/damage-control add-path "~/.ssh" "zero-access"
/damage-control list-paths
```

### 4. TAC Framework Integration

**Origin:** IndyDevDan - Tactical Agentic Coding

**8 TAC Lessons:**
1. **TAC-1** - Basic programmable agents
2. **TAC-2** - NLQ-to-SQL application
3. **TAC-3** - Slash commands
4. **TAC-4** - Full hooks + ADW basics
5. **TAC-5** - Event analytics + JSONL support
6. **TAC-6** - ADW automation system
7. **TAC-7** - Git worktrees
8. **TAC-8** - Multi-agent applications (5 apps)

**6 Agentic Horizon Modules:**
1. **Elite Context Engineering** - 12 techniques
2. **Agentic Prompt Engineering** - 7 levels
3. **Building Specialized Agents** - 8 agents
4. **Multi-Agent Orchestration** - Production platform
5. **Agent Experts** - Self-improving agents
6. **Orchestrator Agent with ADWs** - Full ADW system

**Key Benefits:**
- ✅ Multi-agent coordination
- ✅ Parallel execution
- ✅ Compound learning
- ✅ Quality gates
- ✅ Observability
- ✅ Production-ready workflows

**Discord Bot Commands:**
```bash
/tac8 deploy --app "multi_agent_todone"
/tac8 deploy --app "orchestrator_db"
/agent-expert "trading" "new signal pattern"
```

### 5. Act-Learn-Reuse (Compound Learning)

**Purpose:** Learn from every interaction and get smarter over time

**The Loop:**
- **ACT** - Load expertise, inject into context, execute task
- **LEARN** - Extract learnings from output, update expertise files
- **REUSE** - Next session loads accumulated knowledge

**Key Benefits:**
- ✅ Compound learning (10x smarter in 1 year)
- ✅ Knowledge accumulation
- ✅ Pattern recognition
- ✅ Session-to-session improvement
- ✅ Zero token cost for reusing knowledge

**Discord Bot Commands:**
```bash
/agent expertise "trading" "new pattern"
/expertise update "trading" --pattern "New: Use stop-loss orders"
/expertise list
```

### 6. MCP Registry Access

**Purpose:** Discover and use tools from 927 MCP servers

**Capabilities:**
- ✅ 927 MCP servers indexed
- ✅ 13,062+ tools discoverable
- ✅ Dynamic tool discovery
- ✅ Automatic skill generation
- ✅ 90% token cost reduction (76K → 8K per task)

**Key Benefits:**
- ✅ Tool discovery automation
- ✅ Skill library growth
- ✅ Cost optimization
- ✅ Multi-provider support

**Discord Bot Commands:**
```bash
/mcp search "database" --servers 5
/mcp list
/mcp discover "brave-search"
```

---

## 🏗 EXTENSION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│           PI-PAI EXTENSION FOR PI-MONO             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌───────────┐  │
│  │   PAI Loops   │────▶│  Ralph Loop   │────▶│  Damage Ctl │  │
│  │  (Scientific  │     │  (Simple    │     │ (Security)  │  │
│  │   Method)     │     │  Iteration)  │     │ (100+ patterns)│
│  └──────┬───────┘     └──────┬───────┘     └──────┬─────┘  │
│         │                       │                      │          │  │
│         ▼                       ▼                      ▼          │  │
│  ┌───────────────────────────────────────────────┐   │
│  │           TAC FRAMEWORK INTEGRATION      │   │
│  ├───────────────────────────────────────────────┤   │
│  │  • 8 TAC Lessons                           │   │
│  │  • 6 Agentic Horizon Modules                │   │
│  │  • Multi-Agent Coordination                │   │
│  │  • Act-Learn-Reuse                         │   │
│  └───────────────────────────────────────────────┘   │
│         │                                              │          │  │
│         ▼                                              ▼          │  │
│  ┌───────────────────────────────────────────────┐   │
│  │        PI-MONO PLATFORM INTEGRATION       │   │
│  ├───────────────────────────────────────────────┤   │
│  │  • Discord Bot (81 commands)            │   │
│  │  • MCP Registry (927 servers)           │   │
│  │  • Expertise System (35 domains)          │   │
│  │  • Act-Learn-Reuse (compound learning)   │   │
│  └───────────────────────────────────────────────┘   │
│         │                                              │          │  │
│         ▼                                              ▼          │  │
└─────────────────────────────────────────────────────────────┘
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
/pai set-goal "Achieve financial independence"

# View current state
/pai current-state

# Define desired state
/pai desired-state "Have $1M in savings, passive income"

# Start PAI inner loop (scientific method)
/pai start-loop

# View progress
/pai status
```

#### Using Ralph Wiggum (Simple Iteration)
```bash
# Start a Ralph loop
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

#### Using TAC Framework (Multi-Agent)
```bash
# Deploy multi-agent application
/tac8 deploy --app "multi_agent_todone" --mode "production"

# Use agent expert
/agent-expert "trading" "new signal pattern"

# Start ADW workflow
/adw-plan-build-review-fix "Implement feature X"
```

#### Hybrid Approach (PAI + Ralph)
```bash
# Phase 1: Rapid iteration with Ralph
/ralph-loop "Test this approach" --ralph-max 10

# Phase 2: Extract learnings
extract-learnings-from-session

# Phase 3: Apply structured learning with PAI
/pai start-loop --context "ralph-learnings"
```

---

## 🎯 WHEN TO USE EACH COMPONENT

### 🟢 Use PAI (Scientific Method) When:
- **Complex, multi-step workflows**
  - "Research → Plan → Build → Test → Deploy → Monitor"
  - "Extract → Transform → Load → Validate"
  - Multi-agent coordination
- **Long-term projects**
  - "Build and maintain a complete system over weeks/months"
- **When knowledge compounding is critical**
  - "I need to learn from every interaction and get smarter"
- **When you need structured approach**
  - "Use scientific method for reliable results"
  - "Quality gates between phases"
- **Observability needed**
  - "I need metrics and logging"

### 🟢 Use Ralph Wiggum (Simple Iteration) When:
- **Simple, iterative tasks**
  - "Write a function", "Fix this bug"
  - "Generate 10 variations of this prompt"
- **Rapid prototyping**
  - "Try this approach, iterate 10 times"
- **Single-agent tasks**
  - "Write this code module", "Create this API endpoint"
- **When speed matters**
  - "I need this done in 10 minutes"
  - "Simple tasks that benefit from rapid iteration"
  - "Make it work, don't overthink"

### 🟡 Use Damage Control When:
- **Any time (defensive security)**
  - "Always enable for protection"
  - "Block dangerous commands"
  - "Protect sensitive files"
- **Using pi-mono Claude Code**
  - "When working in code repository"
  - "When executing via Discord bot"
- **When dealing with production systems**
  - "Prevent accidental destruction"

### 🟡 Use TAC Framework When:
- **Multi-agent coordination**
  - "Have 3 agents research different approaches simultaneously"
  - "Deploy multiple microservices in parallel"
  - "Process data in parallel streams"
- **Complex projects**
  - "Complex workflows that benefit from orchestration"
- **When robust error handling and recovery is needed**
  - "Quality gates before next phase"
- **When you need full observability**

### 🟢 Use Hybrid (PAI + Ralph) When:
- **Rapid initial development + structured refinement**
  - "Use Ralph to quickly iterate (10 iterations)"
  - "Use PAI inner loop to structured refine result"
  - "Extract learnings from Ralph iterations"
  - "Apply to next PAI cycle"
- **Mixed complexity workflows**
  - "Simple components with Ralph, complex orchestration with PAI"
- **When you need both speed and structured learning**

---

## 📊 COMPARATIVE MATRIX

| Component | Complexity | Speed | Learning | Best For |
|-----------|-------------|-------|-----------|-----------|
| **PAI Loops** | High | Medium | High | Complex workflows, knowledge compounding |
| **Ralph Loop** | Low | High | Low | Simple tasks, rapid iteration |
| **Damage Control** | Medium | Low | Low | Any time (defensive security) |
| **TAC Framework** | High | Medium | High | Multi-agent, complex projects |
| **Hybrid** | Medium | Medium | High | Mixed workflows, optimal results |

---

## 📈 GROWTH METRICS

### Compound Learning
- Each PAI iteration improves system
- Each Ralph iteration provides rapid feedback
- Act-Learn-Reuse compounds knowledge
- 1 + 1 = 10 (knowledge compounds)

### Scalability
- **Personal Goals:** Simple tasks (Ralph), complex (PAI)
- **Professional Goals:** Multi-agent (TAC), structured learning (PAI)
- **Team Goals:** Parallel execution (TAC), coordination (PAI)
- **Learning Goals:** Compound learning (Act-Learn-Reuse)

---

## 📚 DOCUMENTATION

### Extension Documentation
- [Integration Guide](docs/INTEGRATION.md)
- [Pack System](docs/PACKS.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [API Reference](docs/API.md)
- [Examples](docs/EXAMPLES.md)

### Component Documentation
- [PAI Integration](docs/pai-integration.md)
- [Ralph Wiggum Guide](docs/ralph-wiggum-guide.md)
- [Damage Control Guide](docs/damage-control-guide.md)
- [TAC Framework Guide](docs/tac-framework-guide.md)
- [Act-Learn-Reuse Guide](docs/act-learn-reuse-guide.md)

### Official pi-mono Documentation
- [pi-mono README](https://github.com/badlogic/pi-mono#readme)
- [Extensions Guide](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
- [Discord Bot Docs](https://github.com/badlogic/pi-mono/blob/main/packages/discord-bot/README.md)
- [MCP Registry Docs](https://github.com/badlogic/pi-mono/blob/main/packages/mcp-registry/README.md)

---

## 📄 LICENSE

MIT License - Compatible with pi-mono

---

## 📊 REPOSITORY

**pi-mono Platform:** https://github.com/badlogic/pi-mono
**pi-pai Extension:** https://github.com/arosstale/pi-pai
**Status:** ✅ Extension for pi-mono (NOT standalone)
**Version:** 1.1.0

---

## 🎉 SUMMARY

**pi-pai** is a comprehensive extension for **pi-mono** platform that provides:

- ✅ **PAI (Personal AI Infrastructure)** - Daniel Miessler's framework
- ✅ **Ralph Wiggum** - Simple iteration technique
- ✅ **Damage Control** - Security protection (100+ patterns)
- ✅ **TAC Framework Integration** - 8 lessons + 6 modules
- ✅ **Act-Learn-Reuse** - Compound learning system
- ✅ **MCP Registry Access** - 927 servers, 13,062 tools

**Result:** A complete goal pursuit and learning system integrated into pi-mono platform!

---

## 🚀 START USING PI-PAI

pi-pai is automatically loaded as an extension in pi-mono. All commands are available via Discord bot.

```bash
# Check extension status
pi status extensions

# Use PAI commands
/pai observe "current state"
/pai execute "goal"

# Use Ralph commands
/ralph-loop "simple task" --max-iterations 50

# Use damage control
/damage-control test "rm -rf /test"

# Use TAC framework
/tac8 deploy --app "multi_agent_todone"
```

**Your pi-mono platform is now complete with comprehensive PAI extension!** 🚀
