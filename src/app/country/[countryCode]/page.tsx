// @ts-nocheck

import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function CountryPage({ params }) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${params.countryCode}`)
  if (!res.ok) return notFound()

  const data = await res.json()
  const country = data[0]
  if (!country) return notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {country.translations?.por?.common || country.name.common}
      </h1>
      <Image
        src={country.flags.svg}
        alt={`Bandeira de ${country.name.common}`}
        width={320}
        height={200}
        className="mb-4 border"
      />
      <p><strong>População:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Moedas:</strong>{' '}
        {country.currencies
          ? Object.values(country.currencies).map((c: any) => `${c.name} (${c.symbol})`).join(', ')
          : 'N/A'}
      </p>
      <p><strong>Línguas:</strong>{' '}
        {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
      </p>
      <p><strong>Região:</strong> {country.region}</p>
      <p><strong>Sub-região:</strong> {country.subregion}</p>
    </div>
  )
}
