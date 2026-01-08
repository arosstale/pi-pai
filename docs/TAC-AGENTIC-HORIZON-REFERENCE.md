# 📋 TAC FRAMEWORK & AGENTIC HORIZON - FUNCTIONAL DOCUMENTATION

## 🎯 OVERVIEW

**TAC (Tactical Agentic Coding)** Framework and **Agentic Horizon** are comprehensive systems for building AI-driven development workflows. They provide a complete ecosystem for:
- Programmable agents
- Multi-agent orchestration
- Natural language interfaces
- Agent specialization
- Context engineering
- Production-grade orchestration

---

## 📚 TAC FRAMEWORK (8 LESSONS)

### **TAC-1: Basic Programmable Agents**

**Purpose:** Foundation for agentic coding - teach Claude Code to operate your codebase programmatically.

**Core Concept:** Instead of directly modifying code, you teach agents how to operate through structured prompts and workflows.

**Architecture:**
```
programmable/
├── programmable.ts       # Bun-based programmable agent
├── programmable.sh        # Shell-based programmable agent
└── prompt.md            # AI coding prompt
```

**How It Works:**
1. Define programmable agent with prompt
2. Agent reads prompt and executes tasks
3. Output is structured and reproducible
4. Can be automated and scaled

**Key Components:**
- **Prompt Template:** Reusable prompt for AI coding
- **Execution Runtime:** Bun/Python/Shell support
- **Output Capture:** Structured output for further processing

**Example:**
```typescript
// programmable.ts
import { $ } from "bun";
import { readFileSync } from "fs";

async function main() {
  const promptContent = readFileSync("programmable/prompt.md", "utf-8");
  const output = await $`claude -p ${promptContent}`.text();
  console.log(output);
}

main();
```

---

### **TAC-2: Natural Language to SQL (NLQ-to-SQL)**

**Purpose:** Convert natural language queries to SQL using AI, with drag-and-drop file upload.

**Architecture:**
```
app/
├── server/                 # FastAPI backend
│   ├── server.py           # Main API server
│   ├── nlq.py            # Natural language to SQL converter
│   └── data/              # Uploaded data storage
└── client/                # Vite + TypeScript frontend
    └── Interactive query interface
```

**Features:**
- 🗣️ Natural language to SQL conversion (OpenAI/Anthropic)
- 📁 Drag-and-drop file upload (.csv, .json)
- 📊 Interactive table results display
- 🔒 SQL injection protection
- ⚡ Fast development with Vite + uv

**How It Works:**
1. User uploads data file (CSV/JSON)
2. Data is loaded into SQLite database
3. User types natural language query
4. AI generates SQL from natural language
5. SQL is executed and results displayed
6. User can refine query and try again

**API Endpoints:**
```python
# Upload data
POST /api/upload

# Query data
POST /api/query
{
  "query": "Show me all users who signed up last week"
}

# Get tables
GET /api/tables

# Delete table
DELETE /api/tables/{table_name}
```

**Quick Start:**
```bash
# Start backend
cd app/server
uv run server.py

# Start frontend
cd app/client
npm run dev

# Or use provided script
./scripts/start.sh
```

---

### **TAC-3: Slash Commands**

**Purpose:** Create reusable slash commands for common coding tasks.

**Architecture:**
```
.claude/commands/
├── start.md              # Initialize new project
├── tools.md              # Show available tools
├── prime.md             # Prime agent with context
├── chore.md              # Handle maintenance tasks
├── feature.md            # Implement new features
├── implement.md          # Implement specifications
├── install.md            # Install dependencies
└── bug.md                # Debug issues
```

**How It Works:**
1. Create markdown file with command structure
2. Define prompt template
3. Specify execution steps
4. Claude Code loads and executes on command trigger
5. Reusable across sessions

**Command Template:**
```markdown
# Feature Implementation

## Context
You are implementing a new feature for the codebase.

## Steps
1. Read the specification
2. Understand requirements
3. Implement the feature
4. Test the implementation
5. Create documentation

## Output
Provide implementation details and test results.
```

---

### **TAC-4: Full Hooks + ADW Basics**

**Purpose:** Event-driven automation with Pre/Post tool execution hooks and AI Developer Workflows (ADW).

