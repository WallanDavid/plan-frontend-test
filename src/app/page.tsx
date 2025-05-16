'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

const LANGUAGE_NAMES: Record<string, string> = {
  por: 'Português',
  eng: 'Inglês',
  spa: 'Espanhol',
  fra: 'Francês',
  deu: 'Alemão',
  ita: 'Italiano',
  rus: 'Russo',
  jpn: 'Japonês',
  zho: 'Chinês',
  ara: 'Árabe',
  hin: 'Hindi',
}

type Country = {
  cca3: string;
  name: {
    common: string;
    official: string;
    nativeName?: {
      por?: { official: string; common: string };
    };
  };
  flags: {
    svg: string;
    png: string;
  };
  region: string;
  languages?: {
    [key: string]: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
};

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([])
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedContinents, setSelectedContinents] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const router = useRouter()

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all')
        const data = await response.json()
        setCountries(data)

        const langs = new Set<string>()
        data.forEach((country: Country) => {
          if (country.languages) {
            Object.keys(country.languages).forEach((lang) => langs.add(lang))
          }
        })
        setAvailableLanguages(Array.from(langs).sort())
      } catch (error) {
        console.error('Erro ao buscar países:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const handleContinentChange = (continent: string) => {
    setSelectedContinents(prev =>
      prev.includes(continent)
        ? prev.filter(c => c !== continent)
        : [...prev, continent]
    )
  }

  const filteredCountries = countries.filter((country) => {
    const name = country.name.nativeName?.por?.common || country.name.common
    const regionMatch =
      selectedContinents.length === 0 || selectedContinents.includes(country.region)
    const languageMatch =
      selectedLanguage === '' ||
      Object.keys(country.languages || {}).includes(selectedLanguage)

    return (
      name.toLowerCase().includes(search.toLowerCase()) &&
      regionMatch &&
      languageMatch
    )
  })

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentCountries = filteredCountries.slice(startIndex, startIndex + itemsPerPage)

  return (
    <main className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Catálogo de Países</h1>

      <input
        type="text"
        placeholder="Buscar por nome..."
        className="border px-4 py-2 rounded mb-6 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />

      <div className="mb-6">
        <label className="block font-semibold mb-2">Filtrar por continente:</label>
        {['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].map((continent) => (
          <label key={continent} className="mr-4">
            <input
              type="checkbox"
              value={continent}
              checked={selectedContinents.includes(continent)}
              onChange={() => {
                handleContinentChange(continent)
                setCurrentPage(1)
              }}
              className="mr-1"
            />
            {continent}
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Filtrar por idioma:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value)
            setCurrentPage(1)
          }}
          className="border px-4 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os idiomas</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_NAMES[lang] || lang}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando países...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentCountries.map((country) => (
              <div
                key={country.cca3}
                className="border p-4 rounded-xl shadow hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
                onClick={() => router.push(`/country/${country.cca3}`)}
              >
                <img
                  src={country.flags.png}
                  alt={`Bandeira de ${country.name.common}`}
                  className="w-20 h-auto mb-3"
                />
                <h2 className="text-lg font-bold mb-1">
                  {country.name.nativeName?.por?.common || country.name.common}
                </h2>
                <p className="text-sm text-gray-600">Região: {country.region}</p>
                <p className="text-sm text-gray-600">
                  Moeda:{' '}
                  {country.currencies
                    ? Object.values(country.currencies)
                      .map((currency) => `${currency.name} (${currency.symbol})`)
                      .join(', ')
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </main>
  )
}
