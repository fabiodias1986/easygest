'use client'

import { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'

type Property = {
  id: string
  cmi: string
  al: string
  location: string
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [showAllRecords, setShowAllRecords] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) throw new Error('Failed to fetch properties')
      const data = await response.json()
      setProperties(data)
      setTotalRecords(data.length)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const filtered = properties.filter(
        prop => prop.cmi.toLowerCase().includes(term.toLowerCase()) ||
                prop.al.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredProperties(filtered)
    }, 300),
    [properties]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    setShowAllRecords(false)
    debouncedSearch(term)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentProperty) return

    const url = currentProperty.id ? `/api/properties/${currentProperty.id}` : '/api/properties'
    const method = currentProperty.id ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProperty),
      })
      if (!response.ok) throw new Error('Failed to save property')
      await fetchProperties()
      setIsModalOpen(false)
      setCurrentProperty(null)
      setShowSuccessModal(true) // Show success modal
      setTimeout(() => setShowSuccessModal(false), 3000) // Hide after 3 seconds
    } catch (error) {
      console.error('Error saving property:', error)
    }
  }

  const handleDelete = async (id: string) => {
    const password = prompt('Digite a senha para excluir:')
    if (password !== 'easygest2024') {
      alert('Senha incorreta')
      return
    }

    try {
      const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete property')
      await fetchProperties()
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const handleShowAllRecords = () => {
    setShowAllRecords(true)
    setSearchTerm('')
    setFilteredProperties([])
  }

  const sortedProperties = [...(searchTerm ? filteredProperties : properties)].sort((a, b) => 
    a.cmi.localeCompare(b.cmi)
  )

  const displayProperties = showAllRecords ? sortedProperties : (searchTerm ? filteredProperties : [])

  return (
    <div className="min-h-screen bg-slate/80 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className=" text-center text-3xl font-semibold mb-8 text-blue-700">Gestor de Localizações</h1>
        
        <div className="mb-8 flex space-x-2">
          <input
            type="text"
            placeholder="Pesquisar por CMI ou AL"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 rounded border focus:outline-none"
          />
          <button
            onClick={() => {
              setCurrentProperty({ id: '', cmi: '', al: '', location: '' })
              setIsModalOpen(true)
            }}
            className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600"
          >
            Adicionar
          </button>
          <button
            onClick={handleShowAllRecords}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
          >
            Mostrar Todos
          </button>
        </div>

        <p className="mb-4">Total de registos: {totalRecords}</p>

        {displayProperties.length === 0 ? (
          <p>{showAllRecords ? "Nenhuma Localização encontrada." : "Clique em 'Mostrar Todos' para ver os registos ou faça uma pesquisa."}</p>
        ) : (
          <ul>
            {displayProperties.map((property) => (
              <li key={property.id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
                <div>
                  <p><strong>CMI:</strong> {property.cmi}</p>
                  <p><strong>AL:</strong> {property.al}</p>
                  <p><strong>Localização:</strong> <a href={property.location} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{property.location}</a></p>
                </div>
                <div>
                  <button onClick={() => { setCurrentProperty(property); setIsModalOpen(true); }} className="text-blue-500 mr-2">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(property.id)} className="text-red-500">
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg w-96">
              <h2 className="text-xl mb-4">{currentProperty?.id ? 'Editar' : 'Adicionar'} Localização</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="CMI"
                  value={currentProperty?.cmi || ''}
                  onChange={(e) => setCurrentProperty(prev => ({ ...prev!, cmi: e.target.value }))}
                  className="w-full p-2 mb-2 rounded border focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="AL"
                  value={currentProperty?.al || ''}
                  onChange={(e) => setCurrentProperty(prev => ({ ...prev!, al: e.target.value }))}
                  className="w-full p-2 mb-2 rounded border focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Link da localização"
                  value={currentProperty?.location || ''}
                  onChange={(e) => setCurrentProperty(prev => ({ ...prev!, location: e.target.value }))}
                  className="w-full p-2 mb-2 rounded border focus:outline-none"
                  required
                />
                <div className="flex justify-end mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg">
              <p className="text-xl text-blue-600">Localização adicionada com sucesso!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}