import { Link } from 'react-router-dom'
import { money, productImages } from '../api.js'

export default function ProductCard({ p }) {
  return (
    <Link to={`/product/${p.slug}`} className="card">
      <div className="card-img">
        <img src={productImages(p)[0]} alt={p.name} loading="lazy" referrerPolicy="no-referrer" />
      </div>
      <div className="card-body">
        <div className="mono-label">{p.category}</div>
        <h3>{p.name}</h3>
        <div className="card-sub">Aircraft City Model · {p.customizable ? 'Custom model' : 'Signature model'}</div>
        <div className="card-price">{p.price > 0 ? money(p.price) : 'CUSTOM QUOTE'}</div>
        <div className="card-foot">
          <span className="stock">In stock</span>
          <span className="muted">{p.size || 'Custom'}</span>
        </div>
      </div>
    </Link>
  )
}
