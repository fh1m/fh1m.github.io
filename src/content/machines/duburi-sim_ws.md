---
act: decide
chapterKey: "05"
name: duburi-sim_ws
category: systems
status: running
yearLabel: "2026"
dateStart: 2026-01
# [VERIFY]: exact month unknown — brief gives year only; month approximated for schema
summary: Gazebo Harmonic + ArduSub SITL simulator and operator lab for the Mongla AUV stack
tags:
  - gazebo
  - simulation
  - ardusub
  - sitl
  - auv
repoLink: https://github.com/fh1m/duburi-sim_ws
draft: false
---

## Problem

Testing an AUV means putting it in water, and water is slow, expensive, and unforgiving. Most of the mission logic can be exercised before the vehicle ever gets wet — but only if the simulation is close enough to reality to be worth anything. Duburi needed a simulator and operator lab for the Mongla AUV stack.

## Difficulty

Simulation is where reality is approximated before it isn't. The difficulty is knowing exactly where the approximation breaks: hydrodynamics, sensor noise, and the difference between a simulated pool and a real one. A simulator that is too optimistic teaches the wrong lessons.

## Built

duburi-sim_ws — a Gazebo Harmonic + ArduSub SITL simulator and operator lab for the Mongla AUV stack. The environment where the vehicle's software runs against a simulated world before it runs against the real one.

<!-- [VERIFY]: "Mongla AUV stack" refers to the Mongol Tori project — confirm the project name and details from the v2 brief. -->

## Owned

The simulation lab — the world files, the vehicle model, and the operator workflow that makes the simulator a daily tool rather than a demo.

## Failed

The classic failure: a mission that runs perfectly in simulation and falls apart in the pool. The simulator said one thing, the water said another, and the difference was the lesson.

## Changed

The simulator changed the development loop — mission logic gets exercised in SITL before the vehicle is committed to water. The team stopped treating the pool as the first test and started treating it as the confirmation.

## Machine-now

The lab is running and in use: the operator lab where the Mongla AUV stack is developed and rehearsed before it meets real water.

## Lesson

Simulation is a tool for finding out where reality is approximated before it isn't. The value is not that the simulator is right — it is that it tells you where it is wrong.