import { useEffect, useState } from 'react'
import { LocationSearchField } from './LocationSearchField'
import type { LocationSuggestion } from '@/features/location/mapbox'

export interface ChartFormValues {
  name: string
  birthMoment: string
  locationLabel: string
  latitude: string
  longitude: string
  notes: string
}

interface ChartFormProps {
  initialValues?: Partial<ChartFormValues>
  submitLabel?: string
  resetOnSuccess?: boolean
  onSubmit: (values: ChartFormValues) => Promise<void> | void
}

const defaultValues: ChartFormValues = {
  name: '',
  birthMoment: new Date().toISOString().slice(0, 16),
  locationLabel: '',
  latitude: '',
  longitude: '',
  notes: '',
}

export function ChartForm({ initialValues, onSubmit, submitLabel = 'Save chart', resetOnSuccess }: ChartFormProps) {
  const [values, setValues] = useState<ChartFormValues>({ ...defaultValues, ...initialValues })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues) {
      setValues({ ...defaultValues, ...initialValues })
    }
  }, [initialValues])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is unavailable in this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValues((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4),
        }))
        setError(null)
      },
      (geoError) => {
        setError(geoError.message)
      },
      { enableHighAccuracy: true },
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(values)
      setError(null)
      if (resetOnSuccess) {
        setValues({ ...defaultValues })
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input name="name" value={values.name} onChange={handleChange} placeholder="Solstice Reading" required />
      </label>
      <label>
        <span>Birth moment</span>
        <input type="datetime-local" name="birthMoment" value={values.birthMoment} onChange={handleChange} required />
      </label>
      <LocationSearchField
        value={values.locationLabel}
        onManualChange={(text) => setValues((prev) => ({ ...prev, locationLabel: text }))}
        onSelect={(suggestion: LocationSuggestion) => {
          setValues((prev) => ({
            ...prev,
            locationLabel: suggestion.label,
            latitude: suggestion.latitude.toString(),
            longitude: suggestion.longitude.toString(),
          }))
        }}
      />
      <div className="grid two-up">
        <label>
          <span>Latitude</span>
          <input
            name="latitude"
            value={values.latitude}
            onChange={handleChange}
            placeholder="64.1466"
            inputMode="decimal"
          />
        </label>
        <label>
          <span>Longitude</span>
          <input
            name="longitude"
            value={values.longitude}
            onChange={handleChange}
            placeholder="-21.9426"
            inputMode="decimal"
          />
        </label>
      </div>
      <label>
        <span>Notes</span>
        <textarea name="notes" value={values.notes} onChange={handleChange} rows={3} />
      </label>
      <div className="form-actions">
        <button className="btn secondary" type="button" onClick={handleGeolocate}>
          Use current location
        </button>
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  )
}

