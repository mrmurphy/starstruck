export function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function pointOnCircle(center: number, radius: number, angleDegrees: number) {
  const angle = degToRad(angleDegrees)
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  }
}

