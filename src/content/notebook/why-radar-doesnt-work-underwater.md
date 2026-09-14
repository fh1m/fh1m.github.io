---
title: Why radar doesn't work underwater — and what does instead
date: 2024-03
tags: [sonar, radar, acoustics, auv]
status: closed
---

Radar and sonar are the same idea with different physics. Both send a wave, listen for the echo, and turn the round-trip time into a range. The difference is what the water does to the wave.

Seawater is a conductor. Its conductivity is around 4 S/m, and a conductor eats electromagnetic waves: the field decays exponentially with depth, and the length scale — the skin depth — shrinks as frequency rises. At 1 GHz the skin depth in seawater is roughly a centimeter. A radar that works at a hundred meters in air works at centimeters underwater. That is not a tuning problem; it is the medium.

Sound is the opposite. Water is dense and nearly incompressible, so acoustic pressure waves travel well — about 1500 m/s, with attenuation measured in decibels per kilometer rather than per centimeter. That is why an AUV carries an imaging sonar, a Doppler velocity log, and an acoustic modem, and why the antenna on the hull is for the surface, not the deep.

The lesson generalizes: before optimizing a sensor, ask what the medium actually transmits. The right wave for the job is decided by physics, not by what the datasheet calls the product.

<!-- [VERIFY]: publish date (2024-03) is a draft placeholder — confirm or adjust. Skin-depth and conductivity figures are standard textbook values; sanity-check before publishing. -->