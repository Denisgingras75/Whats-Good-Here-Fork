import { useState } from 'react'
import { votesApi } from '../api'

export function useVote() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Submit both wouldOrderAgain AND rating_10 in one call
  const submitVote = async (dishId, wouldOrderAgain, rating10) => {
    try {
      setSubmitting(true)
      setError(null)

      await votesApi.submitVote({
        dishId,
        wouldOrderAgain,
        rating10,
      })

      return { success: true }
    } catch (err) {
      console.error('Error submitting vote:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  const getUserVotes = async () => {
    try {
      return await votesApi.getUserVotes()
    } catch (err) {
      console.error('Error fetching user votes:', err)
      return {}
    }
  }

  return {
    submitVote,
    getUserVotes,
    submitting,
    error,
  }
}
