# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorldX is a browser-based 4X strategy game written in vanilla JavaScript. Players control a nation and compete against AI opponents by developing five core statistics: Military, Social, Culture, Science, and Economy. The game features dynamic events, economic systems, military combat, and infrastructure development.

## How to Run

1. Open `index.html` in a web browser
2. The game runs entirely client-side with no build step required
3. External dependencies are loaded via CDN: GSAP, Chart.js, and Pixi.js

## Architecture

### Core Game Loop
- **Main Entry**: `js/main.js` - Initializes WorldxGame class
- **Game Loop**: `js/core/GameLoop.js` - Manages game timing (days/weeks)
- **Time System**: Game progresses in days (1-7) within weeks, with major updates happening weekly

### Core Systems
- **Country Management**: `js/core/CountryManager.js` - Central hub that delegates to specialized managers
- **Economic Ministry**: `js/core/EconomicMinistry.js` - Handles industries, infrastructure, and investments
- **Military System**: `js/core/MilitaryManager.js` + `js/core/BattleManager.js` - Army management and combat
- **Event System**: `js/core/EventSystem.js` + `js/data/events/` - Dynamic events affecting gameplay
- **AI Controller**: `js/core/AIController.js` - AI decision-making for opponent countries

### UI Architecture
- **UIManager**: `js/ui/UIManager.js` - Coordinates all UI modules
- **Modular UI**: `js/ui/modules/` - Specialized UI components (Development, War Ministry, Economic Ministry, etc.)
- **Event Modal**: `js/ui/EventModal.js` - Handles event presentation to players

### Data Generation
- **Countries**: `js/data/CountryGenerator.js` - Procedural country generation
- **Events**: `js/data/events/` - Modular event system with different event types
- **Utilities**: `js/utils/` - Math and random utility functions

## Key Gameplay Systems

### Economic System
- Countries have money, income from taxes, and army maintenance costs
- **Industries**: 5 types (Basic, Advanced, Cultural, Military, Tech) with upgrade levels
- **Infrastructure**: 5 types (Roads, Ports, Universities, Hospitals, Banks) with synergy bonuses
- **Investments**: Bonds, Development Funds, Emergency Reserves with interest returns
- **Dynamic Costs**: Prices increase over time to maintain challenge

### Military System
- Army size limited to 40% of population
- Experience levels (1-10) act as power multipliers
- Combat based on army size × experience + bonuses
- Post-battle options: Loot, Raze, or Conquer

### Event System
- 7 event types: Crisis, Inspiration, Development, Military, Economic, Industry, Infrastructure
- Events have conditions, effects, and durations
- Financial events affect investment returns with multipliers

## Development Patterns

### Adding New Features
1. **Core Logic**: Add to appropriate manager in `js/core/`
2. **UI Components**: Create module in `js/ui/modules/` or extend existing
3. **Data/Events**: Add to `js/data/events/` following existing patterns
4. **Integration**: Update `CountryManager.js` to delegate to new systems

### Event System
- Events are modular in `js/data/events/`
- Each event file exports arrays of event objects
- Events have: id, name, description, type, effects, conditions, duration
- Use `EventManager.js` to coordinate event generation

### UI Updates
- UIManager delegates to specialized modules
- Always update displays after game state changes
- Use `updateDisplay()` to refresh entire UI
- Specific panels have dedicated update methods

## Common Tasks

### Adding New Industries/Infrastructure
1. Update `EconomicMinistry.js` with new type definitions
2. Add costs, benefits, and descriptions
3. Update UI in `UIEconomicMinistry.js`
4. Add to HTML structure in `index.html`

### Creating New Events
1. Add event objects to appropriate file in `js/data/events/`
2. Follow existing pattern: conditions, effects, rarity
3. Events automatically integrate through `EventManager.js`

### Military Features
1. Core logic in `MilitaryManager.js` and `BattleManager.js`
2. UI updates in `UIWarMinistry.js`
3. Bonuses and calculations in `MilitaryBonusManager.js`

## File Loading Order

The game loads scripts in dependency order (see `index.html`):
1. Utilities and data structures
2. Event system modules
3. Core game systems
4. UI modules
5. Main game initialization

## Technical Notes

- No build system - all JavaScript is vanilla ES6+
- Game state is managed in-memory with localStorage saves
- Time progression: 1000ms = 1 day, 7 days = 1 week
- Economic calculations happen every second, game logic every day/week
- AI makes decisions weekly alongside other major updates

## State Management

- **Game State**: Centralized in `WorldxGame` class
- **Country Data**: Managed by `CountryManager` with economic data in `economicData` property
- **UI State**: Distributed across UI modules, coordinated by `UIManager`
- **Events**: Tracked in `EventSystem` with active effects

## Performance Considerations

- Game loop runs at 60fps but only updates game logic at specified intervals
- Economic calculations are optimized for real-time updates
- UI updates are batched and only triggered when necessary
- Event generation is throttled to prevent spam