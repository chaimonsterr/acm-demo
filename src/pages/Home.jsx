import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IMG, getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'

const STATS = [
  ['Material', 'Hand-carved', 'Solid mahogany, painted and detailed by aviation artisans.'],
  ['Custom orders', '24 hours', 'A dedicated designer contacts you after you order.'],
  ['Approval', 'Every mockup', 'Production starts only once you approve the details.'],
  ['Delivery', 'Worldwide', 'Standard and expedited shipping options.'],
]

const STEPS = [
  {
    eyebrow: 'Design takeoff',
    title: 'Design Takeoff',
    text: 'Once you place your custom aircraft model order, within 24 hours, a dedicated designer will contact you to guide you through the customization process. This initial consultation collects every critical detail needed to replicate your aircraft accurately.',
    bullets: ['Aircraft type and configuration', 'Livery, paint scheme, and markings', 'Tail numbers, logos, and insignia', 'Special modifications or historical details'],
    note: 'This stage sets the foundation for a truly personalized aviation model — no detail is missed.',
  },
  {
    eyebrow: 'Confirm the route',
    title: 'Artwork Review and Approval',
    text: 'You will receive a detailed order form and visual mockups created specifically for your aircraft. These mockups are used by our artisans during production and are a critical step in maintaining accuracy.',
    bullets: ['Review all specifications and artwork', 'Request changes or refinements', 'Upload additional reference photos or documentation'],
    note: 'Production does not begin until you approve every detail, ensuring your custom airplane replica matches your expectations before carving starts.',
  },
  {
    eyebrow: 'Handcrafted production',
    title: 'Precision Carving, Painting, and Detailing',
    text: 'Once approved, your custom aircraft model enters production. Each model is hand-carved and molded from solid mahogany wood, providing durability, balance, and a premium finish.',
    bullets: ['Precision carving and shaping', 'Putty priming to refine contours and proportions', 'Hand painting and airbrushing for accurate color matching', 'Stencils and in-house decals to replicate markings and insignia'],
    note: 'This stage typically takes up to 10 weeks, with rush production options available for select models — every step is completed by skilled artisans with aviation-specific experience.',
  },
  {
    eyebrow: 'Quality check',
    title: 'Quality Check and Final Approval',
    text: 'Once production is complete, your model goes through a thorough quality inspection. We then email high-resolution photos of the finished aircraft model for your final approval.',
    bullets: ['Color accuracy', 'Placement of markings and details', 'Overall proportions and finish'],
    note: 'After approval, a final protective lacquer coat is applied to preserve the model’s appearance and protect it for long-term display.',
  },
  {
    eyebrow: 'Secure shipping',
    title: 'Careful Packaging and Delivery',
    text: 'After the lacquer has fully cured, your custom airplane model is carefully packaged in a container designed specifically for your aircraft type. This protects the model from movement, impact, and environmental exposure during transit.',
    bullets: ['Standard shipping: approximately 14 days', 'Expedited shipping: 3 to 5 days, depending on location'],
    note: 'Standard orders ship weekly to our U.S. distribution center, while rush orders ship directly from the factory to reduce transit time.',
  },
]

function Featured() {
  const [items, setItems] = useState(null)
  useEffect(() => {
    getProducts()
      .then((list) => {
        const featured = list.filter((p) => p.featured)
        // The live site has no featured products yet; fall back to a few aircraft models.
        setItems((featured.length ? featured : list.filter((p) => p.category === 'Aircraft Model')).slice(0, 3))
      })
      .catch(() => setItems([]))
  }, [])
  if (!items) return <div className="loading">Loading models…</div>
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
      {items.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  )
}

