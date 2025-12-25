import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/api/products'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  })

  // ===== FETCH DATA =====
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ===== HANDLE FORM =====
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '' })
    setEditingId(null)
  }

  // ===== CREATE & UPDATE =====
  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    }

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      resetForm()
      fetchProducts() // auto update
    } catch (err) {
      console.error(err)
    }
  }

  // ===== EDIT =====
  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    })
  }

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm('Hapus product ini?')) return

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      fetchProducts() // auto update
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Product CRUD</h1>

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <div style={{ marginTop: 8 }}>
          <button type="submit">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== LIST ===== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th width="160">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="5" align="center">
                  No data
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id} data-testid={`product-row-${p.id}`}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
