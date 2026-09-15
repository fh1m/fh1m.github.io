---
act: decide
chapterKey: "08"
name: Air / drones & GPS-denied navigation
category: air
status: ongoing
yearLabel: 2026—present
dateStart: 2026-01
# [VERIFY]: no public repo and no confirmed dates — this entry is drafted from the brief narrative only; month approximated for schema
summary: Drones, avionics, GNC, and GPS-denied navigation — in progress, not yet public.
tags:
  - drones
  - gnc
  - gps-denied
  - avionics
  - navigation
draft: false
---

## Problem

GPS is the crutch that most outdoor autonomy leans on. The problem this work is pointed at: what does a drone do when the satellite signal is gone — indoors, under cover, in a contested environment? GPS-denied navigation is the question of how a machine keeps knowing where it is when the easy answer is removed.

## Difficulty

Without GPS, the vehicle has to estimate its own state from its own sensors — and every sensor drifts. The difficulty is the same one underwater: the environment does not care how elegant the code looks, and the sky is as unforgiving as the water.

## Built

<!-- [VERIFY]: no public repo exists for this work — drafted from the brief narrative (drones, avionics, GNC, GPS-denied navigation). Confirm scope, hardware, and dates before publishing. -->
This entry is not yet public — in progress. The work covers drones, avionics, guidance/navigation/control (GNC), and GPS-denied navigation. There is no public repository yet, so the honest description is: a machine being built, not yet shown.

<!-- [VERIFY]: AERD rockets program — name, dates, and scoping are from the v2 brief; confirm the program name and what it actually covers before publishing. -->

## Owned

<!-- [VERIFY]: confirm what is personally owned in this work — drafted from the brief narrative only. -->
The GNC and navigation work — the part that has to keep the machine knowing where it is when the easy answers are gone.

## Failed

<!-- [VERIFY]: no failure narrative is confirmed for this work — do not assume specifics. -->
The failures here are the ones that GPS-denied navigation is built to expose: state estimates that drift, sensors that disagree, and the moment the machine has to act on a position it is not sure about. The specifics are not yet public.

## Changed

The work is changing what I expect from navigation: that a machine should be able to know where it is without being told. The direction is the same one that runs through the underwater work — perception and state estimation that have to work when the environment stops cooperating.

## Machine-now

In progress, not yet public. The machine is being built; when there is something to show, this entry will be updated with the real record.

## Lesson

The lesson is still being written. What is already clear: GPS-denied navigation is the air version of the underwater problem — a machine that has to know where it is when the environment refuses to say.