function CustomForm() {
  const [sent, setSent] = useState(false)
  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <h3>Send us your idea</h3>
      {sent && <div className="notice">Demo copy: requests will be saved to the project database in the next build step. Nothing was sent.</div>}
      <div className="row-2">
        <div className="field"><label htmlFor="cf-name">Name</label><input id="cf-name" className="input" required /></div>
        <div className="field"><label htmlFor="cf-email">Email</label><input id="cf-email" type="email" className="input" required /></div>
      </div>
      <div className="field"><label htmlFor="cf-phone">Phone (optional)</label><input id="cf-phone" className="input" /></div>
      <div className="field">
        <label htmlFor="cf-msg">Tell us about your custom model</label>
        <textarea id="cf-msg" className="textarea" placeholder="Aircraft type, livery, tail numbers, scale, or anything else we should know..." required />
      </div>
      <div className="field"><label htmlFor="cf-file">Reference image (optional)</label><input id="cf-file" type="file" accept="image/*" className="input" /></div>
      <button className="btn btn-primary btn-block" type="submit">Send request</button>
    </form>
  )
}

export default function Home() {
  return (
    <>
      <div className="container">
        <section className="hero">
          <div>
            <p className="eyebrow dash">Aircraft models &amp; aviation collectibles</p>
            <h1 className="display h1">
              Hand-carved aircraft, <em>made to your livery.</em>
            </h1>
            <p className="lead">
              Airliners, fighter jets and tail flashes carved and painted by hand, or built from your own aircraft, paint scheme and markings for collectors, brands and enthusiasts.
            </p>
            <div className="hero-ctas">
              <Link to="/shop" className="btn btn-primary">Explore aircraft</Link>
              <Link to="/customize" className="btn">Create your custom model</Link>
            </div>
          </div>
          <div className="hero-art">
            <div className="plate"><img src={IMG.f22} alt="F-22 Raptor fighter jet scale model" /><span className="plate-label">F-22 Raptor</span></div>
            <div className="plate"><img src={IMG.b2} alt="B-2 Spirit stealth bomber airplane model" /><span className="plate-label">B-2 Spirit</span></div>
            <div className="plate"><img src={IMG.tailflash} alt="Custom aircraft tail flash" /><span className="plate-label">Tail flash</span></div>
          </div>
        </section>

        <div className="stats">
          {STATS.map(([k, v, d]) => (
            <div className="stat" key={k}>
              <p className="eyebrow" style={{ margin: 0 }}>{k}</p>
              <h3>{v}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <section className="section">
          <p className="eyebrow dash">Product families</p>
          <h2 className="display h2" style={{ maxWidth: 360, marginBottom: 36 }}>Three ways to build a collection.</h2>
          <div className="families">
            <div className="family tall">
              <div className="plate family-plate"><img src={IMG.f22} alt="Aircraft" /></div>
              <div className="family-meta">
                <p className="eyebrow">Collector-grade aircraft</p>
                <h3>Aircraft</h3>
                <p>Premium aircraft models crafted for collectors, offices, and aviation enthusiasts who want authentic display pieces.</p>
                <Link to="/shop" className="link-underline">Learn more</Link>
              </div>
            </div>
            <div className="family-col">
              <div className="family">
                <div className="plate family-plate"><img src={IMG.tailflash} alt="Tailflash" /></div>
                <div className="family-meta">
                  <p className="eyebrow">Signature tailflash pieces</p>
                  <h3>Tailflash</h3>
                  <p>Custom aviation detailing for branded displays, collector themes, and premium aircraft statement builds.</p>
                  <Link to="/shop" className="link-underline">Learn more</Link>
                </div>
              </div>
              <div className="family">
                <div className="plate family-plate"><img src={IMG.f106} alt="Aircraft" /></div>
                <div className="family-meta">
                  <p className="eyebrow">Tailored to your aircraft</p>
                  <h3>Aircraft</h3>
                  <p>Built for collectors, teams, and bespoke projects where aviation identity and finish details matter most.</p>
                  <Link to="/customize" className="link-underline">Learn more</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="section-head">
            <div>
              <p className="eyebrow dash">Curated picks</p>
              <h2 className="display h2">Featured aircraft models</h2>
            </div>
            <Link to="/shop" className="link-underline">View all products</Link>
          </div>
          <Featured />
        </section>

        <section className="section section-rule" id="customize">
          <div className="bespoke">
            <div>
              <p className="eyebrow dash">Bespoke builds</p>
              <h2 className="display h2">Customize your airplane model</h2>
              <p className="lead" style={{ marginTop: 18 }}>
                Have an aircraft, livery, or tail flash in mind? Send us a message and a reference photo if you have one, and a designer will follow up by email to work out the details.
              </p>
              <ul className="checklist">
                <li>Share reference photos or markings</li>
                <li>Describe scale, finish, and special requests</li>
                <li>Hear back from a designer by email</li>
              </ul>
            </div>
            <CustomForm />
          </div>
        </section>

        <section className="section-rule">
          <div className="feature-row">
            <div className="plate"><img src={IMG.b2} alt="" /></div>
            <div>
              <p className="eyebrow dash">Precision craftsmanship</p>
              <h2 className="display h2">Built to feel authentic, not generic.</h2>
              <p className="lead">Our aircraft collectibles are designed around the details collectors notice first: proportion, body lines, finishing, and presentation. Every piece is chosen for its presence and context.</p>
            </div>
          </div>
          <div className="feature-row flip">
            <div>
              <p className="eyebrow dash">Materials &amp; finish</p>
              <h2 className="display h2">Premium surfaces with collector appeal.</h2>
              <p className="lead">From die-cast construction to custom aviation finishes, the experience is refined to deliver both visual impact and long-term display value.</p>
            </div>
            <div className="plate"><img src={IMG.f106} alt="" /></div>
          </div>
          <div className="feature-row">
            <div className="plate"><img src={IMG.f22} alt="" /></div>
            <div>
              <p className="eyebrow dash">Designed for your aircraft story</p>
              <h2 className="display h2">Tailored customization for memorable collections.</h2>
              <p className="lead">Whether you are ordering a signature model, a custom-sized aircraft, or a branded display piece, each configuration is structured to feel premium and personal.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <p className="eyebrow dash">Our process</p>
          <h2 className="display h2" style={{ maxWidth: 420, paddingBottom: 30, borderBottom: '1px solid var(--line-strong)' }}>
            How your aircraft model is created, from start to finish
          </h2>
          {STEPS.map((s, i) => (
            <div className="process-step" key={s.title}>
              <div className="process-num">0{i + 1}</div>
              <div>
                <p className="mono-label" style={{ margin: 0 }}>{s.eyebrow}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="bullets">{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                <div className="callout">{s.note}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="section section-rule" style={{ paddingTop: 60 }}>
          <div className="fedex">
            <div>
              <p className="eyebrow dash">As featured by FedEx</p>
              <h2 className="display h2">Soaring to new heights: a Filipino entrepreneur’s journey</h2>
              <p className="lead" style={{ maxWidth: 640, marginTop: 14 }}>
                FedEx Business Insights profiled founder Lyndon Uson and how Aircraft City grew from a lifelong love of airplanes into a Philippines-based workshop shipping hand-carved mahogany aircraft models to collectors worldwide.
              </p>
              <blockquote>
                “We are very particular about details. Since our models are handmade, characteristics such as the size of the propeller and the internal cockpit are taken into design consideration.”
                <cite>Lyndon Uson, Founder</cite>
              </blockquote>
            </div>
            <a className="btn" href="https://www.fedex.com/en-ph/business-insights/sme/how-a-filipino-entrepreneurs-passion-for-aircraft-took-off.html" target="_blank" rel="noreferrer">
              Read the story on FedEx
            </a>
          </div>
        </section>

        <section className="section-rule" style={{ paddingTop: 84 }}>
          <div className="plate cta-band">
            <div className="cta-text">
              <p className="eyebrow dash">Bring your aircraft to life</p>
              <h2 className="display h2">Own a piece of aviation history.</h2>
              <p className="lead" style={{ maxWidth: 420, margin: '16px 0 26px' }}>
                Start with a signature model or create a fully customized collector piece tailored to your aircraft story.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/shop" className="btn btn-primary">Start your order</Link>
                <Link to="/login" className="btn">Sign in to account</Link>
              </div>
            </div>
            <img src={IMG.f22} alt="" />
          </div>
        </section>
      </div>
    </>
  )
}
