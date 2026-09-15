---
act: decide
chapterKey: "05"
name: duburi_ws
category: systems
status: running
yearLabel: "2026"
dateStart: 2026-01
# [VERIFY]: exact month unknown — brief gives year only; month approximated for schema
summary: BRACU Duburi's ROS2 Humble control, mission, and simulation stack for AUV
tags:
  - ros2
  - auv
  - ardusub
  - robosub
  - robotics
repoLink: https://github.com/fh1m/duburi_ws
draft: false
---

## Problem

A RoboSub vehicle is a pile of sensors, actuators, and computers that have to agree on what is happening and what to do next. Without a common backbone, every subsystem talks its own dialect and the mission logic lives in nobody's code. Duburi needed a control, mission, and simulation stack that the whole vehicle could run on.

## Difficulty

The stack has to hold together three different time scales at once: the control loop that keeps the vehicle stable, the mission logic that decides what to do, and the simulation that has to approximate reality closely enough to be worth trusting. ROS2 Humble is the substrate, but the difficulty is the integration — making the same code run on the real vehicle and in simulation without lying to either.

## Built

duburi_ws — BRACU Duburi's ROS2 Humble control, mission, and simulation stack for AUV. The workspace that ties the vehicle's control, mission, and simulation together, with topics covering ros2, auv, ardusub, robosub, and robotics.

## Owned

The systems layer — the workspace structure, the node graph, and the interfaces between control, mission, and simulation. The part of the stack that has to be boring and correct so the interesting parts can be wrong safely.

## Failed

The honest failure mode of a systems stack is that it works in simulation and the vehicle disagrees. That gap — between what the stack says and what the water does — is where most of the real debugging happens. It is a failure that repeats until the simulation stops lying.

## Changed

The stack changed how the team develops: instead of testing ideas on the vehicle and hoping, the mission and control logic now live in code that can be run in simulation first. The vehicle became a place to confirm, not a place to experiment.

## Machine-now

The stack is running — it is the backbone the current Duburi vehicle runs on, and it keeps the mission logic in one place where the team can actually reason about it.

## Lesson

The systems layer is the first machine. If the interfaces between control, mission, and simulation are honest, the vehicle has a chance; if they lie, no amount of clever perception fixes it.