**Architecture:**
```
.claude/
├── hooks/                     # Tool execution hooks
│   ├── pre_tool_use.py      # Run before tool execution
│   ├── post_tool_use.py     # Run after tool execution
│   └── utils/              # Hook utilities
└── settings.json            # Hook configuration

adws/                         # AI Developer Workflows
├── adw_modules/            # Workflow modules
│   ├── agent.py            # Agent execution
│   └── workflow_ops.py     # Workflow orchestration
└── adw_*.py               # Workflow scripts
```

**Hooks System:**
- **pre_tool_use:** Validate before tool execution
  - Block dangerous commands
  - Validate parameters
  - Modify tool inputs
- **post_tool_use:** React after tool execution
  - Log results
  - Trigger workflows
  - Update state

**ADW (AI Developer Workflows):**
- **agent.py:** Core agent execution module
- **workflow_ops.py:** Workflow orchestration
- **adw_iso.py:** Isolated workflows
- **adw_sdlc_*.py:** Full SDLC workflows

**How It Works:**
1. User executes tool (e.g., /bash, /edit, /write)
2. Pre-tool-use hook validates/transforms
3. Tool executes
4. Post-tool-use hook captures result
5. ADW workflow may be triggered
6. State updated and logged

---

### **TAC-5: Event Analytics + JSONL Support**

**Purpose:** Track all agent events and store in JSONL format for analysis.

**Architecture:**
```
app/
├── server/                 # FastAPI backend
│   ├── analytics.py        # Event tracking
│   ├── db.py              # Database layer
│   └── events.jsonl        # Event log
└── client/                # Frontend
    └── Analytics dashboard
```

**Features:**
- 📊 Real-time event tracking
- 📝 JSONL format for export/analysis
- 🎯 Event categorization (query, action, error)
- 📈 Analytics dashboard
- 💾 Persistent storage

**Event Types:**
- `query`: Natural language query
- `action`: Tool execution
- `error`: Error occurred
- `success`: Successful operation
- `workflow`: Workflow execution
- `agent`: Agent action

**JSONL Format:**
```jsonl
{"timestamp": "2026-01-08T05:00:00Z", "event_type": "query", "data": {...}}
{"timestamp": "2026-01-08T05:00:01Z", "event_type": "action", "data": {...}}
{"timestamp": "2026-01-08T05:00:02Z", "event_type": "error", "data": {...}}
```

---

### **TAC-6: ADW Automation System**

**Purpose:** Complete AI Developer Workflow system for automated development.

**Architecture:**
```
.claude/
├── commands/               # Workflow triggers
│   ├── start.md           # Initialize workflow
│   ├── tools.md           # Show available tools
│   ├── prime.md           # Prime with context
│   ├── chore.md           # Maintenance tasks
│   ├── feature.md         # New features
│   ├── implement.md       # Implement specs
│   ├── install.md         # Install dependencies
│   ├── bug.md             # Debug issues
│   ├── test.md            # Run tests
│   ├── review.md          # Code review
│   ├── commit.md          # Git commit
│   ├── tools.md           # Workflow tools
│   └── classify_*.md     # Classify issues/tasks

adws/                         # AI Developer Workflows
├── adw_modules/            # Workflow modules
│   ├── agent.py            # Agent execution
│   ├── data_types.py       # Type definitions
│   ├── git_ops.py          # Git operations
│   ├── github.py           # GitHub integration
│   ├── state.py            # State management
│   └── workflow_ops.py     # Workflow orchestration
├── adw_tests/              # Test suite
├── adw_data/               # Agent database
├── adw_*_iso.py            # Isolated workflows
├── adw_sdlc_*.py           # Full SDLC workflows
└── README.md                # Documentation
```

**Workflow Modules:**
- **agent.py:** Execute Claude Code agents with cost tracking
- **data_types.py:** Type definitions for all data structures
- **git_ops.py:** Git operations (branch, commit, PR)
- **github.py:** GitHub integration (issues, PRs, releases)
- **state.py:** State management (database, memory)
- **workflow_ops.py:** Orchestrate multi-step workflows

**Workflow Triggers:**
```python
# Start workflow
adw_start_workflow.py --name "feature-implementation"

# Run test workflow
adw_run_tests.py --test-suite "full"

# Create pull request
adw_create_pr.py --branch "feature/new-feature"
```

---

### **TAC-7: Git Worktrees**

**Purpose:** Manage multiple concurrent development branches using Git worktrees.

**Architecture:**
```
.git-worktrees/              # Git worktrees directory
├── worktree-1/            # Worktree for feature 1
├── worktree-2/            # Worktree for feature 2
└── worktree-3/            # Worktree for feature 3
```

