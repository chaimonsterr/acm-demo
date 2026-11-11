import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categoryLabel, getProducts, getSizes, money, productImages } from '../api.js'
import { useCart } from '../cart.jsx'

export default function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(undefined)
  const [sizes, setSizes] = useState([])
  const [img, setImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [sizeId, setSizeId] = useState(null)
  const [details, setDetails] = useState('')
  const [specs, setSpecs] = useState('')
  const [requests, setRequests] = useState('')
  const [toast, setToast] = useState('')
  const { add } = useCart()

  useEffect(() => {
    setProduct(undefined)
    setImg(0)
    setQty(1)
    Promise.all([getProducts(), getSizes()])
      .then(([list, allSizes]) => {
        const p = list.find((x) => x.slug === slug) || null
        setProduct(p)
        if (p) {
          const opts = allSizes.filter((s) => s.category === p.category)
          setSizes(opts)
          setSizeId((opts.find((s) => !s.is_custom) || opts[0] || {}).id ?? null)
        }
      })
      .catch(() => setProduct(null))
  }, [slug])

  const size = useMemo(() => sizes.find((s) => s.id === sizeId), [sizes, sizeId])
  const unit = size && !size.is_custom && size.price ? size.price : null

  if (product === undefined) return <div className="container loading">Loading model…</div>
  if (product === null)
    return (
      <div className="container placeholder">
        <h1 className="display h2">Model not found</h1>
        <p>This model may have been removed from the catalogue.</p>
        <Link to="/shop" className="btn btn-primary">Back to shop</Link>
      </div>
    )

  const images = productImages(product)

  const addToCart = (e) => {
    e.preventDefault()
    add({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: images[0],
      size: size ? size.name : 'Custom size',
      unitPrice: unit,
      quantity: qty,
      details,
      specs,
      requests,
    })
    setToast(`Added ${qty} × ${product.name} to your demo cart`)
    setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className="container">
      <div className="crumbs">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <strong>{product.name}</strong>
      </div>

      <div className="pdp">
        <div>
          <div className="pdp-main-img">
            <img src={images[img]} alt={product.name} referrerPolicy="no-referrer" />
          </div>
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((src, i) => (
                <button key={src} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}>
                  <img src={src} alt="" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <div className="tags">
            <span className="tag">{product.category}</span>
            <span className="tag solid">In stock</span>
          </div>
          <h1>{product.name}</h1>
          <div className="muted">Aircraft City Model · {product.customizable ? 'Custom model' : 'Signature model'}</div>
          <div className="pdp-price">{unit ? money(unit) : 'CUSTOM QUOTE'}</div>
          <div className="muted">{product.description}</div>
          <div className="chips">
            <div className="chip">Premium finish</div>
            <div className="chip">Collector-ready display</div>
            <div className="chip">Custom configuration available</div>
          </div>

          <form className="config" onSubmit={addToCart}>
            <p className="eyebrow dash">Custom build</p>
            <h2>Configure your model</h2>
            <div className="row-2">
              <div className="field">
                <label>Quantity</label>
                <div className="stepper">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
                  <input value={qty} inputMode="numeric" aria-label="Quantity" onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))} />
                  <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase">+</button>
                </div>
              </div>
              <div className="field">
                <label>Product category</label>
                <div className="readonly">{categoryLabel(product.category)}</div>
              </div>
            </div>
            <div className="notice">{categoryLabel(product.category)} category · product type is fixed to this model.</div>

            {sizes.length > 0 && (
              <div className="field">
                <label>Size</label>
                <div className="sizes">
                  {sizes.map((s) => (
                    <button type="button" key={s.id} className={'size' + (s.id === sizeId ? ' on' : '')} onClick={() => setSizeId(s.id)}>
                      <strong>{s.name}</strong>
                      {s.is_custom ? <small>No fixed price</small> : (
                        <>
                          <small>{s.inches}"</small>
                          <b>{money(s.price)}</b>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="p-details">Product / model details</label>
              <textarea id="p-details" className="textarea" placeholder="Required details for the aircraft model specification." value={details} onChange={(e) => setDetails(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="p-specs">Additional specifications</label>
              <textarea id="p-specs" className="textarea" placeholder="Required specifications and finish details." value={specs} onChange={(e) => setSpecs(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="p-req">Additional requests</label>
              <textarea id="p-req" className="textarea" placeholder="Optional notes, delivery preferences, or special custom requests." value={requests} onChange={(e) => setRequests(e.target.value)} />
            </div>

            <div className="total-row">
              <div>
                <span className="mono-label">Order total</span>
                <strong>{unit ? money(unit * qty) : 'Custom quote'}</strong>
              </div>
              <button className="btn btn-primary" type="submit">Add to cart</button>
            </div>
          </form>
        </div>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
