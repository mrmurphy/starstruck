import * as Astronomy from 'astronomy-engine'
import { zodiacForLongitude } from './zodiac'
import type { BirthChart, BirthDetails, CelestialBody, HousePosition, PlanetPosition } from './types'

const PLANET_MAP: Record<Exclude<CelestialBody, 'Ascendant'>, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
}

const PLANETS = Object.keys(PLANET_MAP) as Exclude<CelestialBody, 'Ascendant'>[]

export async function computeBirthChart(details: BirthDetails): Promise<BirthChart> {
  const time = new Astronomy.AstroTime(new Date(details.timestamp))
  const observer = new Astronomy.Observer(details.latitude, details.longitude, details.elevationMeters ?? 0)
  const planets = await Promise.all(PLANETS.map((body) => computePlanet(body, time, observer)))
  const ascendantLongitude = estimateAscendant(details)
  const houses = computeEqualHouses(ascendantLongitude)

  return {
    computedAt: new Date().toISOString(),
    details,
    planets: [
      ...planets,
      {
        body: 'Ascendant',
        longitude: ascendantLongitude,
        latitude: 0,
        sign: zodiacForLongitude(ascendantLongitude),
        house: 1,
        retrograde: false,
      },
    ],
    houses,
  }
}

async function computePlanet(body: Exclude<CelestialBody, 'Ascendant'>, time: Astronomy.AstroTime, observer: Astronomy.Observer) {
  const equ = Astronomy.Equator(PLANET_MAP[body], time, observer, true, true)
  const ecliptic = Astronomy.Ecliptic(equ.vec)
  const prev = time.AddDays(-1 / 24) // 1 hour earlier to approximate retrograde
  const prevEqu = Astronomy.Equator(PLANET_MAP[body], prev, observer, true, true)
  const prevEcl = Astronomy.Ecliptic(prevEqu.vec)
  const retrograde = deltaDegrees(ecliptic.elon, prevEcl.elon) < 0

  const longitude = wrap360(ecliptic.elon)
  const latitude = ecliptic.elat
  const sign = zodiacForLongitude(longitude)
  const house = Math.floor(longitude / 30) + 1

  return {
    body,
    longitude,
    latitude,
    sign,
    house: house > 12 ? house - 12 : house,
    retrograde,
  } satisfies PlanetPosition
}

function computeEqualHouses(ascendantLongitude: number): HousePosition[] {
  return Array.from({ length: 12 }, (_, index) => {
    const cuspLongitude = wrap360(ascendantLongitude + index * 30)
    return {
      house: index + 1,
      cuspLongitude,
      sign: zodiacForLongitude(cuspLongitude),
    }
  })
}

function estimateAscendant(details: BirthDetails) {
  const date = new Date(details.timestamp)
  const jd = date.getTime() / 86400000 + 2440587.5
  const d = jd - 2451545.0
  const gmst = 280.46061837 + 360.98564736629 * d
  const lmst = gmst + details.longitude
  return wrap360(lmst)
}

function wrap360(value: number) {
  return ((value % 360) + 360) % 360
}

function deltaDegrees(current: number, previous: number) {
  const diff = current - previous
  return ((diff + 540) % 360) - 180
}