**Git Worktree Commands:**
```bash
# Create new worktree
git worktree add ../worktree-name branch-name

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../worktree-name

# Prune worktrees
git worktree prune
```

**How It Works:**
1. Create worktree for each feature/task
2. Work in isolation without switching branches
3. Commit changes in worktree
4. Merge back to main branch when ready
5. Clean up completed worktrees

---

### **TAC-8: Multi-Agent Applications**

**Purpose:** Multiple specialized agents working together on complex tasks.

**Applications:**

#### **App 1: Agent Layer Primitives**
**Purpose:** Fundamental building blocks for agentic coding.

**Two Approaches:**
1. **Minimum Viable Agentic Layer:**
   ```
   specs/                          # Implementation specifications
   .claude/commands/               # Reusable prompts
   adws/                           # AI Developer Workflows
   ```

2. **Scaled Agentic Layer:**
   ```
   specs/                          # Specifications
   .claude/                        # Configuration
   ├── commands/                   # Prompts
   ├── hooks/                      # Event-driven automation
   └── settings.json               # Agent config
   adws/                           # Workflows
   ├── adw_modules/               # Core modules
   ├── adw_triggers/            # Triggers
   ├── adw_tests/               # Tests
   └── adw_data/                # Database
   ```

**Key Components:**
- **Plans:** Structured specifications guide agent actions
- **Prompts:** Reusable templates for agent interactions
- **Hooks:** Event-driven automation
- **Workflows:** Executable scripts orchestrate agents

#### **App 2: Multi-Agent Todeone**
**Purpose:** Parallel task execution across multiple agents.

**How It Works:**
1. Define task with multiple sub-tasks
2. Assign each sub-task to a specialized agent
3. Agents execute in parallel
4. Results aggregated and synthesized

#### **App 3: Out-of-Loop Multi-Agent Task Board**
**Purpose:** External multi-agent coordination with task queue.

**Architecture:**
```
task_board/
├── queue/                  # Task queue
├── agents/                 # Agent definitions
└── results/                # Result storage
```

#### **App 4: Multi-Agent Todeone**
**Purpose:** In-loop multi-agent task management.

#### **App 5: In-Loop Multi-Agent Task Board**
**Purpose:** Internal multi-agent task board with parallel execution.

#### **App 6: NLQ-to-SQL AEA**
**Purpose:** Natural language to SQL with Application Execution Agent.

#### **App 7: Prototyping Agent**
**Purpose:** Rapid prototyping with iterative refinement.

---

## 🚀 AGENTIC HORIZON (6 MODULES)

### **Module 1: Elite Context Engineering**

**Purpose:** Master advanced techniques for providing rich context to AI agents.

**12 Techniques:**
1. **Structured Context:** Organize information hierarchically
2. **Relevance Filtering:** Only include relevant information
3. **Compression:** Summarize large context
4. **Layered Context:** Different context layers for different needs
5. **Context Templates:** Reusable context structures
6. **Dynamic Context:** Update context based on agent state
7. **Context Caching:** Cache expensive context computation
8. **Context Validation:** Verify context quality
9. **Context Versioning:** Track context changes
10. **Context Metrics:** Measure context effectiveness
11. **Context Optimization:** Optimize context for performance
12. **Context Testing:** Test context variations

**How It Works:**
1. Analyze agent task and context requirements
2. Select appropriate context engineering technique
3. Build structured context using templates
4. Validate and optimize context
5. Provide to agent for execution

---

### **Module 2: Agentic Prompt Engineering**

**Purpose:** Create advanced prompts for AI agents.

**7 Prompt Levels:**
1. **Basic:** Simple prompts for straightforward tasks
2. **Structured:** Organized prompts with clear sections
3. **Few-Shot:** Examples to guide agent behavior
4. **Chain-of-Thought:** Step-by-step reasoning
5. **Meta-Prompting:** Prompts that generate other prompts
6. **Iterative:** Refined through multiple iterations
7. **Production-Ready:** Fully tested and optimized prompts

**Prompt Components:**
```markdown
# Role Definition
You are a specialized agent for [domain].

# Context
[Provide relevant context]

# Task
[Describe what needs to be done]

# Constraints
[List any constraints]

# Output Format
[Specify desired output format]

# Examples
[Provide examples of expected behavior]
```

---

### **Module 3: Building Specialized Agents**

**Purpose:** Create 8 different types of specialized agents.

**8 Agent Types:**

