import { useEffect, useMemo, useRef, useState } from 'react'
import type { LocationSuggestion } from '@/features/location/mapbox'
import { searchPlaces } from '@/features/location/mapbox'

interface LocationSearchFieldProps {
  value: string
  onSelect: (suggestion: LocationSuggestion) => void
  onManualChange: (value: string) => void
}

export function LocationSearchField({ value, onSelect, onManualChange }: LocationSearchFieldProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      setStatus('idle')
      return
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    const timeout = setTimeout(async () => {
      try {
        setStatus('loading')
        setError(null)
        const results = await searchPlaces(query, controller.signal)
        setSuggestions(results)
        setStatus('idle')
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setStatus('error')
        setError((err as Error).message)
      }
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  const helperText = useMemo(() => {
    if (status === 'loading') return 'Searching Mapbox…'
    if (error) return error
    if (!query) return 'Type a city or town'
    return null
  }, [status, error, query])

  return (
    <div className="location-field">
      <label>
        <span>City & State</span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            onManualChange(event.target.value)
          }}
          placeholder="e.g., Asheville, NC"
          autoComplete="off"
        />
      </label>
      {helperText && <p className="field-hint">{helperText}</p>}
      {!!suggestions.length && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => {
                onSelect(suggestion)
                setSuggestions([])
              }}
            >
              <div className="suggestion-primary">{suggestion.city}</div>
              <div className="suggestion-secondary">
                {[suggestion.region, suggestion.country?.toUpperCase()].filter(Boolean).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

