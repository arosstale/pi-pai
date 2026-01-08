# 📋 PI-PAI ARCHITECTURE

## Overview

**pi-pai** is a standalone Personal AI Infrastructure implementation based on Daniel Miessler's PAI framework.

## Core System

```
┌─────────────────────────────────────────┐
│         PAI SYSTEM ARCHITECTURE      │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐     ┌───────────┐   │
│  │  Outer Loop  │────▶│  Inner Loop │   │
│  │              │     │             │   │
│  └──────┬───────┘     └─────┬─────┘   │
│         │                       │          │
│         ▼                       ▼          │
│  ┌───────────────────────────────┐   │
│  │      PAI Core Engine          │   │
│  ├───────────────────────────────┤   │
│  │  • Goal Management               │   │
│  │  • Gap Analysis                 │   │
│  │  • Strategy Generation           │   │
│  │  • Iteration Tracking            │   │
│  │  • Learning System               │   │
│  └───────────────────────────────┘   │
│         │                                  │
└─────────────────────────────────────┘
```

## Components

### 1. Outer Loop System

**File:** `src/core/outer-loop.ts`

**Purpose:** Identify the gap between current and desired state.

**Classes:**
- `OuterLoop` - Main outer loop implementation
- `CurrentState` - Current state interface
- `DesiredState` - Desired state interface
- `Gap` - Gap analysis result

**Methods:**
- `identifyGap(current, desired)` - Calculate gap
- `generateStrategies(gap)` - Create strategies
- `assessPriority(gap)` - Determine urgency

### 2. Inner Loop System

**File:** `src/core/inner-loop.ts`

**Purpose:** Iteratively close the gap using the scientific method.

**Classes:**
- `InnerLoop` - Main inner loop implementation
- `InnerLoopContext` - Loop state management
- `InnerLoopPhase` - Phase type (7 phases)

**Phases:**
1. **OBSERVE** - Gather context
2. **THINK** - Generate ideas
3. **PLAN** - Design experiment
4. **DEFINE** - Set success criteria
5. **EXECUTE** - Run the plan
6. **MEASURE** - Collect results
7. **LEARN** - Refine for next iteration

**Methods:**
- `observe(observations)` - Collect context
- `think(hypotheses)` - Generate ideas
- `plan(plan)` - Design experiment
- `define(criteria)` - Set success criteria
- `execute(results)` - Run plan
- `measure(measurements)` - Collect results
- `learn(learnings)` - Refine approach

### 3. Pack System

**Purpose:** Modular capabilities

**Location:** `src/packs/`

**Skill Packs:**
- `agents-skill.md` - Multi-agent coordination
- `browser-skill.md` - Web automation
- `prompting-skill.md` - Advanced prompting
- `art-skill.md` - AI art generation

**System Packs:**
- `core-install.md` - PAI core infrastructure
- `history-system.md` - Memory and context
- `hook-system.md` - Pre/post execution hooks
- `observability-server.md` - Monitoring and analytics
- `voice-system.md` - Voice interaction