#### **Agent 1: Pong Agent**
- **Purpose:** Learn basic Claude Agent SDK fundamentals
- **Interface:** CLI Script
- **Capabilities:**
  - Basic Claude Agent SDK setup
  - Simple query/response pattern
  - Complete System Prompt override
  - Cost tracking
  - Model selection
- **Run:** `uv run python apps/custom_1_pong_agent/pong_agent.py`

#### **Agent 2: Echo Agent**
- **Purpose:** Custom tool creation with parameters
- **Interface:** CLI Script
- **Capabilities:**
  - ClaudeSDKClient for custom tools
  - echo_tool(message, repeat, transform)
  - Tool use control with allowed_tools
- **Run:** `uv run python apps/custom_2_echo_agent/echo_agent.py`

#### **Agent 3: Calculator Agent**
- **Purpose:** Interactive REPL with session continuity and multiple custom tools
- **Interface:** Interactive REPL
- **Capabilities:**
  - Interactive REPL with conversation memory (resume parameter)
  - Multiple custom tools:
    - custom_math_evaluator(expression, precision)
    - custom_unit_converter(value, from_unit, to_unit)
  - Tool control with allowed_tools and disallowed_tools
- **Run:** `uv run python apps/custom_3_calc_agent/calc_agent.py`

#### **Agent 4: Social Hype Agent**
- **Purpose:** Real-time social media monitoring with AI-powered content analysis
- **Interface:** CLI with args
- **Capabilities:**
  - Real-time Bluesky WebSocket firehose monitoring
  - Keyword-based content filtering (configurable)
  - Claude Agent SDK integration for content summarization
  - Sentiment analysis (positive, negative, neutral)
- **Run:** `uv run python apps/custom_4_social_hype/social_hype.py "keyword1" "keyword2" -n "notification message"`

#### **Agent 5: QA Agent**
- **Purpose:** Specialized REPL for codebase question answering with parallel search
- **Interface:** Interactive REPL
- **Capabilities:**
  - Parallel Task deployment for comprehensive codebase search
  - Interactive REPL with conversation continuity
  - Custom slash command integration (/qa_agent)
  - Rich terminal UI with panels for all message types
  - Controlled tool access (read-only, no editing)
  - Optional MCP server integration (Firecrawl)
  - Session statistics and cost tracking
- **Run:** `uv run python apps/custom_5_qa_agent/qa_agent.py`

#### **Agent 6: Tri-Copy-Writer Agent**
- **Purpose:** Professional copywriting with multiple variations and file context support
- **Interface:** Web application (Vue.js + FastAPI)
- **Capabilities:**
  - Multiple copy variations (1-10 configurable)
  - File context support
  - Web UI for management
- **Run:** `uv run python apps/custom_6_tri_copy_writer/copy_writer.py -v 10`

#### **Agent 7: Micro SDLC Agent**
- **Purpose:** Software Development Life Cycle (SDLC) automation
- **Interface:** CLI + Workflow
- **Capabilities:**
  - Automated SDLC workflows
  - Multi-stage pipeline
  - Git integration
  - Automated testing
- **Run:** `uv run python apps/custom_7_micro_sdlc_agent/sdlc_agent.py`

#### **Agent 8: Ultra Stream Agent**
- **Purpose:** Real-time streaming with ultra-low latency
- **Interface:** CLI + Streaming
- **Capabilities:**
  - Real-time streaming output
  - Ultra-low latency
  - Streaming cancellation
  - Multi-threaded execution
- **Run:** `uv run python apps/custom_8_ultra_stream_agent/ultra_stream.py`

---

### **Module 4: Multi-Agent Orchestration**

**Purpose:** Production-ready orchestration system for managing multiple Claude Code agents.

**Architecture:**
```
multi-agent-orchestration/
├── apps/
│   ├── orchestrator_3_stream/      # Streaming orchestrator
│   └── orchestrator_db/          # Database orchestrator
└── ai_docs/                       # Documentation
```

**Features:**
- 🌐 Real-time web UI with WebSocket streaming
- 🗄️ PostgreSQL database for persistent state
- 🤖 Natural language control via orchestrator agent
- 📊 Comprehensive observability (every event, cost, interaction)
- 💰 Automatic cost tracking (per-agent token usage, USD totals)

