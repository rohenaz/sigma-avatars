# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2025-08-24

### Added
- Default WebP format for server-side rendering when using the `api` prop for better performance
- Improved API URL handling to check for existing parameters before appending

### Fixed
- Sharp image conversion pipeline for WebP/PNG formats
- API endpoint default variant now matches library default (marble)

### Changed
- Image quality settings optimized for better compression

## [0.0.2] - 2024-08-23

### Added
- Server-side rendering support via `api` prop
- Support for multiple color formats (CSS variables, OKLCH, HSL, RGB)
- shadcn/ui integration with built-in color system support
- 10 unique avatar variants: marble, beam, pixel, sunset, ring, bauhaus, fractal, mage, barcode, pepe
- TypeScript support with full type definitions
- Background patterns for advanced customization

### Changed
- Restructured as monorepo with workspace structure
- Library moved from `src/lib` to `packages/sigma-avatars`

## [0.0.1] - 2024-08-22

### Added
- Initial release
- Basic avatar generation with 6 variants
- Deterministic avatar generation from usernames
- Customizable colors, sizes, and shapes