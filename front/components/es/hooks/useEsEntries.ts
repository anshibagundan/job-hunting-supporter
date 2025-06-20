import { useState, useEffect } from "react"
import { storage, type ESEntry } from "@/lib/supabase"

export function useESEntries() {
  const [entries, setEntries] = useState<ESEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<ESEntry | null>(null)

  useEffect(() => {
    setEntries(storage.getESEntries())
  }, [])

  const addEntry = (entry: ESEntry) => {
    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)
    storage.saveESEntries(updatedEntries)
  }

  const updateEntry = (updatedEntry: ESEntry) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    )
    setEntries(updatedEntries)
    storage.saveESEntries(updatedEntries)
    if (selectedEntry?.id === updatedEntry.id) {
      setSelectedEntry(updatedEntry)
    }
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    storage.saveESEntries(updatedEntries)
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
    }
  }

  const selectEntry = (entry: ESEntry | null) => {
    setSelectedEntry(entry)
  }

  return {
    entries,
    selectedEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    selectEntry,
  }
}
