# Dino (WIP)

An Await widget inspired by Chrome Dino. Tap the widget to start, jump, and restart after a crash.

The game stores the current run and high score locally with `AwaitStore`, and renders the dinosaur, cacti, clouds, and ground as inline SVG assets. The dinosaur and cactus paths are derived from the Chromium T-Rex sprites from Wikimedia Commons under the BSD license.

Movement, acceleration, obstacle timing, and cactus sizing follow Chromium's `offline.js` runner constants using the original 600 x 150 game coordinate system.

## Known Issues

- Dino can still stutter on the desktop widget surface because it relies on the host widget timeline and native animations instead of a continuous game loop.

## Configuration

Open the widget panel and set:

- `colorScheme`: use the host color scheme or force light/dark
- `showClouds`: whether to show the background clouds
- `showScore`: whether to show the current and high score

## Usage

See the project root's [README.md](../../README.md#usage) for general usage instructions.
