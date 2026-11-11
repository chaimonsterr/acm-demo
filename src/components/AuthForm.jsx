import { useState } from 'react'
import { supabase } from '../supabase.js'

// Sign in / create account with demo accounts in the project's Supabase.
export default function AuthForm({ onDone }) {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg({ type: '', text: '' })
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password })
      setBusy(false)
      if (error) return setMsg({ type: 'error', text: error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message })
      onDone?.()
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { full_name: form.name.trim() }, emailRedirectTo: window.location.origin + '/account' },
      })
      setBusy(false)
      if (error) return setMsg({ type: 'error', text: error.message })
      if (!data.session) return setMsg({ type: 'ok', text: 'Account created. Check your email to confirm it, then sign in.' })
      onDone?.()
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="theme-toggle" style={{ marginBottom: 22 }}>
        <button type="button" className={mode === 'signin' ? 'on' : ''} onClick={() => setMode('signin')}>SIGN IN</button>
        <button type="button" className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>CREATE ACCOUNT</button>
      </div>
      {msg.text && <div className={'notice' + (msg.type === 'error' ? ' error' : '')}>{msg.text}</div>}
      {mode === 'signup' && (
        <div className="field"><label htmlFor="a-name">Full name</label><input id="a-name" className="input" value={form.name} onChange={set('name')} maxLength={120} required /></div>
      )}
      <div className="field"><label htmlFor="a-email">Email</label><input id="a-email" type="email" autoComplete="email" className="input" value={form.email} onChange={set('email')} required /></div>
      <div className="field">
        <label htmlFor="a-pass">Password</label>
        <input id="a-pass" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} className="input" value={form.password} onChange={set('password')} minLength={6} required />
      </div>
      <p className="muted" style={{ fontSize: '0.8rem', margin: '0 0 14px' }}>Demo accounts only — don’t reuse a password from another site.</p>
      <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>
      <p className="muted" style={{ fontSize: '0.88rem', marginTop: 14, textAlign: 'center' }}>
        {mode === 'signin' ? 'Need an account? ' : 'Already have an account? '}
        <button type="button" className="link-underline" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }} onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </form>
  )
}
