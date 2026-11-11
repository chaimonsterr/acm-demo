import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { useAuth, displayName } from '../auth.jsx'
import { money } from '../api.js'

const STAGES = ['Pending review', 'Design takeoff', 'Artwork approval', 'In production', 'Quality check', 'Shipped', 'Delivered']

export default function Account() {
  const { user, ready } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState(null)
  const [inquiries, setInquiries] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('id, order_number, created_at, status, subtotal, has_custom_items, order_items(product_name, size_name, quantity)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []))
    supabase
      .from('inquiries')
      .select('id, created_at, inquiry_type, message, status')
      .order('created_at', { ascending: false })
      .then(({ data }) => setInquiries(data || []))
  }, [user])

  if (!ready) return <div className="container loading">Loading…</div>
  if (!user) return <Navigate to="/login?next=/account" replace />

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="container">
      <div className="catalog-head">
        <div>
          <p className="eyebrow dash">Account</p>
          <h1 className="display h2">{displayName(user) || 'Your account'}</h1>
          <div className="muted">{user.email}</div>
        </div>
        <button className="btn" onClick={signOut}>Sign out</button>
      </div>

      <section style={{ padding: '34px 0' }}>
        <h2 className="display h3" style={{ marginBottom: 16 }}>My orders</h2>
        {!orders && <div className="muted">Loading…</div>}
        {orders && orders.length === 0 && (
          <p className="muted">No orders yet. <Link to="/shop" className="link-underline">Browse the shop</Link></p>
        )}
        {orders?.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-top">
              <div>
                <strong>{o.order_number}</strong>
                <div className="muted" style={{ fontSize: '0.85rem' }}>{new Date(o.created_at).toLocaleDateString()}</div>
              </div>
              <span className="tag solid">{o.status}</span>
            </div>
            <ul className="order-items">
              {o.order_items.map((it, i) => <li key={i}>{it.quantity} × {it.product_name} <span className="muted">({it.size_name})</span></li>)}
            </ul>
            {o.status !== 'Cancelled' && (
              <div className="stages">
                {STAGES.map((s, i) => (
                  <span key={s} className={i <= STAGES.indexOf(o.status) ? 'on' : ''} title={s} />
                ))}
              </div>
            )}
            <div className="muted" style={{ fontSize: '0.88rem' }}>
              Subtotal {money(o.subtotal || 0)}{o.has_custom_items ? ' + custom-quote items' : ''}
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: '10px 0 20px' }}>
        <h2 className="display h3" style={{ marginBottom: 16 }}>My requests</h2>
        {inquiries && inquiries.length === 0 && <p className="muted">No custom requests yet. <Link to="/customize" className="link-underline">Send one</Link></p>}
        {inquiries?.map((q) => (
          <div className="order-card" key={q.id}>
            <div className="order-top">
              <div>
                <strong>{q.inquiry_type}</strong>
                <div className="muted" style={{ fontSize: '0.85rem' }}>{new Date(q.created_at).toLocaleDateString()}</div>
              </div>
              <span className="tag">{q.status}</span>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{q.message.length > 220 ? q.message.slice(0, 220) + '…' : q.message}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
