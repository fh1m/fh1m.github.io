---
act: understand
chapterKey: "03"
title: Turning a camera into a sensor — hardware triggering, V4L2, buffer latency
date: 2025-08
tags: [v4l2, cameras, timing, embedded]
status: ongoing
---

A camera is not a sensor until you know when the frame was captured. A sensor reports a measurement with a time; a camera, out of the box, reports pixels. The gap between those two is where most vision-based control problems actually live.

V4L2 is the Linux API for video capture, and its buffer model is the first thing to understand. The driver owns a set of buffers; the application queues them with `VIDIOC_QBUF`, the hardware fills one when a frame arrives, and the application dequeues it with `VIDIOC_DQBUF`. The buffer that comes back carries a timestamp — but that timestamp is only as good as the driver's clock discipline, and on a USB camera it can be off by tens of milliseconds.

Hardware triggering is the fix when timing matters. A GPIO line or an external trigger signal tells the sensor exactly when to expose, so the capture time is known to microseconds and can be aligned with an IMU sample or a strobe. That turns the camera from a device that happens to produce images into a measurement instrument that participates in a fused state estimate.

The buffer-latency question is separate from the trigger question. A frame can be captured at the right time and still arrive late, because it sits in a queue, crosses a bus, or waits for a copy. The discipline is to measure the whole path — exposure start to control input — and treat it as a budget, not an assumption.

<!-- [VERIFY]: publish date (2025-08) is a draft placeholder. V4L2 ioctl names and USB timestamp jitter are standard; the specific camera/IMU hardware used on Duburi is not named here — confirm if a concrete example should be added. -->