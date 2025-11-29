import { Link } from 'react-router-dom'

export function NotFoundRoute() {
  return (
    <section className="route glass-panel not-found">
      <h2>Lost among the stars</h2>
      <p>The page you’re looking for doesn’t exist yet. Head back to the chart list to keep exploring.</p>
      <Link className="btn secondary" to="/">
        Return home
      </Link>
    </section>
  )
}

