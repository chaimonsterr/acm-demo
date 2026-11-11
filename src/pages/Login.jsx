import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import AuthForm from '../components/AuthForm.jsx'

export function MemberPitch({ title = 'Sign in to your account' }) {
  return (
    <div>
      <p className="eyebrow dash">Member access</p>
      <h1 className="display h2">{title}</h1>
      <p className="lead" style={{ marginTop: 16 }}>Login required before checkout and order confirmation.</p>
      <ul className="checklist">
        <li>Fast checkout</li>
        <li>Saved details</li>
        <li>Exclusive updates</li>
      </ul>
    </div>
  )
}

export default function Login() {
  const { user, ready } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/account'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/account'

  useEffect(() => {
    if (ready && user) navigate(safeNext, { replace: true })
  }, [ready, user, navigate, safeNext])

  return (
    <div className="container">
      <section className="section bespoke">
        <MemberPitch />
        <AuthForm onDone={() => navigate(safeNext, { replace: true })} />
      </section>
    </div>
  )
}
