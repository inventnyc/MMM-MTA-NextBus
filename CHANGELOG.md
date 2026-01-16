# MMM-MTA-NextBus Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2026-01-15

### Added
- Implemented `retryDelay` config option - automatically retries failed API calls after a delay

### Changed
- Modernized codebase to use ES6+ syntax (`const`/`let`, arrow functions, template literals)
- Replaced `http` module with native `fetch` API (requires Node 18+)
- Changed API URL from HTTP to HTTPS
- Simplified `package.json` dependencies (removed Grunt, kept only ESLint)
- Updated method syntax to use shorthand notation

### Fixed
- Fixed bug in error handler using undefined `self` variable
- Fixed potential crash when API returns invalid JSON

### Removed
- Removed Grunt build system in favor of direct ESLint
- Removed dead/commented-out code

## [1.0.0] - Unreleased

First public release
