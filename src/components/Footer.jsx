import { Link } from 'react-router-dom'
import { IMG } from '../api.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={IMG.logo} alt="" />
        <div>
          <h4 className="eyebrow dash" style={{ marginBottom: 4 }}>Aircraft City Model</h4>
          <strong>Aircraft Models</strong>
        </div>
      </div>
      <div>
        <h4>Shop</h4>
        <Link to="/shop">Aircraft models</Link>
        <Link to="/collections">Collections</Link>
        <Link to="/shop">Browse products</Link>
      </div>
      <div>
        <h4>Company</h4>
        <Link to="/">About</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/login">Account</Link>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="mailto:lyndon@aircraftcitymodel.com">lyndon@aircraftcitymodel.com</a>
        <span className="muted" style={{ fontSize: '0.9rem' }}>Mon–Fri · 9AM–6PM</span>
      </div>
    </footer>
  )
}
