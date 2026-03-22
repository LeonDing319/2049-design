import { describe, expect, it } from 'vitest'

// Old scanline tile system has been replaced with simple scanline toggle + corruption slider.
// No exported pure functions to unit test for the new implementation.
// The rendering effects are visual and tested via integration/visual regression.

describe('glitch engine', () => {
  it('module exists', async () => {
    const mod = await import('./glitch')
    expect(mod.renderGlitch).toBeDefined()
  })
})
