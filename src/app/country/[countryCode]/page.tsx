// src/app/country/[countryCode]/page.tsx
import Image from 'next/image'
import { notFound } from 'next/navigation'

async function getCountry(code: string) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
  const data = await res.json()

  if (!data || data.length === 0) return null
  return data[0]
}

export default async function CountryDetail({
  params,
}: {
  params: { countryCode: string }
}) {
  const country = await getCountry(params.countryCode)

  if (!country) return notFound()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {country.translations?.por?.common || country.name.common}
      </h1>
      <Image
        src={country.flags.svg}
        alt={country.name.common}
        width={320}
        height={200}
        className="mb-4 border"
      />
      <p>
        <strong>População:</strong> {country.population.toLocaleString()}
      </p>
      <p>
        <strong>Moedas:</strong>{' '}
        {country.currencies
          ? Object.values(country.currencies)
            .map((c: any) => `${c.name} (${c.symbol})`)
            .join(', ')
          : 'N/A'}
      </p>
      <p>
        <strong>Línguas:</strong>{' '}
        {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
      </p>
      <p>
        <strong>Região:</strong> {country.region}
      </p>
      <p>
        <strong>Sub-região:</strong> {country.subregion}
      </p>
    </div>
  )
}
