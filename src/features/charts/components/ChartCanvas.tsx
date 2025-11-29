import { useEffect, useRef, useState } from 'react'
import type { BirthChart } from '@/lib/astrology'
import { pointOnCircle } from './chartMath'

type Dimensions = { size: number; dpr: number }

interface ChartCanvasProps {
  chart?: BirthChart | null
}

export function ChartCanvas({ chart }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({ size: 320, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      const size = Math.min(rect?.width ?? 320, 480)
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      setDimensions({ size, dpr })
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !chart) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame: number
    const render = (timestamp: number) => {
      drawChart(ctx, chart, dimensions, timestamp)
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => cancelAnimationFrame(frame)
  }, [chart, dimensions])

  if (!chart) {
    return (
      <div className="chart-canvas__placeholder">
        <p>No chart preview yet — create one to see the renderer in action.</p>
      </div>
    )
  }

  return <canvas ref={canvasRef} className="chart-canvas" aria-label="Birth chart preview" />
}

function drawChart(ctx: CanvasRenderingContext2D, chart: BirthChart, dims: Dimensions, timestamp: number) {
  const { size, dpr } = dims
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.restore()

  ctx.save()
  ctx.scale(dpr, dpr)

  const center = size / 2
  const radius = size / 2 - 16
  const rotation = chart.houses[0]?.cuspLongitude ?? 0

  const bgGradient = ctx.createRadialGradient(center, center, radius * 0.2, center, center, radius)
  bgGradient.addColorStop(0, 'rgba(59,130,246,0.15)')
  bgGradient.addColorStop(1, 'rgba(10,14,20,0.95)')
  ctx.fillStyle = bgGradient
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.lineWidth = 1.5
  ctx.strokeStyle = 'rgba(148,163,184,0.2)'
  ctx.beginPath()
  ctx.arc(center, center, radius * 0.85, 0, Math.PI * 2)
  ctx.stroke()

  chart.houses.forEach((house, index) => {
    const cuspAngle = house.cuspLongitude - rotation
    const point = pointOnCircle(center, radius, cuspAngle)
    
    // Draw house cusp line
    ctx.strokeStyle = 'rgba(148,163,184,0.15)'
    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    
    // Calculate midpoint angle for house label (midpoint between this house and next)
    const nextHouse = chart.houses[index === chart.houses.length - 1 ? 0 : index + 1]
    const nextCuspAngle = nextHouse.cuspLongitude - rotation
    
    // Handle wrap-around: if next cusp is smaller, it means we wrapped past 360°
    let midpointAngle = (cuspAngle + nextCuspAngle) / 2
    if (nextCuspAngle < cuspAngle) {
      // Wrapped around - calculate midpoint across the 360° boundary
      midpointAngle = ((cuspAngle + (nextCuspAngle + 360)) / 2) % 360
    }
    
    // Draw house number label at midpoint, outside the outer circle
    const labelRadius = radius + 14
    const labelPoint = pointOnCircle(center, labelRadius, midpointAngle)
    
    // Draw small background circle for the label
    ctx.fillStyle = 'rgba(10,14,20,0.8)'
    ctx.beginPath()
    ctx.arc(labelPoint.x, labelPoint.y, 10, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw house number
    ctx.fillStyle = 'rgba(226,232,240,0.95)'
    ctx.font = '600 0.75rem "Inter", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(house.house.toString(), labelPoint.x, labelPoint.y)
  })

  chart.planets.forEach((planet, index) => {
    const angle = planet.longitude - rotation
    const innerRadius = radius * 0.55
    const outerRadius = radius * 0.8
    const pulse = 1 + 0.04 * Math.sin(timestamp / 500 + index)
    const pointRadius = 8 * pulse
    const { x, y } = pointOnCircle(center, innerRadius, angle)
    const orbit = pointOnCircle(center, outerRadius, angle)

    ctx.strokeStyle = 'rgba(59,130,246,0.08)'
    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.lineTo(orbit.x, orbit.y)
    ctx.stroke()

    ctx.fillStyle = 'rgba(59,130,246,0.9)'
    ctx.beginPath()
    ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#0a0e14'
    ctx.font = '600 0.75rem "Inter", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(planet.body.slice(0, 2), x, y)
  })

  ctx.restore()
}
