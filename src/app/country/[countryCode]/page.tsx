import { Metadata } from 'next'

type CountryParams = {
  params: {
    countryCode: string
  }
}

export const generateMetadata = async ({ params }: CountryParams): Promise<Metadata> => {
  return {
    title: `Detalhes - ${params.countryCode}`
  }
}

async function getCountry(code: string) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
  const data = await res.json()
  return data[0]
}

export default async function CountryPage({ params }: CountryParams) {
  const country = await getCountry(params.countryCode)

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {country.translations?.por?.common || country.name.common}
      </h1>
      <img src={country.flags.svg} alt={country.name.common} className="w-48 mb-4" />
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
