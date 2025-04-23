"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Cloud, Droplets, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface WeatherData {
  city: string
  country: string
  condition: {
    description: string
    icon_url: string
  }
  temperature: {
    current: number
    humidity: number
    minimum?: number
    maximum?: number
  }
  wind: {
    speed: number
  }
}

interface ForecastDay {
  time: number
  condition: {
    description: string
    icon_url: string
  }
  temperature: {
    minimum: number
    maximum: number
  }
}

interface ForecastProps {
  weather: {
    data: WeatherData
  }
}

export default function WeatherForecast({ weather }: ForecastProps) {
  const { data } = weather
  const [forecastData, setForecastData] = useState<ForecastDay[]>([])
  const [isCelsius, setIsCelsius] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchForecastData = async () => {
      setIsLoading(true)
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city}&appid=${apiKey}&units=metric`

      try {
        const response = await axios.get(url)

        // Process the forecast data - OpenWeather returns data in 3-hour intervals
        // We'll take one reading per day (every 8th item = 24 hours)
        const dailyData = []
        for (let i = 0; i < response.data.list.length; i += 8) {
          if (dailyData.length < 5 && response.data.list[i]) {
            const item = response.data.list[i]
            dailyData.push({
              time: item.dt,
              condition: {
                description: item.weather[0].description,
                icon_url: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              },
              temperature: {
                minimum: item.main.temp_min,
                maximum: item.main.temp_max,
              },
            })
          }
        }

        setForecastData(dailyData)
      } catch (error) {
        console.error("Error fetching forecast data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecastData()
  }, [data.city])

  const formatDay = (dateString: number) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short" }
    const date = new Date(dateString * 1000)
    return date.toLocaleDateString("en-US", options)
  }

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    const currentDate = new Date().toLocaleDateString("en-US", options)
    return currentDate
  }

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState)
  }

  const convertToFahrenheit = (temperature: number) => {
    return Math.round((temperature * 9) / 5 + 32)
  }

  const renderTemperature = (temperature: number) => {
    return isCelsius ? Math.round(temperature) : convertToFahrenheit(temperature)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <CardHeader className="p-4 overflow-visible">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {data.city}, <span className="font-normal">{data.country}</span>
              </CardTitle>
              <CardDescription className="text-blue-100 mt-1">{getCurrentDate()}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTemperatureUnit}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isCelsius ? "°C → °F" : "°F → °C"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            {data.condition.icon_url && (
              <img
                src={data.condition.icon_url || "/placeholder.svg"}
                alt={data.condition.description}
                className="w-20 h-20 mr-4"
              />
            )}
            <div>
              <div className="flex items-start">
                <span className="text-5xl font-bold">{renderTemperature(data.temperature.current)}</span>
                <span className="text-2xl mt-1">{isCelsius ? "°C" : "°F"}</span>
              </div>
              <Badge variant="secondary" className="mt-1">
                {data.condition.description}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
            <div className="flex items-center">
              <Wind className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-lg font-medium">{data.wind.speed} m/s</p>
                <p className="text-sm text-muted-foreground">Wind speed</p>
              </div>
            </div>
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-lg font-medium">{data.temperature.humidity}%</p>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="text-lg font-medium mb-4">5-Day Forecast</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Loading forecast data...</div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {forecastData &&
                forecastData.slice(0, 5).map((day) => (
                  <div
                    key={day.time}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">{formatDay(day.time)}</p>
                    {day.condition.icon_url && (
                      <img
                        className="w-10 h-10 my-2"
                        src={day.condition.icon_url || "/placeholder.svg"}
                        alt={day.condition.description}
                      />
                    )}
                    <p className="text-sm">
                      <span className="text-muted-foreground">{renderTemperature(day.temperature.minimum)}°</span>
                      {" / "}
                      <span className="font-medium">{renderTemperature(day.temperature.maximum)}°</span>
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Cloud className="h-4 w-4 mr-2" />
          <span>Weather data provided by OpenWeather API</span>
        </div>
      </CardFooter>
    </Card>
  )
}
