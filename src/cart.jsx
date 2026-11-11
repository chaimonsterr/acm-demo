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
  const count = items.reduce((n, i) => n + i.quantity, 0)

  return <CartContext.Provider value={{ items, add, remove, count }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