**Orchestrator Components:**
1. **Orchestrator Agent:** Manages other agents
2. **Task Queue:** Queue tasks for agents
3. **Result Aggregation:** Combine agent results
4. **State Persistence:** PostgreSQL database
5. **Cost Tracking:** Track token usage and costs
6. **WebSocket Streaming:** Real-time communication
7. **Web UI:** Browser-based control interface

**Quick Start:**
```bash
# 1. Setup database (NeonDB recommended)
uv run apps/orchestrator_db/run_migrations.py

# 2. Configure environment
cp .env.sample .env
# Edit .env with ANTHROPIC_API_KEY and DATABASE_URL

# 3. Start orchestrator
cd apps/orchestrator_3_stream
uv run main.py
```

**How It Works:**
1. User provides natural language task description
2. Orchestrator agent analyzes task
3. Task decomposed into sub-tasks
4. Sub-tasks assigned to specialized agents
5. Agents execute in parallel or sequence
6. Results aggregated and synthesized
7. Final output provided to user
8. All events logged to database
9. Costs tracked and reported

---

### **Module 5: Agent Experts**

**Purpose:** Self-improving agents that learn from experience and update their own capabilities.

**Architecture:**
```
agent-experts/
├── nile/                    # Expert database
│   ├── client/              # Frontend
│   ├── migrations/           # Database migrations
│   └── server/              # Backend
└── apps/
    ├── orchestrator_3_stream/   # Streaming orchestrator
    └── orchestrator_db/           # Database orchestrator
```

**Agent Expert Capabilities:**
- **Self-Improvement:** Learn from successful patterns
- **Knowledge Extraction:** Extract insights from interactions
- **Capability Updates:** Update agent capabilities based on learning
- **Expert Database:** Store and retrieve expert knowledge
- **Continuous Learning:** Improve with each interaction

**How It Works:**
1. Agent executes task
2. Results and feedback captured
3. Success patterns analyzed
4. New capabilities learned
5. Agent updated with new knowledge
6. Expert database updated
7. Next tasks benefit from learning

---

### **Module 6: Orchestrator Agent with ADWs**

**Purpose:** Orchestrator agent that manages AI Developer Workflows (ADW) for complex multi-stage operations.

**Architecture:**
```
orchestrator-agent-with-adws/
├── nile/                    # Expert database
│   ├── client/              # Frontend
│   ├── migrations/           # Database migrations
│   └── server/              # Backend
└── apps/
    ├── orchestrator_3_stream/   # Streaming orchestrator
    ├── orchestrator_db/           # Database orchestrator
    ├── markdown_preview/          # Markdown preview
    └── interactive_file_tree/   # File tree viewer
```

**Orchestrator Capabilities:**
- **Workflow Orchestration:** Manage complex ADW workflows
- **Multi-Agent Coordination:** Coordinate multiple agents
- **State Management:** Track workflow state
- **Error Recovery:** Handle failures gracefully
- **Cost Tracking:** Monitor workflow costs
- **Real-time Streaming:** Stream updates as they happen

**ADW Workflows:**
1. **Feature Implementation:** Implement new features
2. **Bug Fixing:** Debug and fix issues
3. **Code Review:** Review pull requests
4. **Testing:** Run test suites
5. **Deployment:** Deploy to production
6. **Maintenance:** Perform maintenance tasks

**How It Works:**
1. User requests complex task
2. Orchestrator breaks into workflow stages
3. Each stage executed by appropriate ADW
4. ADW may spawn multiple agents
5. Orchestrator coordinates execution
6. Results from each stage aggregated
7. Final output provided
8. All state persisted

---

## 🎯 FUNCTIONAL INTEGRATION

### Discord Bot Commands

The TAC Framework and Agentic Horizon integrate with Discord Bot commands:

```bash
/tac1          # Run TAC-1 programmable agents
/tac2          # Run NLQ-to-SQL
/tac3           # Use slash commands
/tac4           # Use hooks and ADWs
/tac5           # View event analytics
/tac6           # Run ADW automation
/tac7           # Manage git worktrees
/tac8           # Multi-agent applications

/context-engineer # Elite context engineering
/prompt-engineer # Agentic prompt engineering
/build-agents    # Build specialized agents
/agent-swarm    # Multi-agent orchestration
/agent-experts   # Self-improving agents
/orchestrator    # Orchestrator agent with ADWs
```

### Integration with pi-mono

**Act-Learn-Reuse:**
- All TAC lessons learn from execution
- Agentic Horizon strategies stored
- Agent expert knowledge accumulated

