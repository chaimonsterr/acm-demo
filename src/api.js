// Live catalogue from aircraftcitymodel.com (proxied through /api by Vercel / Vite).
let productsPromise
let sizesPromise

export function getProducts() {
  if (!productsPromise) {
    productsPromise = fetch('/api/products')
      .then((r) => {
        if (!r.ok) throw new Error('Could not load products')
        return r.json()
      })
      .then((list) => list.filter((p) => p.status === 'published'))
      .catch((e) => {
        productsPromise = undefined
        throw e
      })
  }
  return productsPromise
}

export function getSizes() {
  if (!sizesPromise) {
    sizesPromise = fetch('/api/product-sizes')
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => [...list].sort((a, b) => a.sort_order - b.sort_order))
      .catch(() => [])
  }
  return sizesPromise
}

// Images that live on the real site are served through /live/assets.
export const asset = (file) => `/live/assets/${file}`

export const IMG = {
  logo: asset('logo-DpvGMLzQ.png'),
  f22: asset('f22-raptor-BWbSTpmF.png'),
  b2: asset('b2-spirit-eb0fFzXs.png'),
  tailflash: asset('tailflash-camo-B9vXMrbD.png'),
  f106: asset('f106-delta-dart-DIPkr0xa.png'),
}

// The real site labels the "Aircraft Model" category as "Aircraft" in the configurator.
export const categoryLabel = (c) => (c === 'Aircraft Model' ? 'Aircraft' : c)

export const money = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const productImages = (p) => {
  const imgs = (p.images && p.images.length ? p.images : [p.image_url]).filter(Boolean)
  return imgs.length ? imgs : [IMG.f22]
}
