import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSkillStore } from '../store/store'

export const useSkillSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchTerm, setSearchTerm } = useSkillStore()

  const searchParam = searchParams.get('search')

  // 1. Sync URL -> Store
  // Only run when searchParam changes (navigation / forward / back)
  // We exclude searchTerm from deps to avoid reverting the store while typing (when URL is stale)
  useEffect(() => {
    if (searchParam !== null && searchParam !== searchTerm) {
      setSearchTerm(searchParam)
    }
    // Restore from store if URL is empty but store has value (initial load with persisted state)
    else if (searchParam === null && searchTerm) {
      setSearchParams(
        (prev) => {
          prev.set('search', searchTerm)
          return prev
        },
        { replace: true }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, setSearchParams, setSearchTerm]) 

  // 2. Sync Store -> URL (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUrlSearch = searchParams.get('search')
      
      if (searchTerm) {
        if (currentUrlSearch !== searchTerm) {
          setSearchParams((prev) => {
            prev.set('search', searchTerm)
            return prev
          }, { replace: true })
        }
      } else if (currentUrlSearch) {
        setSearchParams((prev) => {
          prev.delete('search')
          return prev
        }, { replace: true })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, setSearchParams]) // searchParams is stable, but we need it in deps

  const updateSearch = (term: string) => {
    setSearchTerm(term)
    // Do NOT update URL here. The effect handles it.
  }

  return { searchTerm, updateSearch }
}
