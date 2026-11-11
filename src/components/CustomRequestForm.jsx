import { useState } from 'react'
import { supabase } from '../supabase.js'
import { useAuth, displayName } from '../auth.jsx'

const MAX_BYTES = 5 * 1024 * 1024

// "Send us your idea" form. Saves a Custom Order inquiry to Supabase (demo database).
export default function CustomRequestForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: displayName(user), email: user?.email || '', phone: '', message: '' })
  const [file, setFile] = useState(null)
  const [state, setState] = useState({ status: 'idle', error: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (file && file.size > MAX_BYTES) return setState({ status: 'idle', error: 'Reference image must be 5 MB or smaller.' })
    setState({ status: 'sending', error: '' })
    try {
      let reference_image_path = null
      if (file) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
        const path = `${crypto.randomUUID()}.${ext}`
        const { error } = await supabase.storage.from('inquiry-references').upload(path, file, { contentType: file.type })
        if (error) throw error
        reference_image_path = path
      }
      const { error } = await supabase.from('inquiries').insert({
        source: 'website',
        inquiry_type: 'Custom Order',
        customer_name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),
        reference_image_path,
      })
      if (error) throw error
      setState({ status: 'sent', error: '' })
    } catch (err) {
      console.error(err)
      setState({ status: 'idle', error: 'Something went wrong sending your request. Please try again.' })
    }
  }

  if (state.status === 'sent')
    return (
      <div className="form-card">
        <h3>Request received</h3>
        <div className="notice">Saved to the demo database. In the real store, a designer would follow up by email.</div>
        <button className="btn" onClick={() => { setForm({ ...form, message: '' }); setFile(null); setState({ status: 'idle', error: '' }) }}>
          Send another request
        </button>
      </div>
    )

  return (
    <form className="form-card" onSubmit={submit}>
      <h3>Send us your idea</h3>
      {state.error && <div className="notice error">{state.error}</div>}
      <div className="row-2">
        <div className="field"><label htmlFor="cf-name">Name</label><input id="cf-name" className="input" value={form.name} onChange={set('name')} maxLength={120} required /></div>
        <div className="field"><label htmlFor="cf-email">Email</label><input id="cf-email" type="email" className="input" value={form.email} onChange={set('email')} maxLength={200} required /></div>
      </div>
      <div className="field"><label htmlFor="cf-phone">Phone (optional)</label><input id="cf-phone" className="input" value={form.phone} onChange={set('phone')} maxLength={40} /></div>
      <div className="field">
        <label htmlFor="cf-msg">Tell us about your custom model</label>
        <textarea id="cf-msg" className="textarea" placeholder="Aircraft type, livery, tail numbers, scale, or anything else we should know..." value={form.message} onChange={set('message')} maxLength={5000} required />
      </div>
      <div className="field">
        <label htmlFor="cf-file">Reference image (optional)</label>
        <input id="cf-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="input" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <button className="btn btn-primary btn-block" type="submit" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? 'Sending…' : 'Send request'}
      </button>
    </form>
  )
}
