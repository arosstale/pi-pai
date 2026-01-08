# Browser Skill Pack

## Overview
Web automation and scraping skill for pi-mono ecosystem.

## Triggers
- "scrape website"
- "browse to"
- "automate browser"
- "extract web data"

## Capabilities

### Web Scraping
```typescript
// Scrape website
const data = await pai.scrapeWebsite({
  url: 'https://example.com',
  selector: '.content',
  format: 'json'
});
```

### Browser Automation
```typescript
// Automate browser actions
await pai.automateBrowser([
  { action: 'navigate', url: 'https://example.com' },
  { action: 'click', selector: '#button' },
  { action: 'extract', selector: '.data' }
]);
```

### Content Extraction
```typescript
// Extract specific content
const content = await pai.extractContent({
  url: 'https://example.com',
  elements: ['h1', '.description', 'article']
});
```

## Integration with pi-mono
- MCP Registry: Browser tools discovery
- Discord Bot: `/browse` command
- Brave Search Skill: Web search integration

## Installation
```bash
# Copy skill to pi-mono
cp src/packs/skill/browser-skill.md /home/majinbu/organized/active-projects/pi-mono/packages/discord-bot/src/skills/

# Register in Discord bot
/discord reload-skills
```
