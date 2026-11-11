import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { useAuth, displayName } from '../auth.jsx'
import { useCart } from '../cart.jsx'
import { money } from '../api.js'
import AuthForm from '../components/AuthForm.jsx'
import { MemberPitch } from './Login.jsx'

export default function Checkout() {
  const { user, ready } = useAuth()
  const { items, subtotal, hasCustom, clear } = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', notes: '' })
  const [state, setState] = useState({ status: 'idle', error: '', order: null })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || displayName(user), email: f.email || user.email }))
  }, [user])

  if (!ready) return <div className="container loading">Loading…</div>

  if (!user)
    return (
      <div className="container">
        <section className="section bespoke">
          <MemberPitch />
          <AuthForm />
        </section>
      </div>
    )

  if (state.order)
    return (
      <div className="container placeholder">
        <p className="eyebrow dash" style={{ justifyContent: 'center' }}>Demo order placed</p>
        <h1 className="display h2">Order {state.order.order_number}</h1>
        <p>
          No payment was taken — this is a demo copy. In the real store, a dedicated designer would contact you by email within 24 hours to start the design takeoff.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/account" className="btn btn-primary">View my orders</Link>
          <Link to="/shop" className="btn">Continue shopping</Link>
        </div>
      </div>
    )

  if (items.length === 0)
    return (
      <div className="container placeholder">
        <h1 className="display h2">Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
      </div>
    )

  const placeOrder = async (e) => {
    e.preventDefault()
    setState({ status: 'sending', error: '', order: null })
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        country: form.country.trim(),
        notes: form.notes.trim() || null,
        subtotal,
        has_custom_items: hasCustom,
      })
      .select('id, order_number')
      .single()
    if (error) {
      console.error(error)
      return setState({ status: 'idle', error: 'Could not place the order. Please try again.', order: null })
    }
    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((i) => ({
        order_id: order.id,
        product_slug: i.slug,
        product_name: i.name,
        category: i.category,
        size_name: i.size,
        unit_price: i.unitPrice,
        quantity: i.quantity,
        details: i.details || null,
        specs: i.specs || null,
        requests: i.requests || null,
        image_url: i.image,
      }))
    )
    if (itemsError) {
      console.error(itemsError)
      return setState({ status: 'idle', error: 'The order was created but its items could not be saved. Please contact us.', order: null })
    }
    clear()
    setState({ status: 'done', error: '', order })
  }

  return (
    <div className="container">
      <div className="catalog-head">
        <div>
          <p className="eyebrow dash">Checkout</p>
          <h1 className="display h2">Confirm your order</h1>
        </div>
      </div>
      <div className="cart-layout" style={{ paddingTop: 30 }}>
        <form className="form-card" onSubmit={placeOrder}>
          <h3>Contact and delivery</h3>
          {state.error && <div className="notice error">{state.error}</div>}
          <div className="row-2">
            <div className="field"><label htmlFor="c-name">Full name</label><input id="c-name" className="input" value={form.name} onChange={set('name')} maxLength={120} required /></div>
            <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" className="input" value={form.email} onChange={set('email')} maxLength={200} required /></div>
          </div>
          <div className="row-2">
            <div className="field"><label htmlFor="c-phone">Phone (optional)</label><input id="c-phone" className="input" value={form.phone} onChange={set('phone')} maxLength={40} /></div>
            <div className="field"><label htmlFor="c-country">Country</label><input id="c-country" className="input" value={form.country} onChange={set('country')} maxLength={80} required /></div>
          </div>
          <div className="field">
            <label htmlFor="c-notes">Order notes (optional)</label>
            <textarea id="c-notes" className="textarea" placeholder="Target date, rush request, delivery preferences…" value={form.notes} onChange={set('notes')} maxLength={3000} />
          </div>
          <div className="notice">Demo checkout: no payment is taken. Shipping and custom pricing are confirmed by email.</div>
          <button className="btn btn-primary btn-block" type="submit" disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Placing order…' : 'Place demo order'}
          </button>
        </form>

        <aside className="summary">
          <h2>Order summary</h2>
          {items.map((i) => (
            <div className="sum-row" key={i.key}>
              <span>{i.quantity} × {i.name} <span className="muted">({i.size})</span></span>
              <strong>{i.unitPrice ? money(i.unitPrice * i.quantity) : 'Quote'}</strong>
            </div>
          ))}
          <div className="sum-row total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          {hasCustom && <div className="sum-row muted"><span>Custom-quote items</span><span>Priced by email</span></div>}
          <div className="sum-row muted"><span>Shipping</span><span>Quoted by email</span></div>
        </aside>
      </div>
    </div>
  )
}
