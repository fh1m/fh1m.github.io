---
act: understand
chapterKey: "05"
name: duburi-codebase_RND
category: perception
status: ongoing
yearLabel: "2026"
dateStart: 2026-01
# [VERIFY]: exact month unknown — brief gives year only; month approximated for schema
summary: The codebase for AUV, Research and Experimental Concepts tested on Duburi 4.2
tags:
  - perception
  - auv
  - research
  - computer-vision
  - experimental
repoLink: https://github.com/fh1m/duburi-codebase_RND
stack:
  - name: Python
    weight: 100
subsystems:
  - name: VISION
    status: ok
  - name: MAVLINK
    status: ok
  - name: SIM
    status: ok
draft: false
---

## Problem

Underwater perception is expensive to do well and cheap to do badly. The question behind this codebase is whether autonomy underwater can stop being expensive — whether a student team can test research and experimental concepts on a real AUV without a research budget.

## Difficulty

The water is the difficulty. Cheap underwater autonomy means perception that survives murk, refraction, and bad lighting with sensors that cost what a student team can afford. Every concept has to be tested on Duburi 4.2, which means every idea has to survive the gap between a paper and a pool.

## Built

duburi-codebase_RND — the codebase for AUV, Research and Experimental Concepts tested on Duburi 4.2. The workspace is ~40 Python source files across 8 packages (~6,500 lines): ROS 2 Humble on Pixhawk 2.4.8 running ArduSub via pymavlink, YOLO11 CUDA inference with Kalman-filtered tracking and PID visual servoing, and a Gazebo Harmonic + ArduSub SITL simulation lane. The place where perception ideas go to meet the real vehicle.

## Owned

The experimental perception concepts — the research ideas that are cheap enough to try and honest enough to test on the actual machine.

## Failed

Experimental code fails by design — that is what the RND lane is for. The failures that matter are the ones that looked good in theory and died in the water, because those are the ones that teach the real constraints.

## Changed

The codebase changed what the team is willing to try. With a place to test experimental concepts on the real vehicle, ideas that would have stayed in a notebook got a chance to meet reality.

## Machine-now

Ongoing — the experimental concepts keep being tested on Duburi 4.2, and the ones that survive the water feed back into the vehicle's perception stack.

## Lesson

Cheap underwater autonomy is a constraint, not a compromise. Testing research concepts on a real AUV is how you find out which ideas are actually worth anything.