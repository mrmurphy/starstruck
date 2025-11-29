interface MapboxFeature {
  id: string
  place_name: string
  text: string
  geometry: {
    coordinates: [number, number]
  }
  context?: Array<{
    id: string
    text: string
    short_code?: string
  }>
}

export interface LocationSuggestion {
  id: string
  label: string
  city: string
  region?: string
  country?: string
  latitude: number
  longitude: number
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<LocationSuggestion[]> {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) {
    throw new Error('Mapbox token missing. Set VITE_MAPBOX_TOKEN in your environment.')
  }

  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`)
  url.searchParams.set('access_token', token)
  url.searchParams.set('autocomplete', 'true')
  url.searchParams.set('types', 'place,locality')
  url.searchParams.set('limit', '5')

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Failed to reach Mapbox geocoding API.')
  }
  const data: { features: MapboxFeature[] } = await response.json()

  return data.features.map((feature) => {
    const [lon, lat] = feature.geometry.coordinates
    const region = feature.context?.find((item) => item.id.startsWith('region'))?.text
    const country = feature.context?.find((item) => item.id.startsWith('country'))?.short_code ?? undefined
    return {
      id: feature.id,
      label: feature.place_name,
      city: feature.text,
      region,
      country,
      latitude: lat,
      longitude: lon,
    }
  })
}

