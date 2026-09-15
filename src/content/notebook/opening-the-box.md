---
act: understand
chapterKey: "05"
title: Opening the box — what is actually on the Jetson
date: 2026-04
tags: [jetson, soc, embedded, real-time]
status: open
---

A Jetson is a computer that happens to be shaped like a sensor. The useful question is not "what can it run" but "what is actually inside, and where does the real-time work happen."

The SoC bundles several processors. There is a general-purpose CPU cluster — on an Orin, twelve Arm cores — that runs Linux and the orchestration. There is a GPU for parallel throughput work like neural inference. There is often a dedicated accelerator — the DLA on NVIDIA parts — that runs fixed-function inference with better efficiency than the GPU. And there is a memory system with a bandwidth budget that every one of those units shares.

The real-time control loop does not live on the GPU. GPUs are throughput machines: they batch work and reorder it for utilization, which is the opposite of a bounded-latency guarantee. The loop that must fire every millisecond lives on a microcontroller or a real-time core, talking to the SoC over a bus. The SoC is the brain; the MCU is the reflex arc.

Opening the box changes how you design. Once you know the memory bandwidth is shared, you stop treating the GPU as free. Once you know the control loop is elsewhere, you stop blaming the vision stack for timing jitter that was never its job. The box is not magic; it is a set of budgets.

<!-- [VERIFY]: publish date (2026-04) is a draft placeholder. Orin core count and DLA are public specs; the specific Jetson model and MCU used on Duburi are not named — confirm before adding specifics. -->