# 🔗 PI-PAI AS PI-MONO EXTENSION - INTEGRATION GUIDE

## Overview

**pi-pai** is now an **extension for pi-mono**, not a standalone repository. It integrates Daniel Miessler's PAI framework with the pi-mono platform's extension system.

## Relationship to pi-mono

```
pi-mono (Core Platform)
  ├── packages/
  │   ├── coding-agent/        # Core AI agent system
  │   ├── discord-bot/         # Discord bot with 81 commands
  │   ├── web-ui/              # Browser-based UI
  │   └── ...                  # Other pi-mono packages
  └── extensions/              # Extensions directory
      ├── @badlogic/pi-mono-pai/  # ⭐ PAI extension
      ├── @badlogic/pi-mono-tui/   # Terminal UI
      └── ...                  # Other extensions

pi-pai (Extension)
  ├── src/
  │   ├── core/               # PAI core algorithms (outer + inner loops)
  │   ├── packs/              # PAI packs (4 skill + 5 system)
  │   ├── ralph/               # Ralph Wiggum integration
  │   └── index.ts            # Extension entry point
  └── package.json             # pi-mono extension manifest
```

## How It Works

### 1. Extension Loading

pi-mono's extension system automatically loads pi-pai:

```json
{
  "pi": {
    "extensions": [
      "./packages/pi-mono-pai/dist/index.js"  // pi-pai extension
    ]
  }
}
```

### 2. PAI Integration

pi-pai's PAI framework integrates with pi-mono's capabilities:

```typescript
// pi-pai extension can use:
// - pi-mono's coding agent
// - Discord bot integration
// - MCP registry and tools
// - Expertise system (Act-Learn-Reuse)
// - Multi-agent coordination (TAC Framework)
// - Observability and monitoring
```

### 3. Discord Bot Commands

pi-pai provides PAI commands to pi-mono Discord bot:

```bash
# PAI commands available in Discord
/pai observe "current state"
/pai plan "current" "desired state"
/pai execute "goal"
/pai status "PAI system status"
/pai learnings "view accumulated learnings"
```

### 4. Ralph Wiggum Integration

pi-pai includes Ralph Wiggum for rapid iteration:

```bash
# Ralph Wiggum via PAI
/pai ralph "simple task" --max-iterations 50
/pai ralph "rapid prototype" --completion-promise "DONE"

# Or use PAI inner loop with Ralph
pai start-loop
ralph-loop --max-iterations 50
```

## Extension Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            PI-PAI EXTENSION ARCHITECTURE          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌───────────┐  │
│  │  PAI Core     │────▶│  pi-mono     │────▶│  Ralph      │  │
│  │  (2 Loops)    │     │  Platform     │     │  (Simple)  │  │
│  │              │     │              │     │             │  │
│  └──────┬───────┘     └──────┬───────┘     └─────┬─────┘  │
│         │                       │                      │          │  │
│         ▼                       ▼                      ▼          │  │
│  ┌───────────────────────────────────────────────┐   │
│  │     INTEGRATION LAYER                    │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  • Discord Bot Commands               │   │
│  │  • CLI Integration                       │   │
│  │  • MCP Registry Access                 │   │
│  │  • Expertise System Sharing             │   │
│  │  • TAC Framework Coordination          │   │
│  └─────────────────────────────────────────────────┘   │
│         │                                              │          │
│  └──────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Benefits of Integration

### For pi-mono Platform
- ✅ PAI framework adds goal pursuit system
- ✅ Scientific method loops improve reliability
- ✅ Ralph Wiggum enables rapid iteration
- ✅ Modular extension architecture

### For pi-pai Extension
- ✅ Access to pi-mono's 81 Discord commands
- ✅ Integration with MCP registry (927 servers)
- ✅ Leverage expertise system (35 domains)
- ✅ Use TAC Framework (8 lessons + Agentic Horizon)
- ✅ Multi-agent coordination capabilities

## Usage Examples

### Discord Bot Commands
```bash
# Use PAI commands in Discord
/pi-pai observe "trading bot current performance"
/pi-pai plan "no trading" "profitable trading system"
/pi-pai execute "build profitable trading bot"

# Combine with other pi-mono capabilities
/pi-pai ralph "test trading strategy" --max-iterations 10
/pi-pai status
```

### CLI Integration
```bash
# Use PAI via pi-mono CLI
pi --extension @badlogic/pi-mono-pai

# Set PAI goal
pai set-goal "Optimize trading bot performance"

# Start PAI loop
pai start-loop

# Check status
pai status
```

### Programmatic Integration
```typescript
import { pai } from '@badlogic/pi-mono-pai';

// Initialize PAI
await pai.initialize();

// Set goal
await pai.outerLoop.identifyGap(
  { description: 'Current: No bot' },
  { description: 'Desired: Trading bot with 10% accuracy' }
);

// Run inner loop
const innerLoop = await pai.startLoop();
console.log('PAI loop result:', innerLoop);
```

## Configuration

### Package.json (Extension Manifest)

```json
{
  "name": "@badlogic/pi-mono-pai",
  "version": "1.0.0",
  "description": "PAI (Personal AI Infrastructure) extension for pi-mono",
  "pi": {
    "extensions": ["./dist/index.js"]
  },
  "keywords": [
    "pi-mono",
    "pai",
    "personal-ai",
    "infrastructure",
    "two-loop",
    "scientific-method",
    "goal-pursuit",
    "learning-system",
    "ralph-wiggum",
    "extension"
  ]
}
```

### Extension Settings

The extension provides settings to configure:

