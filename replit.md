# Parkour Realms - 3D Parkour Game

## Overview

Parkour Realms is a browser-based 3D parkour game built with React, Three.js, and TypeScript. Players navigate through 5 challenging realms filled with obstacles, traps, and hazards before facing a dragon boss battle. The game features real-time physics, collision detection, particle effects, and immersive audio.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for component-based UI
- **React Three Fiber** (@react-three/fiber) for 3D rendering and Three.js integration
- **React Three Drei** (@react-three/drei) for additional 3D utilities
- **Zustand** for state management (game state, audio controls)
- **Tailwind CSS** with **Radix UI** components for styling and UI elements
- **Vite** as the build tool and development server

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** structure (routes prefixed with `/api`)
- **In-memory storage** for user data (with interface for future database integration)
- **Session-based architecture** with connect-pg-simple for session storage

### 3D Game Engine
- **Custom game engine** built on Three.js with modular components:
  - **PlayerController**: Handles player movement, jumping, and shooting
  - **RealmManager**: Manages level generation and environmental hazards
  - **Dragon**: Boss enemy with AI and attack patterns
  - **CollisionDetector**: AABB collision detection system
  - **ParticleSystem**: Visual effects for explosions and impacts

## Key Components

### Game Systems
1. **Game State Management**: Zustand stores for game phase, player health, and realm progression
2. **Audio System**: Background music, sound effects, and mute controls
3. **Physics Engine**: Custom collision detection and response system
4. **Particle Effects**: Dynamic visual feedback for gameplay events
5. **Realm System**: 6 unique levels with different mechanics and hazards

### UI Components
- **Game Canvas**: Full-screen 3D rendering surface
- **Game UI**: HUD elements showing health, realm info, and controls
- **Interface**: Menu system, game over screens, and victory conditions
- **Radix UI Components**: Comprehensive UI component library for dialogs, buttons, etc.

### 3D Assets
- **GLTF Models**: 3D models for game objects (heart.gltf for health pickups)
- **Shader Support**: GLSL shader integration via vite-plugin-glsl
- **Font Assets**: Inter font for UI text rendering

## Data Flow

1. **Game Initialization**: Canvas setup → Game engine creation → Asset loading
2. **Game Loop**: Input handling → Physics update → Collision detection → Rendering
3. **State Updates**: Zustand stores → React components → UI updates
4. **Realm Progression**: Collision with doors → Realm transition → New level setup
5. **Boss Battle**: Special mechanics for dragon fight with projectiles and health systems

## External Dependencies

### Core Framework
- **React 18** with React Three Fiber for 3D rendering
- **Three.js** ecosystem (@react-three/drei, @react-three/postprocessing)
- **TypeScript** for type safety across client and server

### State Management & Data
- **Zustand** for client-side state management
- **TanStack Query** for server state management
- **Drizzle ORM** with PostgreSQL schema (configured but using memory storage)

### UI & Styling
- **Tailwind CSS** for utility-first styling
- **Radix UI** comprehensive component library
- **Lucide React** for icons

### Development Tools
- **Vite** for fast development and building
- **ESBuild** for server-side bundling
- **PostCSS** with Autoprefixer

## Deployment Strategy

### Production Build
- **Client**: Vite builds to `dist/public` directory
- **Server**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Large 3D models and audio files supported via Vite configuration

### Environment Setup
- **Node.js 20** runtime
- **Replit deployment** with autoscale configuration
- **Port 5000** for local development, mapped to port 80 in production
- **Environment variables**: DATABASE_URL for PostgreSQL connection

### Development Workflow
- **npm run dev**: Starts development server with hot reloading
- **npm run build**: Creates production build
- **npm run start**: Runs production server
- **npm run db:push**: Pushes schema changes to database

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```