**MCP Registry:**
- TAC agents can discover and use MCP tools
- Agentic Horizon orchestrates MCP-enabled agents
- Tool discovery automated

**Expertise System:**
- Context engineering techniques as expertise domains
- Prompt engineering patterns as expertise domains
- Agent specializations as expertise domains

**PAI Integration:**
- TAC lessons can use PAI loops for goal pursuit
- Agentic Horizon orchestrators use PAI inner loop
- Agent experts apply PAI scientific method

---

## 📊 COMPARISON

| Aspect | TAC Framework | Agentic Horizon |
|---------|----------------|------------------|
| Focus | Development workflows | Agent specialization |
| Lessons/Modules | 8 | 6 |
| Primary Use Case | Coding automation | Multi-agent orchestration |
| Complexity | Beginner to Advanced | Advanced to Expert |
| Learning Curve | Medium | High |
| Production-Ready | Yes (TAC-6 onwards) | Yes (all modules) |

---

## 🎓 LEARNING PATH

### Beginner: TAC-1 to TAC-4
1. **TAC-1:** Learn programmable agents
2. **TAC-2:** Build NLQ-to-SQL
3. **TAC-3:** Create slash commands
4. **TAC-4:** Implement hooks and ADWs

### Intermediate: TAC-5 to TAC-7
5. **TAC-5:** Add event analytics
6. **TAC-6:** Build ADW automation
7. **TAC-7:** Manage git worktrees

### Advanced: TAC-8 + Agentic Horizon
8. **TAC-8:** Multi-agent applications
9. **Agentic Horizon Module 1:** Elite context engineering
10. **Agentic Horizon Module 2:** Agentic prompt engineering
11. **Agentic Horizon Module 3:** Build specialized agents
12. **Agentic Horizon Module 4:** Multi-agent orchestration
13. **Agentic Horizon Module 5:** Agent experts
14. **Agentic Horizon Module 6:** Orchestrator agent with ADWs

---

## 🚀 QUICK START EXAMPLES

### Example 1: Programmable Agent (TAC-1)
```bash
# Create programmable agent
cd tac/engineer/tac-agentic-engineer/tac/tac-1
./programmable/programmable.sh

# Output:
# "hello agentic coding"
# "a concise explanation of definition of ai agents"
```

### Example 2: NLQ-to-SQL (TAC-2)
```bash
# Start NLQ-to-SQL app
cd tac/engineer/tac-agentic-engineer/tac/tac-2
./scripts/start.sh

# Then:
# Upload CSV/JSON file
# Type: "Show me all users who signed up last week"
# See generated SQL and results
```

### Example 3: Multi-Agent Orchestration (Agentic Horizon Module 4)
```bash
# Start orchestrator
cd tac/horizon/tac-agentic-horizon/multi-agent-orchestration
cd apps/orchestrator_3_stream

# Configure database
uv run ../orchestrator_db/run_migrations.py

# Start orchestrator
uv run main.py

# Then in web UI:
# "Implement a new feature with multi-agent coordination"
```

### Example 4: Build Custom Agent (Agentic Horizon Module 3)
```bash
# Build custom agent
cd tac/horizon/tac-agentic-horizon/building-specialized-agents

# Build agent 1 (Pong)
uv run python apps/custom_1_pong_agent/pong_agent.py

# Build agent 2 (Echo)
uv run python apps/custom_2_echo_agent/echo_agent.py

# Build agent 5 (QA Agent)
uv run python apps/custom_5_qa_agent/qa_agent.py
```

---

## 📚 DOCUMENTATION FILES

All detailed documentation located in:
```
/home/majinbu/organized/active-projects/pi-mono/packages/discord-bot/src/knowledge/tac/

TAC Framework:
  tac/engineer/tac-agentic-engineer/tac/
  ├── tac-1/README.md
  ├── tac-2/README.md
  ├── tac-3/README.md
  ├── tac-4/README.md
  ├── tac-5/README.md
  ├── tac-6/README.md
  ├── tac-7/README.md
  └── tac-8/ (7 applications)

Agentic Horizon:
  tac/horizon/tac-agentic-horizon/
  ├── agent-experts/README.md
  ├── agentic-prompt-engineering/README.md
  ├── building-specialized-agents/README.md
  ├── elite-context-engineering/README.md
  ├── multi-agent-orchestration/README.md
  └── orchestrator-agent-with-adws/README.md
```

---

**Status:** ✅ TAC Framework & Agentic Horizon fully documented from codebase
