---
banner: https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200
status: in progress
tags:
  - research
  - math
---

## Abstract

We propose a novel approach to matrix decomposition using stochastic gradient methods with adaptive step sizes.

## Key equations

The loss function:

$$\mathcal{L}(W) = \frac{1}{2}\|X - WH\|_F^2 + \lambda \|W\|_1$$

Gradient update:

$$W_{t+1} = W_t - \eta_t \nabla \mathcal{L}(W_t)$$

Where $\eta_t = \frac{\eta_0}{\sqrt{t}}$ is the learning rate schedule.

## Status

- [x] Literature review
- [x] Problem formulation
- [ ] Experiments
- [ ] Writing
- [ ] Submission
