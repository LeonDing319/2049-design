import { describe, expect, it } from 'vitest'
import { appReducer, initialAppState } from './useEffectParams'

describe('appReducer', () => {
  it('sets glitch params without affecting other state', () => {
    const nextState = appReducer(initialAppState, {
      type: 'SET_GLITCH_PARAMS',
      payload: { rgbSplit: 10 },
    })

    expect(nextState.glitchParams.rgbSplit).toBe(10)
    expect(nextState.asciiParams).toBe(initialAppState.asciiParams)
  })

  it('updates corruption without affecting other glitch params', () => {
    const nextState = appReducer(initialAppState, {
      type: 'SET_GLITCH_PARAMS',
      payload: { corruption: 50 },
    })

    expect(initialAppState.glitchParams.corruption).toBe(0)
    expect(nextState.glitchParams.corruption).toBe(50)
    expect(nextState.glitchParams.dotSize).toBe(initialAppState.glitchParams.dotSize)
  })

  it('sets ascii params without affecting other state', () => {
    const nextState = appReducer(initialAppState, {
      type: 'SET_ASCII_PARAMS',
      payload: {},
    })

    expect(nextState.asciiParams).toEqual(initialAppState.asciiParams)
  })
})
