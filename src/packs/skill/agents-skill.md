# Agents Skill Pack

## Overview
Multi-agent coordination skill for pi-mono ecosystem.

## Triggers
- "create agent"
- "swarm agents"
- "coordinate agents"
- "multi-agent"

## Capabilities

### Agent Creation
```typescript
// Create specialized agent
const agent = await pai.createAgent({
  name: 'trading-analyst',
  role: 'analyzer',
  skills: ['market-analysis', 'risk-assessment']
});
```

### Agent Swarming
```typescript
// Swarm multiple agents
const swarm = await pai.swarmAgents({
  task: 'Comprehensive market analysis',
  agents: ['researcher', 'analyzer', 'reporter'],
  coordination: 'parallel'
});
```

### Agent Coordination
```typescript
// Coordinate agent execution
await pai.coordinateAgents({
  agents: ['agent-1', 'agent-2'],
  workflow: 'sequential',
  resultsAggregation: true
});
```

## Integration with pi-mono
- TAC Lesson 8: Multi-agent architecture
- Discord Bot: `/agent swarm` command
- Agentic Horizon: Agent orchestration

## Installation
```bash
# Copy skill to pi-mono
cp src/packs/skill/agents-skill.md /home/majinbu/organized/active-projects/pi-mono/packages/discord-bot/src/skills/

# Register in Discord bot
/discord reload-skills
```
