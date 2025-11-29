import { describe, expect, it } from 'vitest'
import { degToRad, pointOnCircle } from './chartMath'

describe('degToRad', () => {
  it('converts degrees to radians', () => {
    expect(degToRad(180)).toBe(Math.PI)
  })
})

describe('pointOnCircle', () => {
  it('returns coordinates on a circle', () => {
    const point = pointOnCircle(0, 10, 90)
    expect(point.x).toBeCloseTo(0)
    expect(point.y).toBeCloseTo(10)
  })
})

