import { Link } from 'react-router-dom'
import { useCart } from '../cart.jsx'
import { money } from '../api.js'

export default function Cart() {
  const { items, remove, setQuantity, subtotal, hasCustom } = useCart()

  return (
    <div className="container">
      <div className="catalog-head">
        <div>
          <p className="eyebrow dash">Your cart</p>
          <h1 className="display h2">Cart</h1>
        </div>
        <span className="mono-label">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>

      {items.length === 0 ? (
        <div className="placeholder">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((i) => (
              <div className="cart-row" key={i.key}>
                <Link to={`/product/${i.slug}`} className="cart-thumb"><img src={i.image} alt="" referrerPolicy="no-referrer" /></Link>
                <div>
                  <div className="mono-label">{i.category}</div>
                  <Link to={`/product/${i.slug}`} className="cart-name">{i.name}</Link>
                  <div className="muted" style={{ fontSize: '0.88rem' }}>Size: {i.size}</div>
                  {i.details && <div className="muted cart-note">Details: {i.details}</div>}
                  <button className="text-btn" onClick={() => remove(i.key)}>Remove</button>
                </div>
                <div className="cart-right">
                  <div className="stepper" style={{ width: 120, height: 38 }}>
                    <button type="button" onClick={() => setQuantity(i.key, i.quantity - 1)} aria-label="Decrease">−</button>
                    <input value={i.quantity} readOnly aria-label="Quantity" />
                    <button type="button" onClick={() => setQuantity(i.key, i.quantity + 1)} aria-label="Increase">+</button>
                  </div>
                  <strong>{i.unitPrice ? money(i.unitPrice * i.quantity) : 'Custom quote'}</strong>
                </div>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Order summary</h2>
            <div className="sum-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            {hasCustom && <div className="sum-row muted"><span>Custom-quote items</span><span>Priced by email</span></div>}
            <div className="sum-row muted"><span>Shipping</span><span>Quoted by email</span></div>
            <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>Proceed to checkout</Link>
            <Link to="/shop" className="btn btn-block" style={{ marginTop: 10 }}>Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  )
}
