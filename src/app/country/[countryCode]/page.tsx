// src/app/country/[countryCode]/page.tsx
import React from 'react'

interface Params {
  params: {
    countryCode: string;
  };
}

async function getCountry(code: string) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
  const data = await res.json()
  return data[0] // a API retorna um array com 1 item
}

export default async function CountryDetail({ params }: Params) {
  const country = await getCountry(params.countryCode)

  return (
    <div style={{ padding: '20px' }}>
      <h1>{country.translations?.por?.common || country.name.common}</h1>
      <img src={country.flags.svg} alt={country.name.common} width={200} />
      <p><strong>População:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Moedas:</strong> {country.currencies ? Object.values(country.currencies).map((c: any) => c.name).join(', ') : 'N/A'}</p>
      <p><strong>Línguas:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
      <p><strong>Região:</strong> {country.region}</p>
      <p><strong>Sub-região:</strong> {country.subregion}</p>
    </div>
  )
}
