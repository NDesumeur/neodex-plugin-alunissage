# Alunissage (Moon Landing)

A skill game: fly a lunar module down to the ground and set it down gently on one of the landing pads, without running out of fuel. Every successful mission opens a harder one, with slightly stronger gravity.

*Version française : [README.md](README.md)*

## Controls

- **Up arrow** (or **hold the mouse button**): main engine. It pushes the module up and slows the fall.
- **Left and right arrows**: side thrusters, to drift over the right pad.
- **Space** or a click starts the mission; after a landing, a click goes to the next mission; after a crash, a click tries again.

## How it works

- Gravity pulls the module down all the time. The main engine fights it, the thrusters move the module sideways; all of them burn fuel (the main engine twice as much as the thrusters).
- The module starts with a full tank. When it is empty, no engine responds any more: the module falls.
- The **dashboard** shows the fuel and both speeds, vertical and horizontal. They turn **green** when they are low enough to land safely.
- Each mission has **three flat pads**, marked ×2, ×3 and ×5: the smaller the pad, the more it multiplies the score.
- The module must touch down **entirely on a pad**, coming down slowly and without sliding sideways. Otherwise it crashes, and the game tells you why: not on a pad, too fast downwards or too fast sideways.
- Every successful mission makes gravity 8% stronger.

## Scoring

A landing is worth **50 points + 5 points per unit of fuel left**, multiplied by the pad you chose. Saving fuel and aiming for the small ×5 pad scores the most.

## Statistics

The **Records** panel keeps the best score, the furthest mission reached and the number of successful landings.

## Data and sync

The mission reached and the best score are stored by NeoDex, backed up and synced between your PCs when sync is on. No other permission, no Internet connection.

## Install

In NeoDex: **NeoStore → Discover → Alunissage → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
