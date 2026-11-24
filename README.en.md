# Alunissage (Moon Landing)

A skill game: fly a space module down to the ground and land it gently on one of the pads before the fuel runs out. A game is 3 lives and a score that adds up from mission to mission, across five worlds: the Moon, windy Mars, icy Europa, an asteroid under a meteor shower, and Titan and its thick air.

*Version française : [README.md](README.md)*

## Graded landings and real gravity (new in 1.2.0)

- **Every landing is graded out of 12**: touchdown speed (compared with the safe limit), the lander's **angle** (shown live under the gravity, green up to 3°), **centring** on the pad and **fuel** left, 3 points each. The grade goes from D to A, or **PERFECT** (12 out of 12, with a small fanfare). Each grade point adds 25 points to the score, before the pad multiplier. The side column keeps the number of perfect landings and the best grade for the mission.
- **The real gravity of each body**, shown in m/s²: Moon 1.62, Mars 3.71 (the lander falls more than twice as fast, but the engine pushes harder, in the same proportion), Europa 1.31, the asteroid 0.25 (Vesta's: you almost float).
- **A fifth world, Titan** (gravity 1.35): its **thick air** slows the lander, up and down as well as sideways; you never fall very fast, but you do not slide far either. Saturn shows through the orange haze, and a methane drizzle falls. The worlds then come back every 25 missions, harder.

## Controls

- **Up arrow** (or **hold the click**): main engine. It pushes the module up and slows the fall.
- **Left and right arrows**: side thrusters, to slide over the right pad (and to brake on ice).
- **Space**, the **up arrow** or a click starts the mission, goes to the next one or retries after a crash. **P** pauses.
- **Gamepad**: A or the right trigger for the engine, the d-pad or the stick for the thrusters, Start to pause.
- **Full screen**: the button at the top right of the game; Escape to leave it.

## A game

- You have **3 lives**. A crash costs one and you retry the same mission; at 0, the game is over.
- Each landing's score **adds up** to the game's. The record is your best game.
- Every 5 missions the world changes, and you get **one more life** (5 at most).

## The worlds

- **The Moon** (missions 1 to 5): Earth in the sky, no surprises.
- **Mars** (6 to 10): stronger gravity and **wind** pushing the module. The flags on the pads and the dust show its strength and direction.
- **Europa** (11 to 15): Jupiter's icy moon. A module landing with some sideways speed **slides**: brake with the thrusters before leaving the pad.
- **An asteroid** (16 to 20): weak gravity, but **meteors** fall. A red “!” at the top of the screen warns where they come from.
- Then the worlds come back, with stronger gravity.
- In each world, from the 3rd mission a **canyon** surrounds the ×3 pad; from the 4th, the ×5 pad **floats and moves back and forth**.

## How it works

- Gravity pulls the module down all the time. The main engine fights it, the thrusters move the module sideways; they all burn fuel (the main engine twice as much as the thrusters).
- The module starts with a full tank. Once empty, no engine responds: the module falls.
- The **dashboard** shows the fuel, both speeds (vertical and horizontal) and the **altitude**. The speeds turn **green** when they are low enough for a safe landing.
- Each mission has **three pads**, marked ×2, ×3 and ×5: the smaller the pad, the more it multiplies the points.
- The module must touch down **entirely on a pad**, coming down slowly and without sliding sideways. Otherwise it crashes, and the game tells you why.

## Scoring

A landing is worth **50 points + 5 points per unit of fuel left**, all multiplied by the pad. Saving fuel and aiming for the small ×5 pad scores the most.

## Statistics

The **Records** panel keeps your best game, the current game (score and lives), the furthest mission reached and the number of successful landings.

## Data and sync

The mission reached and the best score are stored by NeoDex, backed up and synced between your PCs when sync is on. No other permission, no Internet connection.

## Install

In NeoDex: **NeoStore → Discover → Alunissage → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
