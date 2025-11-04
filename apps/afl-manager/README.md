# AFL Manager

A football manager game for Australian Rules Football (AFL), built with SvelteKit and Svelte 5.

## Features

- **18 AFL Teams**: Manage any of the 18 official AFL teams with authentic colors and branding
- **Player Management**: Deep player system with 8 key attributes (kicking, marking, handballing, tackling, speed, endurance, strength, agility)
- **Match Simulation**: Realistic match engine simulating quarter-by-quarter gameplay
- **Season Mode**: Full 23-round season with ladder standings and percentage calculations
- **Tactics System**: Customize your team's playing style:
  - Game Style (Attacking/Balanced/Defensive)
  - Forward Pressure (High/Medium/Low)
  - Ball Movement (Fast/Controlled/Slow)
  - Defending Style (Zone/Hybrid/Man-on-Man)
- **Player Statistics**: Track form, fitness, injuries, games played, goals, behinds, disposals, marks, and tackles
- **Interactive Dashboard**: Multiple views for team management, tactics, and league standings

## Getting Started

### Development

```bash
npm install --legacy-peer-deps
npm run dev
```

### Building

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## How to Play

1. **Select Your Team**: Start by managing one of the 18 AFL teams (Adelaide Crows by default)
2. **Review Your Squad**: Check the "My Team" tab to see all players, their stats, form, and fitness
3. **Set Tactics**: Use the "Tactics" tab to customize your team's playing style
4. **Simulate Rounds**: Click the "Simulate Round" button to progress through the season
5. **Track Progress**: Monitor the ladder and your team's performance throughout the 23-round season
6. **New Season**: Once complete, start a new season and try again!

## Technology Stack

- **SvelteKit** - Full-stack framework
- **Svelte 5** - Reactive UI with new runes syntax
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool

## Project Structure

```
apps/afl-manager/
├── src/
│   ├── lib/
│   │   ├── components/     # UI components
│   │   ├── data/           # Team and player data
│   │   ├── engine/         # Match simulation engine
│   │   ├── stores/         # Game state management
│   │   └── types/          # TypeScript definitions
│   └── routes/             # SvelteKit routes
```

## License

MIT
