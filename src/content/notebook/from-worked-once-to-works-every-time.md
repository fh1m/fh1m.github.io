---
act: decide
chapterKey: "06"
title: From "it worked once" to "it works every time" — robustness
date: 2026-08
tags: [robustness, testing, reliability]
status: ongoing
---

A demo is a single sample from a distribution. Robustness is the shape of that distribution — how wide it is, and where its tails are. Moving from "it worked once" to "it works every time" is not a matter of trying harder; it is a matter of measuring the variance and removing its sources.

The sources are usually mundane. Lighting changes between noon and dusk, and a detector tuned at noon fails at dusk. Temperature shifts the IMU bias. A cable that is fine on the bench is intermittent on the vehicle. Timing jitter turns a deterministic pipeline into a probabilistic one. None of these are exotic; all of them are discoverable if you run the thing long enough and log everything.

The mechanisms that buy robustness are boring on purpose. Watchdogs that reset a hung state machine. Idempotent commands so a retry is safe. A state machine that refuses to act on stale data. Soak tests that run the mission a hundred times and record every deviation. Fault injection that breaks a cable on purpose to see what the software does.

The mission for Duburi is the same mission every time. That sentence is a specification, not a slogan: it means the vehicle must hold its behavior across the whole distribution of conditions, and the only way to know is to run it until the failures are boring.

<!-- [VERIFY]: publish date (2026-08) is a draft placeholder. The "same mission every time" line is from the brief (Duburi robustness) — confirm the phrasing matches how Fahim wants it stated. -->