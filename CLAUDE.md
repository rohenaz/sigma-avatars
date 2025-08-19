# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `bun dev` - Start development server with Vite
- `bun build` - Build library (TypeScript compilation + Vite build)
- `bun lint` - Run ESLint
- `bun preview` - Preview built library

### Package Manager
This project uses Bun as the package manager. Use `bun install` to install dependencies.

## Architecture

### Library Structure
The library (`src/lib/`) exports a single React component that generates SVG avatars:
- **Main export**: `Avatar` component that accepts variant prop to select avatar style
- **Avatar variants**: marble, beam, pixel, sunset, ring, bauhaus
- **Utility functions**: Hash generation and deterministic randomization in `utilities.ts`

### Component Architecture
Each avatar variant is a separate component in `src/lib/components/`:
- All variants implement the `AvatarProps` interface
- Components generate deterministic SVG patterns based on the `name` prop
- Uses hash-based pseudo-randomization to ensure consistent avatars for the same input

### Build Configuration
- **Vite**: Library build configured to output ES modules
- **TypeScript**: Separate configs for app (`tsconfig.app.json`) and library (`tsconfig.lib.json`)
- **External dependencies**: React and ReactDOM marked as peer dependencies

## Key Implementation Details

### Avatar Generation
Avatars are generated deterministically using:
1. Hash function converts name to number (`hashCode` in utilities.ts)
2. Hash determines colors, positions, rotations, and scales
3. Each variant uses different SVG generation strategies

### Prop Handling
All avatar components accept:
- `name`: String used to generate the avatar
- `colors`: Array of hex colors for the palette
- `size`: Width/height of the SVG
- `square`: Boolean to make avatar square vs circular
- `title`: Boolean to include accessible title element