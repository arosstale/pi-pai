# PAI Architecture

## Overview

PAI (Personal AI Infrastructure) is a two-loop system for pursuing goals:

1. **Outer Loop**: Where You Are → Where You Want To Be
2. **Inner Loop**: The Scientific Method (7 phases)

## Core Components

### 1. Outer Loop

**Purpose:** Identify gaps between current and desired states

**Process:**
- Observe current state
- Define desired state
- Calculate gap distance
- Assess priority
- Generate strategies

**Classes:**
- `OuterLoop` - Main outer loop implementation
- `CurrentState` - Current state interface
- `DesiredState` - Desired state interface
- `Gap` - Gap analysis result

### 2. Inner Loop

**Purpose:** Iteratively close the gap using scientific method

**Process (7 phases):**
1. **OBSERVE** - Gather context
2. **THINK** - Generate ideas
3. **PLAN** - Design experiment
4. **DEFINE** - Set success criteria
5. **EXECUTE** - Run plan
6. **MEASURE** - Collect results
7. **LEARN** - Refine for next iteration

**Classes:**
- `InnerLoop` - Main inner loop implementation
- `InnerLoopContext` - Loop state management
- `InnerLoopPhase` - Phase type definitions

### 3. Integration Layer

**Purpose:** Connect PAI to pi-mono ecosystem

**Integrations:**
- **Discord Bot** - Interactive commands
- **TAC Framework** - Agent capabilities
- **MCP Registry** - Tool discovery

**Classes:**
- `PAIDiscordIntegration` - Discord bot integration
- `TACPAIIntegration` - TAC framework integration
- `MCPRegistryIntegration` - MCP registry integration

## Pack System

### Skill Packs
AI-invoked capabilities triggered by keywords:
- `agents-skill` - Multi-agent coordination
- `browser-skill` - Web automation
- `prompting-skill` - Advanced prompting
- `art-skill` - AI art generation

### System Packs
Human-installed infrastructure running in background:
- `core-install` - PAI core infrastructure
- `history-system` - Memory and context
- `hook-system` - Pre/post execution hooks
- `observability-server` - Monitoring and analytics
- `voice-system` - Voice interaction

## Data Flow

```
User Request
    ↓
Discord Bot Command
    ↓
PAI Outer Loop (gap analysis)
    ↓
PAI Inner Loop (scientific method)
    ↓
Execute Plan
    ↓
Measure Results
    ↓
Learn & Update
    ↓
Act-Learn-Reuse (compound learning)
    ↓
Expertise System (knowledge graph)
```

## pi-mono Integration

### Shared Infrastructure
- **Act-Learn-Reuse** - PAI learnings stored
- **MCP Registry** - Tool discovery
- **Expertise System** - Knowledge domains
- **TAC Framework** - Agent capabilities

### Discord Bot Commands
- `/pai observe` - Observe current state
- `/pai plan` - Plan transition
- `/pai execute` - Execute plan
- `/pai learn` - Learn from results
- `/pai status` - View PAI status

### TAC Framework Integration
- PAI loops available to all TAC agents
- Goal pursuit in programmable agents
- Multi-agent coordination with PAI
- Act-Learn-Reuse from PAI learnings

## Scalability

PAI is designed for:
- **Personal goals** - Individual pursuits
- **Team goals** - Collaborative objectives
- **Organizational goals** - Company-wide initiatives
- **Civilizational goals** - Long-term progress

Each scale follows the same two-loop pattern.
