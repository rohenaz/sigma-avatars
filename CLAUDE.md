# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `bun dev` - Start development server with Vite (demo app)
- `bun build` - Build library (TypeScript compiler emits per-file ESM and .d.ts to `build/`)
- `bun lint` - Run Biome check (lints & reports)
- `bun lint:fix` - Apply Biome fixes (uses `--apply --unsafe`)
- `bun preview` - Preview built library

### Package Manager
This project uses Bun as the package manager. Use `bun install` to install dependencies.

## Architecture

### Library Structure
The library (`packages/sigma-avatars/src/`) exports a single React component that generates SVG avatars:
- **Main export**: `Avatar` component that accepts variant prop to select avatar style
- **Avatar variants**: marble, beam, pixel, sunset, ring, bauhaus, fractal, mage, barcode, pepe
- **Utility functions**: Hash generation and deterministic randomization in `utilities.ts`
- **Background patterns**: Exported patterns for advanced customization

### Component Architecture
Each avatar variant is a separate component in `packages/sigma-avatars/src/components/`:
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
- `colors`: Array of colors (hex, CSS variables, RGB, HSL, OKLCH)
- `size`: Width/height of the SVG (number or string)
- `className`: CSS classes for shape control (`rounded-full`, `rounded-md`, `rounded-none`)
- `title`: Boolean to include accessible title element
- `api`: Optional API endpoint for server-side generation
- `backgrounds`: Optional list of allowed background patterns