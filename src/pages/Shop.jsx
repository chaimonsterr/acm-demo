import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

const PAGE_SIZE = 24
const SORTS = {
  category: 'Category: A to Z',
  featured: 'Featured',
  'price-asc': 'Price: Low to high',
  'price-desc': 'Price: High to low',
  name: 'Name',
}

function sortList(list, sort) {
  const byName = (a, b) => a.name.localeCompare(b.name)
  const s = [...list]
  if (sort === 'category') s.sort((a, b) => a.category.localeCompare(b.category) || byName(a, b))
  if (sort === 'featured') s.sort((a, b) => Number(b.featured) - Number(a.featured) || byName(a, b))
  if (sort === 'price-asc') s.sort((a, b) => a.price - b.price || byName(a, b))
  if (sort === 'price-desc') s.sort((a, b) => b.price - a.price || byName(a, b))
  if (sort === 'name') s.sort(byName)
  return s
}

function pageList(cur, total) {
  const pages = new Set([1, total, cur - 1, cur, cur + 1])
  if (cur <= 3) [2, 3, 4, 5].forEach((p) => pages.add(p))
  if (cur >= total - 2) [total - 4, total - 3, total - 2, total - 1].forEach((p) => pages.add(p))
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
}

export default function Shop({ eyebrow }) {
  const [all, setAll] = useState(null)
  const [error, setError] = useState(false)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('category') || 'All'
  const sort = params.get('sort') || 'category'
  const page = Math.max(1, Number(params.get('page')) || 1)

  useEffect(() => {
    getProducts().then(setAll).catch(() => setError(true))
  }, [])

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'All' || (key === 'sort' && value === 'category')) next.delete(key)
    else next.set(key, value)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: key !== 'page' })
    if (key === 'page') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = useMemo(() => (all ? [...new Set(all.map((p) => p.category))].sort() : []), [all])

  const filtered = useMemo(() => {
    if (!all) return []
    const needle = q.trim().toLowerCase()
    const list = all.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (!needle || [p.name, p.description, p.manufacturer, p.model].filter(Boolean).join(' ').toLowerCase().includes(needle))
    )
    return sortList(list, sort)
  }, [all, q, cat, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  // Group the current page by category, like the live site.
  const groups = []
  pageItems.forEach((p) => {
    const g = groups[groups.length - 1]
    if (g && g.name === p.category) g.items.push(p)
    else groups.push({ name: p.category, items: [p] })
  })

  return (
    <div className="container">
      <div className="catalog-head">
        <div>
          <p className="eyebrow dash">{eyebrow}</p>
          <h1 className="display h2">Airplane &amp; aircraft models</h1>
        </div>
        <span className="mono-label">{all ? filtered.length : '—'} models</span>
      </div>

      <div className="filters">
        <div>
          <label htmlFor="s-q">Search</label>
          <input id="s-q" className="input" placeholder="Search aircraft, maker, or model" value={q} onChange={(e) => update('q', e.target.value)} />
        </div>
        <div>
          <label htmlFor="s-cat">Category</label>
          <select id="s-cat" className="select" value={cat} onChange={(e) => update('category', e.target.value)}>
            <option>All</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="s-sort">Sort</label>
          <select id="s-sort" className="select" value={sort} onChange={(e) => update('sort', e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="empty">Couldn’t load the catalogue. Please refresh the page.</div>}
      {!all && !error && <div className="loading">Loading the catalogue…</div>}
      {all && filtered.length === 0 && <div className="empty">No models match your search.</div>}

      {groups.map((g, i) => (
        <section key={g.name + i}>
          <div className="group-head">
            <h2>{g.name}</h2>
            <span className="mono-label">{g.items.length} items</span>
          </div>
          <div className="grid">
            {g.items.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      ))}

      {totalPages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button disabled={current === 1} onClick={() => update('page', String(current - 1))}>Prev</button>
          {pageList(current, totalPages).map((n, i, arr) => (
            <span key={n} style={{ display: 'contents' }}>
              {i > 0 && n - arr[i - 1] > 1 && <span>…</span>}
              <button className={n === current ? 'on' : ''} onClick={() => update('page', String(n))}>{n}</button>
            </span>
          ))}
          <button disabled={current === totalPages} onClick={() => update('page', String(current + 1))}>Next</button>
        </nav>
      )}
    </div>
  )
}
