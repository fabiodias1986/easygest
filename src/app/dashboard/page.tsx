'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Property = {
  id: string
  cmi: string
  al: string
  location: string
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newProperty, setNewProperty] = useState({ cmi: '', al: '', location: '' })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      setError('Error fetching properties. Please try again later.')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.cmi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.al.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      })
      if (!response.ok) {
        throw new Error('Failed to add property')
      }
      setNewProperty({ cmi: '', al: '', location: '' })
      fetchProperties()
    } catch (error) {
      setError('Error adding property. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    const password = prompt('Digite a senha para excluir:')
    if (password === 'easygest2024') {
      try {
        const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('Failed to delete property')
        }
        fetchProperties()
      } catch (error) {
        setError('Error deleting property. Please try again.')
      }
    } else {
      alert('Senha incorreta')
    }
  }

  const handleEdit = async (property: Property) => {
    const password = prompt('Digite a senha para editar:')
    if (password === 'easygest2024') {
      const updatedProperty = { ...property }
      updatedProperty.cmi = prompt('Novo CMI:', property.cmi) || property.cmi
      updatedProperty.al = prompt('Novo AL:', property.al) || property.al
      updatedProperty.location = prompt('Nova localização:', property.location) || property.location

      try {
        const response = await fetch(`/api/properties/${property.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProperty),
        })
        if (!response.ok) {
          throw new Error('Failed to update property')
        }
        fetchProperties()
      } catch (error) {
        setError('Error updating property. Please try again.')
      }
    } else {
      alert('Senha incorreta')
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Gerenciador de Localizações de Imóveis</h1>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Pesquisar por CMI ou AL"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 rounded border"
          />
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            placeholder="CMI"
            value={newProperty.cmi}
            onChange={(e) => setNewProperty({ ...newProperty, cmi: e.target.value })}
            className="w-full p-2 mb-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="AL"
            value={newProperty.al}
            onChange={(e) => setNewProperty({ ...newProperty, al: e.target.value })}
            className="w-full p-2 mb-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Link da localização"
            value={newProperty.location}
            onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
            className="w-full p-2 mb-2 rounded border"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Adicionar Propriedade
          </button>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ul>
          {filteredProperties.map((property) => (
            <li key={property.id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
              <div>
                <p><strong>CMI:</strong> {property.cmi}</p>
                <p><strong>AL:</strong> {property.al}</p>
                <p><strong>Localização:</strong> <a href={property.location} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{property.location}</a></p>
              </div>
              <div>
                <button onClick={() => handleEdit(property)} className="text-blue-500 mr-2">
                  ✏️
                </button>
                <button onClick={() => handleDelete(property.id)} className="text-red-500">
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}