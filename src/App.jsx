import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import DemoBanner from './components/DemoBanner.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Placeholder from './pages/Placeholder.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <DemoBanner />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop eyebrow="Catalog" />} />
          <Route path="/collections" element={<Shop eyebrow="Collections" />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/customize" element={<Placeholder title="Customize your airplane model" />} />
          <Route path="/checkout" element={<Placeholder title="Checkout" />} />
          <Route path="/cart" element={<Placeholder title="Your cart" />} />
          <Route path="/login" element={<Placeholder title="Sign in to your account" />} />
          <Route path="*" element={<Placeholder title="Page not found" notFound />} />
        </Routes>
      </main>
      <div className="container">
        <Footer />
      </div>
    </>
  )
}
