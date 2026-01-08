# 📋 AWESOME-PI-AGENT INTEGRATION GUIDE

## Overview

**Purpose:** Integrate awesome-pi-agent ecosystem into pi-pai extension

**awesome-pi-agent Repository:** https://github.com/qualisero/awesome-pi-agent
**Type:** Resource Hub for pi-mono extensions

---

## 🔄 WHAT AWESOME-PI-AGENT PROVIDES

### Ecosystem Hub
- ✅ 30+ Extensions catalogued
- ✅ 15+ Skills documented
- ✅ MCP Servers listed
- ✅ Tools & Utilities categorized
- ✅ Prompt Templates collection
- ✅ Themes documentation
- ✅ Providers & Integrations
- ✅ Examples & Recipes

### Categorization

**Extensions:**
- Cloud research agents
- Dotfiles with pi agent configuration
- User extensions and configuration examples
- pi-agent-scip - SCIP code intelligence
- pi-hooks - Minimal reference extensions
- pi-interview-tool - Web-based form tool
- pi-rewind-hook - Rewind file changes with git
- rhubarb-pi - Collection of small extensions
- background-notify - Notifications when tasks complete
- session-emoji - AI-powered emoji in footer
- session-color - Colored band to visually distinguish sessions
- safe-git - Require approval before dangerous git operations

**Skills:**
- pi-skills - Community skills collection
  - brave-search - Web search and content extraction via Brave Search API
  - browser-tools - Interactive browser automation via Chrome DevTools Protocol
  - gccli - Google Calendar CLI for events and availability
  - gdcli - Google Drive CLI for file management and sharing
  - gmcli - Gmail CLI for email, drafts, and labels
  - transcribe - Speech-to-text transcription via Groq Whisper API
  - vscode - VS Code integration for diffs and file comparison
  - youtube-transcript - Fetch YouTube video transcripts

**Tools & Utilities:**
- codemap - Compact, token-aware codebase maps for LLMs and coding agents

**Themes:**
- No community themes yet (contributions welcome)

**Prompt Templates:**
- No community prompt templates yet (contributions welcome)

**Providers & Integrations:**
- pi-acp - ACP adapter for pi agent
- pi-config - Project config example

**Examples & Recipes:**
- crossjam/mpr - Context and writeups referencing pi agent

---

## 🚀 HOW TO USE WITH PAI

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
/pai ralph "Build a REST API" --max-iterations 50

# Start from a prompt file
/pai ralph --file PROMPT.md --max-iterations 20

# Cancel active loop
/cancel-ralph

# Use with awesome-pi-agent resources
/pai ralph "Use browser-tools to scrape website" --awesome-extension "browser-tools"
/pai ralph "Optimize database queries" --awesome-tool "database MCP"
```

#### Using Damage Control (Security)
```bash
# Enable damage control
/pai damage-control enable

# Test a dangerous command
/pai damage-control test "rm -rf /test"

# Add protected path
/pai damage-control add-path "~/.ssh" "zero-access"

# List protected paths
/pai damage-control list-paths
```

---

## 📚 AWESOME-PI-AGENT COMMANDS

### Search Commands
```bash
# Search for extensions
/awesome search "extensions" --limit 10

# Filter by category
/awesome search "extensions" --category "database"

# List all available
/awesome list

# Browse catalog
/awesome browse

# Get extension details
/awesome get "extension-name"
```

### Integration Commands
```bash
# List all extensions
/awesome list

# List all skills
/awesome list-skills

# List all tools
/awesome list-tools

# List all providers
/awesome list-providers

# List all themes
/awesome list-themes

# List all prompt templates
/awesome list-prompt-templates

# List all examples
/awesome list-examples
```

---

## 🎯 USE CASES

### Use Case 1: Find Extensions
```bash
# Search for database extensions
/awesome search "extensions" --category "database"

# Get details
/awesome get "database extension name"

# Use with PAI
/pai observe "Need database extension with indexing capabilities"
/pai plan "current state" "desired state: Have database extension"
/pai execute "Install and test database extension"
/pai measure "extension performance metrics"
/pai learn "Database extension patterns for future reference"
```

### Use Case 2: Use Skills
```bash
# Browse available skills
/awesome browse

# Use browser-tools skill
/pai ralph "Implement web scraping with browser-tools" --awesome-skill "browser-tools"

# Use brave-search skill
/pai ralph "Add web search to application" --awesome-skill "brave-search"
```

### Use Case 3: Use Tools
```bash
# Search for optimization tools
/awesome search "tools" --query "optimization"

# Use codemap tool
/pai ralph "Create token-aware codebase map" --awesome-tool "codemap"

