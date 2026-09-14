---
title: The frame-age problem — queues vs latest-frame buffers
date: 2025-06
tags: [perception, control, latency, buffers]
status: ongoing
---

Every perception pipeline has a moment where the world it describes is already in the past. The question is how far in the past, and whether the controller cares.

A queue preserves order. Frames arrive, line up, and are consumed in sequence. That is good for analysis — you can reason about the whole history — but it is bad for control, because the newest frame waits behind the older ones. Latency grows with queue depth, and latency is distance: at 1 m/s, a 200 ms delay is 20 cm of travel. For a vehicle that must hold position or thread a gate, 20 cm is the difference between a pass and a collision.

A latest-frame buffer does the opposite. Each new frame overwrites the previous one, so the consumer always reads the most recent state. The cost is that frames can be dropped, and if the consumer is slower than the producer, the buffer silently discards work. That is usually the right trade for a control loop: better a slightly stale but newest estimate than a queue of old ones.

The failure mode we actually hit was subtler. The detector worked. The vehicle didn't. The problem turned out not to be perception at all — we were processing frames that were already too old for the controller. The fix was not a better model; it was measuring the age of the frame and refusing to steer on stale data.

```
producer ──► [ latest-frame buffer ] ──► consumer (control)
                 ^ overwrite on arrival
                 age = now − capture_time
                 if age > budget: hold position, don't steer
```

<!-- [VERIFY]: publish date (2025-06) is a draft placeholder. The 200 ms / 20 cm figures are illustrative; the underlying incident (stale frames steering the vehicle) is from the Duburi narrative — confirm specifics. -->