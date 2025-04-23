"use client"

import type React from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"

interface SearchBarProps {
  query: string
  setQuery: (query: string) => void
  search: (e: React.FormEvent) => void
}

export default function SearchBar({ query, setQuery, search }: SearchBarProps) {
  const form = useForm({
    defaultValues: {
      query: query,
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      search(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Form {...form}>
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            search(e)
          }}
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter city name (e.g., London, Paris, Tokyo)"
                    className="h-10 rounded-full pl-4 pr-12 focus-visible:ring-blue-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Search for a city"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  )
}
