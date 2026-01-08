# Art Skill Pack

## Overview
AI art generation skill for pi-mono ecosystem.

## Triggers
- "generate art"
- "create image"
- "ai art"
- "visualize"

## Capabilities

### Image Generation
```typescript
// Generate AI art
const image = await pai.generateArt({
  prompt: 'A futuristic city at sunset',
  style: 'digital-painting',
  dimensions: '1024x1024'
});
```

### Style Transfer
```typescript
// Apply style transfer
const styled = await pai.styleTransfer({
  image: 'source.jpg',
  style: 'van-gogh',
  strength: 0.8
});
```

### Image Editing
```typescript
// Edit generated art
const edited = await pai.editArt({
  image: 'generated.png',
  edits: ['add:mountains', 'remove:buildings'],
  style: 'consistent'
});
```

## Integration with pi-mono
- Fal.ai Skill: Image generation backend
- Discord Bot: `/art` command
- Art Skill: Visual content creation

## Installation
```bash
# Copy skill to pi-mono
cp src/packs/skill/art-skill.md /home/majinbu/organized/active-projects/pi-mono/packages/discord-bot/src/skills/

# Register in Discord bot
/discord reload-skills
```