- **PAI Loop Settings:** Outer loop and inner loop configuration
- **Ralph Wiggum Settings:** Max iterations, completion promise
- **Integration Settings:** Discord bot integration, MCP registry access
- **Learning Settings:** Expertise system sharing, Act-Learn-Reuse configuration

## Integration Path

### Step 1: Extension Discovery

pi-mono automatically discovers and loads pi-pai extension:
```json
{
  "pi": {
    "extensions": ["./packages/pi-mono-pai/dist/index.js"]
  }
}
```

### Step 2: Extension Registration

pi-pai registers its capabilities with pi-mono:
- PAI outer loop integration
- PAI inner loop integration
- Ralph Wiggum integration
- Discord bot commands
- MCP registry access

### Step 3: System Integration

pi-pai integrates with pi-mono systems:
- Discord bot (81 commands)
- Expertise system (35 domains)
- MCP registry (927 servers, 13,062 tools)
- TAC Framework (8 lessons + 6 modules)
- Agentic Horizon (6 modules)

## Development Workflow

### Prerequisites

- Node.js 18+
- pi-mono repository
- TypeScript 5.0+
- Access to pi-mono Discord bot (optional for testing)

### Building Extension

```bash
# Clone pi-mono
git clone https://github.com/badlogic/pi-mono.git
cd pi-mono

# Add pi-pai to pi-mono packages
mkdir -p packages/pi-mono-pai
cp -r /path/to/pi-pai/* packages/pi-mono-pai/src/

# Build extension
cd packages/pi-mono-pai
npm install
npm run build

# Use extension
pi --extension @badlogic/pi-mono-pai
```

### Testing Extension

```bash
# Test PAI outer loop
pi --extension @badlogic/pi-mono-pai --test outer-loop

# Test PAI inner loop
pi --extension @badlogic/pi-mono-pai --test inner-loop

# Test Ralph Wiggum
pi --extension @badlogic/pi-mono-pai --test ralph-loop

# Test Discord bot commands
pi --extension @badlogic/pi-mono-pai --test discord-bot
```

## Deployment

### to pi-mono Repository

1. Create a fork of pi-mono
2. Add pi-pai extension to packages/pi-mono-pai/
3. Update documentation
4. Submit Pull Request to pi-mono

### as Standalone Extension

pi-pai can also be used standalone:
```bash
# Install from npm
npm install @badlogic/pi-mono-pai

# Use with pi-mono
pi --extension @badlogic/pi-mono-pai
```

## Documentation

- [Extension Architecture](EXTENSION-ARCHITECTURE.md)
- [Integration Guide](INTEGRATION-GUIDE.md)
- [API Reference](API-REFERENCE.md)
- [Examples](EXAMPLES.md)
- [Migration Guide](MIGRATION-GUIDE.md)

## Contribution Guidelines

### Adding Features

1. Fork pi-mono repository
2. Create feature branch: `feature/add-pai-x`
3. Add new feature to pi-pai extension
4. Update documentation
5. Submit Pull Request

### Code Standards

- Follow pi-mono coding conventions
- Use TypeScript for new code
- Add tests for new features
- Update CHANGELOG.md

### Commit Messages

```
feat: add PAI outer loop integration
feat: add Ralph Wiggum rapid iteration
docs: update integration guide
fix: resolve issue with X
```

## Troubleshooting

### Extension Not Loading

**Check:**
```bash
# Verify extension is in pi-mono packages directory
ls -la /path/to/pi-mono/packages/pi-mono-pai/

# Check pi.json includes extension
cat /path/to/pi-mono/.pi/packages.json

# Test extension loading
pi --extension @badlogic/pi-mono-pai --test
```

### Discord Commands Not Available

**Check:**
```bash
# Verify Discord bot is running
pi status discord-bot

# Check commands are registered
pi list commands | grep pai

# Test command
/pai status
```

### MCP Registry Access

**Check:**
```bash
# Verify MCP registry is accessible
pi mcp list | head -10

# Test MCP access
pi mcp test --name "brave-search"
```

## Support

### Documentation
- [pi-mono README](https://github.com/badlogic/pi-mono#readme)
- [pi-mono Discord Bot Docs](https://github.com/badlogic/pi-mono/blob/main/packages/discord-bot/README.md)
- [pi-mono Extensions Guide](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
- [PAI Framework](https://github.com/danielmiessler/Personal_AI_Infrastructure)
- [Ralph Wiggum](https://ghuntley.com/ralph/)

### Issues
- [pi-mono Issues](https://github.com/badlogic/pi-mono/issues)
- [pi-pai Issues](https://github.com/badlogic/pi-mono-pai/issues)

---

## Summary

**pi-pai is now a full-featured extension for pi-mono platform** that provides:

- ✅ PAI framework integration (two-loop architecture)
- ✅ Ralph Wiggum rapid iteration
- ✅ Discord bot commands (81 available)
- ✅ MCP registry access (927 servers)
- ✅ Expertise system sharing (35 domains)
- ✅ TAC Framework coordination
- ✅ Agentic Horizon support
- ✅ Act-Learn-Reuse compound learning
- ✅ Multi-agent orchestration

**Result:** A complete goal pursuit and learning system integrated into the pi-mono platform!

---

## Quick Start

```bash
# 1. Install extension to pi-mono
npm install @badlogic/pi-mono-pai

# 2. Use PAI commands
pi --extension @badlogic/pi-mono-pai

# 3. Or use via Discord bot
/pai status

# 4. View documentation
cat packages/pi-mono-pai/README.md
```

---

## Repository

**pi-mono Platform:** https://github.com/badlogic/pi-mono
**pi-pai Extension:** https://github.com/badlogic/pi-mono-pai

**License:** MIT (both pi-mono and pi-pai)
