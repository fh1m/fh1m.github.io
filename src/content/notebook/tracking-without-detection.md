---
title: Tracking without detection — correspondences, optical flow
date: 2025-11
tags: [optical-flow, tracking, computer-vision]
status: ongoing
---

Detection answers "what is this?" Tracking answers "where did it go?" Most pipelines do detection first and tracking second, but the second question is often the one the robot actually needs answered, and it can be answered without the first.

Optical flow starts from a conservation law: the brightness of a patch of the world is roughly constant between frames. If a pixel at (x, y) moves by (u, v), then I(x+u, y+v, t+1) ≈ I(x, y, t). That single equation has two unknowns, so Lucas–Kanade solves it by assuming the motion is locally uniform and combining the constraints from a small window. The result is a field of velocities — the camera's evidence that something moved.

Correspondence is the same idea made discrete. Pick a distinctive patch — a corner, a blob — and find where it went in the next frame. Shi–Tomasi corners are good candidates because they are locally unique, which is exactly what makes them findable again.

Why track without detecting? Detection is expensive and brittle: it needs a trained model, a class list, and enough pixels to recognize an object. Flow and correspondence need none of that. They measure motion directly, which is what a controller consumes. The failure modes are honest ones: the aperture problem when a patch is locally ambiguous, and large displacements that outrun the search window. Both are physics, not bugs.

<!-- [VERIFY]: publish date (2025-11) is a draft placeholder. Brightness-constancy and Lucas–Kanade are textbook; no vehicle-specific claims are made here — confirm if a Duburi example should be added. -->