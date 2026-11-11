import { Link } from 'react-router-dom'

export default function Placeholder({ title, notFound }) {
  return (
    <div className="container placeholder">
      <p className="eyebrow dash" style={{ justifyContent: 'center' }}>{notFound ? '404' : 'Coming in the next build step'}</p>
      <h1 className="display h2">{title}</h1>
      <p>
        {notFound
          ? 'This page doesn’t exist in the demo copy.'
          : 'This page will work with demo accounts and orders saved to the project’s Supabase database — no real payments.'}
      </p>
      <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
    </div>
  )
}
