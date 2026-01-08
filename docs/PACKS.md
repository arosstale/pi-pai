# PAI Pack System

## Overview

PAI packs are self-contained modules that add specific capabilities to your AI system.

## Pack Types

### Skill Packs
AI-invoked capabilities triggered by keywords:
- Agents-skill: Multi-agent coordination
- Browser-skill: Web automation
- Prompting-skill: Advanced prompting
- Art-skill: AI art generation

### System Packs
Human-installed infrastructure running in background:
- Core-install: PAI core infrastructure
- History-system: Memory and context
- Hook-system: Pre/post execution hooks
- Observability-server: Monitoring and analytics
- Voice-system: Voice interaction

## Installing Packs

### Skill Packs

```bash
# Copy skill to Discord bot
cp src/packs/skill/agents-skill.md /path/to/discord-bot/skills/

# Reload skills
/discord reload-skills
```

### System Packs

```bash
# Run pack installation script
cd src/packs/system/core-install
./install.sh

# Enable and start service
systemctl enable pai-core.service
systemctl start pai-core.service

# Verify installation
pai status
```

## Creating Custom Packs

### Skill Pack Structure

```
my-skill.md
├── Overview
├── Triggers
├── Capabilities
├── Code examples
└── Installation steps
```

### System Pack Structure

```
my-system/
├── src/
│   ├── core.ts
│   └── server.ts
├── install.sh
├── config.json
└── README.md
```

## Pack Registry

View available packs:
```bash
pai packs list
pai packs search "keyword"
pai packs show pack-name
```

Install pack:
```bash
pai packs install pack-name
```

## Contributing Packs

1. Create pack following structure
2. Test thoroughly
3. Submit PR to pi-pai repository
4. Get reviewed and merged
