---
act: move
chapterKey: "02"
name: Duburi
category: underwater
status: running
yearLabel: 2023—present
dateStart: 2023-01
# [VERIFY]: exact month unknown — brief gives year only; month approximated for schema
summary: An AUV built to perform in water that doesn't care how elegant the code looks.
tags:
  - auv
  - robosub
  - underwater
  - robotics
  - computer-vision
repoLink: https://github.com/fh1m/Duburi
metrics:
  - label: ROBOSUB 2023
    value: 2ND
  - label: ROBOSUB 2025
    value: 9TH
  - label: ROBOSUB 2026
    value: 8TH — 6230 PTS
trend:
  - year: "2023"
    label: 2ND
    value: 2
  - year: "2025"
    label: 9TH
    value: 9
  - year: "2026"
    label: 8TH — 6230 PTS
    value: 8
draft: false
---

## Problem

RoboSub is a competition where an autonomous underwater vehicle has to complete a mission in a pool — pass through a gate, follow a path, find and interact with objects, and surface in the right place. The vehicle has to do all of it on its own, underwater, in real time. Duburi is BRACU's entry: an AUV built to perform in water that doesn't care how elegant the code looks.

## Difficulty

Water removes most of the tools a robot normally leans on. Radio dies within a meter or two, so there is no reliable remote control and no GPS. Cameras look through murk and refraction. Everything drifts — the vehicle, the water, the mission objects. The environment does not care how elegant the code looks; it only cares whether the machine actually does the task.

## Built

The Duburi AUV line, currently at Duburi 4.2 — a full RoboSub vehicle built by a student team at BRACU. Perception, control, mission planning, and the hull that has to survive being handled by students and water at the same time. The public home is bracu-duburi.com; the code lives at github.com/fh1m/Duburi.

## Owned

I came in as a Junior AI/Machine Vision member, then led the AI & Machine Vision subteam, then became Engineering team lead. The perception stack was mine to own: making the vehicle see well enough to act, and making that vision reliable enough to trust in a mission.

## Failed

The results are the evidence, not the identity: 2023 world runners-up (2nd), 2025 9th, 2026 8th (6230 points). The 2025 drop is the honest data point — the machine did not perform the way the team expected. The failure was real and it was useful: it said something about the vehicle, not about the people.

## Changed

The vehicle changed across generations — Duburi 4.2 is not the machine that placed 2nd in 2023. The engineering became increasingly serious as the path became non-linear. Each competition changed what the team believed about what actually matters underwater.

## Machine-now

At RoboSub 2026 the machine scored 6230 points and placed 8th. It performs in an environment that does not care how elegant the code looks — and it keeps being rebuilt to perform better next time.

## Lesson

Machines that have to perform in an environment that does not care how elegant the code looks teach you to care about the environment first. Elegance is a means; the mission is the judge.