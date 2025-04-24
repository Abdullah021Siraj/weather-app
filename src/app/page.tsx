"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { AlertCircle, RefreshCw } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import WeatherForecast from "./components/weather-forecast"
import SearchBar from "./components/search-bar"


interface WeatherData {
  data: {
    city: string;
    country: string;
    condition: {
      description: string;
      icon_url: string;
    };
    temperature: {
      current: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  };
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [city, setCity] = useState("London")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; suggestion?: string } | null>(null)

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true)
    setError(null)
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`

    try {
      const response = await axios.get(url)
      // Transform the data to match our component's expected format
      const transformedData = {
        data: {
          city: response.data.name,
          country: response.data.sys.country,
          condition: {
            description: response.data.weather[0].description,
            icon_url: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
          },
          temperature: {
            current: response.data.main.temp,
            humidity: response.data.main.humidity,
          },
          wind: {
            speed: response.data.wind.speed,
          },
        },
      }
      setWeatherData(transformedData)
      setError(null)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      
      // Handle different error types
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 404) {
            setError({
              message: `We couldn't find weather data for "${cityName}"`,
              suggestion: "Please check the spelling or try another city."
            })
          } else if (error.response.status === 401) {
            setError({
              message: "API key error",
              suggestion: "There's an issue with the weather API authentication."
            })
          } else {
            setError({
              message: "Weather data unavailable",
              suggestion: "We're having trouble getting weather information right now."
            })
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError({
            message: "Network connection issue",
            suggestion: "Please check your internet connection and try again."
          })
        } else {
          // Something happened in setting up the request
          setError({
            message: "Something went wrong",
            suggestion: "We couldn't process your request. Please try again."
          })
        }
      } else {
        setError({
          message: "Unexpected error",
          suggestion: "Something went wrong. Please try again later."
        })
      }
      
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData(city)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setCity(query)
      fetchWeatherData(query.trim())
      setQuery("") // Clear the search input after searching
    }
  }

  const handleRetry = () => {
    fetchWeatherData(city)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Weather Forecast</h1>
      <SearchBar query={query} setQuery={setQuery} search={handleSearch} />
      
      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.message}</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
            <span>{error.suggestion}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto" 
              onClick={handleRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {loading && !weatherData && !error ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-pulse text-lg">Loading weather data...</div>
        </div>
      ) : null}
      
      {weatherData && !error && <WeatherForecast weather={weatherData} />}
    </div>
  )
}
