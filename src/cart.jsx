import { createContext, useContext, useEffect, useState } from 'react'

// Demo cart kept in this browser only. Checkout will save orders to Supabase later.
const CartContext = createContext(null)
const KEY = 'acm-demo-cart'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (item) => setItems((list) => [...list, { ...item, key: Date.now() + Math.random() }])
  const remove = (key) => setItems((list) => list.filter((i) => i.key !== key))
  const setQuantity = (key, quantity) =>
    setItems((list) => list.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)))
  const clear = () => setItems([])
  const count = items.reduce((n, i) => n + i.quantity, 0)
  const subtotal = items.reduce((n, i) => n + (i.unitPrice ? i.unitPrice * i.quantity : 0), 0)
  const hasCustom = items.some((i) => !i.unitPrice)

  return (
    <CartContext.Provider value={{ items, add, remove, setQuantity, clear, count, subtotal, hasCustom }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
