// src/app/country/[countryCode]/page.tsx

import React from 'react'

async function getCountry(code: string) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
  const data = await res.json()
  return data[0]
}

export default async function CountryDetail({
  params,
}: {
  params: { countryCode: string }
}) {
  const country = await getCountry(params.countryCode)

  return (
    <div style={{ padding: '20px' }}>
      <h1>{country.translations?.por?.common || country.name.common}</h1>

      <img
        src={country.flags.svg}
        alt={`Bandeira de ${country.name.common}`}
        width={200}
      />

      <p>
        <strong>População:</strong>{' '}
        {country.population.toLocaleString('pt-BR')}
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
        {country.languages
          ? Object.values(country.languages).join(', ')
          : 'N/A'}
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
