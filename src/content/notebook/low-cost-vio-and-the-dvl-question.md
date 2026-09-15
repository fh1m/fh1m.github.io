---
act: understand
chapterKey: "02"
title: Low-cost VIO and the DVL question — can autonomy stop being expensive
date: 2026-02
tags: [vio, dvl, dead-reckoning, cost]
status: open
---

An AUV needs to know where it is. Underwater, GPS is gone, so the vehicle dead-reckons: it integrates what it can measure. The gold standard is a Doppler velocity log — an acoustic sensor that measures velocity relative to the seabed. It is also, on a small vehicle, often the single most expensive sensor on the bill of materials.

Visual-inertial odometry is the cheap challenger. A camera and an IMU together can estimate motion: the IMU integrates acceleration and rotation at high rate, and the camera corrects the drift that pure integration accumulates. The math is a sliding-window optimization over poses and landmarks, and it is well understood. The question is whether it is good enough — whether a fused camera+IMU estimate can hold position and navigate a course the way a DVL does.

The honest answer is: it depends on the environment. VIO drifts in featureless water, in turbid water, and when the camera cannot see the bottom. A DVL does not care about light. But for a shallow, structured course with good visibility, a well-tuned VIO can carry a surprising amount of the mission.

The deeper question is economic. If autonomy only works when the sensors cost more than the vehicle, it is not autonomy — it is a budget. Cheap sensing that is understood well enough to be trusted is the actual engineering problem.

<!-- [VERIFY]: publish date (2026-02) is a draft placeholder. DVL cost claims are qualitative ("often the most expensive sensor") — confirm against the actual Duburi bill of materials before publishing. -->