# Use database MCP tools
/pai ralph "Optimize database queries" --awesome-tools "database MCP"
```

---

## 📚 DOCUMENTATION

### awesome-pi-agent Documentation
- [awesome-pi-agent README](https://github.com/qualisero/awesome-pi-agent#readme)
- [Contributing Guidelines](https://github.com/qualisero/awesome-pi-agent#contributing)
- [Extension Examples](https://github.com/qualisero/awesome-pi-agent#examples)
- [Recipes](https://github.com/qualisero/awesome-pi-agent#examples)

### Integration Documentation
- [Extension Discovery Guide](docs/extension-discovery.md)
- [Skill Search Guide](docs/skill-search.md)
- [Tool Discovery Guide](docs/tool-discovery.md)

---

## 🔗 INTEGRATION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│         PI-PAI + AWESOME-PI-AGENT INTEGRATION         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌───────────┐  │
│  │  PAI Loops    │────▶│  Ralph Loop   │────▶│ Damage Ctl │  │
│  │  (Scientific)  │     │  (Simple)     │     │  (Security)  │  │
│  └──────┬───────┘     └──────┬───────┘     └─────┬─────┘  │
│         │                       │                      │          │  │
│         ▼                       ▼                      ▼          │  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           AWESOME-PI-AGENT ECOSYSTEM          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  • Extension Discovery (30+ catalogued)     │   │
│  │  • Skill Search & Filtering                 │   │
│  │  • Tool Discovery & Filtering                 │   │
│  │  • Provider Listings                        │   │
│  │  • Examples & Recipes                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 FEATURES

### PAI Features
- ✅ Two-loop architecture (Outer + Inner)
- ✅ 7-phase scientific method
- ✅ Goal pursuit system
- ✅ Strategy generation

### Ralph Wiggum Features
- ✅ Simple iteration loop
- ✅ Completion promise detection
- ✅ Iteration counter and status bar
- ✅ Error recovery

### Damage Control Features
- ✅ 100+ protection patterns
- ✅ Three protection levels
- ✅ Pattern-based command detection
- ✅ Path protection

### awesome-pi-agent Integration Features
- ✅ Extension discovery (30+ catalogued)
- ✅ Skill search and filtering
- ✅ Tool discovery and filtering
- ✅ Provider listings
- ✅ Categorization and metadata

---

## 📈 BENEFITS

### Compound Learning
- PAI iterations improve system
- Ralph iterations provide rapid feedback
- awesome-pi-agent resources multiply capabilities
- Combined: 1 + 1 + 1 = 10 (knowledge compounds)

### Extensibility
- 30+ extensions available
- 15+ skills documented
- MCP servers and tools
- Providers and integrations
- Categorized and searchable

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

#### Using awesome-pi-agent Resources
```bash
# Search for extensions
/awesome search "extensions" --limit 10

# List all available
/awesome list

# Browse catalog
/awesome browse
```

#### Combined Usage (PAI + awesome-pi-agent)
```bash
# Use PAI with awesome-pi-agent resources
/pai observe "current state"
/pai plan "current" "desired state: Use database extension from awesome-pi-agent"
/pai ralph "Implement database extension" --awesome-extension "database extension name"
/pai execute "Install and test extension"

# Use Ralph with awesome-pi-agent resources
/pai ralph "Use browser-tools to scrape website" --awesome-skill "browser-tools"

# Use Damage Control always
/pai damage-control enable
```

---

## 📚 DOCUMENTATION

### Integration Documentation
- [awesome-pi-agent Integration Guide](docs/awesome-pi-agent-integration.md)
- [Extension Discovery](docs/extension-discovery.md)
- [Skill Search](docs/skill-search.md)
- [Tool Discovery](docs/tool-discovery.md)

### awesome-pi-agent Documentation
- [awesome-pi-agent README](https://github.com/qualisero/awesome-pi-agent)
- [Contributing](https://github.com/qualisero/awesome-pi-agent#contributing)

---

## 📄 LICENSE

MIT License - Compatible with pi-mono

---

## 📊 REPOSITORY

**pi-mono Platform:** https://github.com/badlogic/pi-mono
**pi-pai Extension:** https://github.com/arosstale/pi-pai
**awesome-pi-agent:** https://github.com/qualisero/awesome-pi-agent

---

## 🎉 SUMMARY

**pi-pai** is a comprehensive extension for **pi-mono** platform that provides:

- ✅ **PAI (Personal AI Infrastructure)** - Daniel Miessler's framework
- ✅ **Ralph Wiggum** - Simple iteration technique
- ✅ **Damage Control** - Security protection
- ✅ **awesome-pi-agent Integration** - Ecosystem resource hub

**Result:** A complete Personal AI Infrastructure extension integrated with awesome-pi-agent ecosystem!
