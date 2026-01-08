# pi-pai

## Personal AI Infrastructure (PAI) for pi-mono Ecosystem

**Ported from:** [Daniel Miessler's Personal_AI_Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure)

## Overview

**pi-pai** is a Personal AI Infrastructure ported and optimized for the [pi-mono](https://github.com/badlogic/pi-mono) ecosystem. It provides a complete AI-powered operating system with two-loop architecture and modular packs.

### What is PAI?

PAI is an open-source infrastructure for building your own AI-powered system. One that knows your goals, learns from your history, and gets better at helping you over time.

### The Two Loops

**Outer Loop:** Where You Are → Where You Want to Be
- Current state → Desired state → Gap closure

**Inner Loop:** The Scientific Method (7 phases)
1. OBSERVE - Gather context
2. THINK - Generate ideas
3. PLAN - Design experiment
4. DEFINE - Set success criteria
5. EXECUTE - Run the plan
6. MEASURE - Collect results
7. LEARN - Refine for next iteration

## Integration with pi-mono

**pi-pai** integrates seamlessly with:
- **TAC Framework** - Programmable agents
- **Agentic Horizon** - Multi-agent orchestration
- **Discord Bot** - Interactive interface
- **MCP Registry** - Tool discovery
- **Act-Learn-Reuse** - Compound learning

## Architecture

```
pi-mono/
└── packages/
    └── pai/
        ├── src/
        │   ├── core/           # PAI core algorithms
        │   ├── loops/          # Outer and inner loops
        │   ├── packs/          # Modular capabilities
        │   └── integration/    # pi-mono integration
        ├── skills/             # PAI skills
        └── tools/             # PAI tools
```

## Available Packs

### Skill Packs (AI-invoked)
- **agents-skill** - Multi-agent coordination
- **art-skill** - AI art generation
- **browser-skill** - Web automation
- **prompting-skill** - Advanced prompting

### System Packs (Human-installed)
- **core-install** - PAI core infrastructure
- **history-system** - Memory and context
- **hook-system** - Pre/post execution hooks
- **observability-server** - Voice interaction

## Quick Start

```bash
# Clone the repository
git clone https://github.com/arosstale/pi-pai.git
cd pi-pai

# Install dependencies
npm install

# Run PAI core
npm start

# Use with pi-mono Discord bot
/discord ask "What's my current state?"
/discord plan "Achieve goal X"
```

## Documentation

- [PAI Architecture](docs/ARCHITECTURE.md)
- [Pack System](docs/PACKS.md)
- [Integration Guide](docs/INTEGRATION.md)
- [Development](docs/DEVELOPMENT.md)

## License

MIT License - Same as original PAI project

## Credits

- **Original:** [Daniel Miessler](https://github.com/danielmiessler)
- **Ported for pi-mono:** [arosstale](https://github.com/arosstale)
