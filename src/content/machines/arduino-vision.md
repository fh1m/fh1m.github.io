---
name: Arduino-Vision
category: compute
status: prototype
yearLabel: "2024"
dateStart: 2024-01
# [VERIFY]: exact month unknown — brief gives year only; month approximated for schema
summary: Combination of ML and Arduino — can a microcontroller carry vision?
tags:
  - arduino
  - machine-learning
  - embedded
  - microcontroller
repoLink: https://github.com/fh1m/Arduino-Vision
draft: false
---

## Problem

Vision is assumed to need a big computer. The question behind Arduino-Vision is the frugal one: can a microcontroller carry vision? What does machine learning look like when the entire computer is a few kilobytes of RAM and a clock measured in megahertz?

## Difficulty

The difficulty is the constraint. A microcontroller has no GPU, no operating system to hide behind, and almost no memory. Every part of the vision pipeline that a laptop would absorb has to be rebuilt within the budget — or dropped.

## Built

Arduino-Vision — a combination of ML and Arduino. A prototype that puts a machine-learning model on a microcontroller and asks it to see.

## Owned

The whole experiment — the model, the Arduino integration, and the decision about what "vision" is allowed to mean at that scale.

## Failed

The prototype is a prototype because the gap between what a microcontroller can do and what vision wants is real. The failures were the point: they map exactly where the budget runs out.

## Changed

It changed what I expect from embedded perception. Forcing vision onto a microcontroller makes the cost of every operation visible in a way a laptop never does.

## Machine-now

A prototype — the combination of ML and Arduino exists and runs, and it stands as the record of the frugal/architectural-curiosity instinct: what is the smallest machine that can see?

## Lesson

The constraint is the teacher. Putting vision on a microcontroller shows you exactly what vision costs — and what it costs is usually more than the abstraction lets you see.