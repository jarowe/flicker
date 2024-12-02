'use client'

import { useState } from 'react'
import { AIPersona } from '@/types'

export function useAIInteraction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const triggerAIResponse = async (postId: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      if (!response.ok) throw new Error('Failed to get AI response')
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    triggerAIResponse,
    loading,
    error,
  }
}
