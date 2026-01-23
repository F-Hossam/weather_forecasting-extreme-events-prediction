'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const POPULAR_CITIES = [
  { name: 'New York', country: 'USA', icon: '🗽' },
  { name: 'London', country: 'UK', icon: '🇬🇧' },
  { name: 'Tokyo', country: 'Japan', icon: '🗾' },
  { name: 'Paris', country: 'France', icon: '🗼' },
  { name: 'Dubai', country: 'UAE', icon: '🌆' },
  { name: 'Sydney', country: 'Australia', icon: '🦘' },
  { name: 'Berlin', country: 'Germany', icon: '🇩🇪' },
  { name: 'Amsterdam', country: 'Netherlands', icon: '🚲' },
  { name: 'Barcelona', country: 'Spain', icon: '🏖️' },
  { name: 'Rome', country: 'Italy', icon: '🏛️' },
  { name: 'Bangkok', country: 'Thailand', icon: '🇹🇭' },
  { name: 'Singapore', country: 'Singapore', icon: '🌃' },
]

export default function ChangeCity() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCity = searchParams.get('city')
  const [searchInput, setSearchInput] = useState('')

  const handleSelectCity = (cityName: string) => {
    router.push(`/dashboard?city=${encodeURIComponent(cityName)}`)
  }

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    city.country.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Select a New City</h1>
          <p className="text-slate-400 text-sm mt-1">
            {currentCity && `Currently viewing: ${currentCity}`}
          </p>
        </div>
        <Link href={currentCity ? `/dashboard?city=${currentCity}` : '/'}>
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
            Back
          </Button>
        </Link>
      </div>

      {/* Search Box */}
      <Card className="bg-slate-800 border-slate-600 p-6 mb-8">
        <input
          type="text"
          placeholder="Search cities by name or country..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </Card>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredCities.map((city) => (
          <Button
            key={city.name}
            onClick={() => handleSelectCity(city.name)}
            className="h-auto p-6 bg-slate-800 hover:bg-blue-600 border border-slate-600 hover:border-blue-400 transition-all duration-300 flex flex-col items-start gap-3 group"
            variant="outline"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform">{city.icon}</div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-white text-left">{city.name}</div>
              <div className="text-sm text-slate-300 text-left">{city.country}</div>
            </div>
          </Button>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <Card className="bg-slate-800 border-slate-600 p-8 text-center">
          <p className="text-slate-400 text-lg mb-4">No cities found matching your search</p>
          <Button
            onClick={() => setSearchInput('')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Clear Search
          </Button>
        </Card>
      )}

      {/* Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-600 p-6">
          <div className="text-blue-400 text-2xl mb-2">🌍</div>
          <h3 className="font-semibold text-white mb-2">Global Cities</h3>
          <p className="text-sm text-slate-400">
            Choose from major cities around the world
          </p>
        </Card>
        <Card className="bg-slate-800 border-slate-600 p-6">
          <div className="text-blue-400 text-2xl mb-2">🔄</div>
          <h3 className="font-semibold text-white mb-2">Quick Switch</h3>
          <p className="text-sm text-slate-400">
            Instantly view weather for different locations
          </p>
        </Card>
        <Card className="bg-slate-800 border-slate-600 p-6">
          <div className="text-blue-400 text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-white mb-2">Compare Data</h3>
          <p className="text-sm text-slate-400">
            Monitor multiple cities and their forecasts
          </p>
        </Card>
      </div>
    </div>
  )
}
