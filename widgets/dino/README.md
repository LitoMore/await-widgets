# Dino

An Await widget inspired by Chrome Dino. Tap the widget to start, jump, and restart after a crash.

The game stores the current run and high score locally with `AwaitStore`, and renders the dinosaur, cacti, clouds, and ground as inline SVG assets. The dinosaur path is derived from the Chromium T-Rex sprite from Wikimedia Commons under the BSD license.

## Configuration

Open the widget panel and set:

- `colorScheme`: use the host color scheme or force light/dark
- `startSpeed`: the initial running speed
- `speedRamp`: how quickly the run speeds up
- `jumpHeight`: the dinosaur jump height
- `jumpDuration`: how long a full jump lasts, in milliseconds
- `showClouds`: whether to show the background clouds
- `showScore`: whether to show the current and high score
