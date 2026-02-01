import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'
import { MIN_VOTES_FOR_RANKING } from '../constants/app'

/**
 * Hook to fetch restaurant performance stats and dish data
 * For restaurant owner dashboard
 */
export function useRestaurantStats(restaurantId) {
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalVotes: 0,
    avgRating: 0,
    topDishName: null,
    activeSpecials: 0
  })
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch dishes with vote aggregates using the get_restaurant_dishes function
      // or fall back to manual aggregation
      const { data: dishesData, error: dishesError } = await supabase
        .rpc('get_restaurant_dishes', { restaurant_id_param: restaurantId })

      if (dishesError) {
        // Fallback: fetch dishes and aggregate manually
        const { data: fallbackDishes, error: fallbackError } = await supabase
          .from('dishes')
          .select('id, name, category, price')
          .eq('restaurant_id', restaurantId)

        if (fallbackError) throw fallbackError

        // Get vote counts for each dish
        const dishIds = fallbackDishes?.map(d => d.id) || []
        if (dishIds.length > 0) {
          const { data: votesData, error: votesError } = await supabase
            .from('votes')
            .select('dish_id, would_order_again')
            .in('dish_id', dishIds)

          if (!votesError && votesData) {
            // Aggregate votes per dish
            const votesByDish = {}
            votesData.forEach(vote => {
              if (!votesByDish[vote.dish_id]) {
                votesByDish[vote.dish_id] = { total: 0, yes: 0 }
              }
              votesByDish[vote.dish_id].total++
              if (vote.would_order_again) {
                votesByDish[vote.dish_id].yes++
              }
            })

            // Merge with dishes
            const enrichedDishes = fallbackDishes.map(dish => {
              const votes = votesByDish[dish.id] || { total: 0, yes: 0 }
              const percentWorthIt = votes.total > 0
                ? Math.round((votes.yes / votes.total) * 100)
                : 0
              return {
                ...dish,
                dish_id: dish.id,
                dish_name: dish.name,
                total_votes: votes.total,
                yes_votes: votes.yes,
                percent_worth_it: percentWorthIt,
                avg_rating: percentWorthIt / 10 // Approximation
              }
            })

            setDishes(enrichedDishes)
            calculateStats(enrichedDishes)
          }
        } else {
          setDishes([])
          calculateStats([])
        }
      } else {
        setDishes(dishesData || [])
        calculateStats(dishesData || [])
      }

      // Fetch active specials count
      const { count: specialsCount } = await supabase
        .from('specials')
        .select('id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.now()')

      setStats(prev => ({
        ...prev,
        activeSpecials: specialsCount || 0
      }))
    } catch (err) {
      logger.error('Error fetching restaurant stats:', err)
      setError(err?.message || 'Failed to load stats')
    }

    setLoading(false)
  }, [restaurantId])

  const calculateStats = (dishesData) => {
    const totalDishes = dishesData.length
    const totalVotes = dishesData.reduce((sum, d) => sum + (d.total_votes || 0), 0)

    // Calculate weighted average rating
    let weightedSum = 0
    let votesWithRating = 0
    dishesData.forEach(dish => {
      if (dish.total_votes > 0) {
        weightedSum += (dish.avg_rating || 0) * dish.total_votes
        votesWithRating += dish.total_votes
      }
    })
    const avgRating = votesWithRating > 0 ? weightedSum / votesWithRating : 0

    // Find top dish (highest rated with enough votes)
    const rankedDishes = dishesData.filter(d => (d.total_votes || 0) >= MIN_VOTES_FOR_RANKING)
    const topDish = rankedDishes.length > 0
      ? rankedDishes.slice().sort((a, b) => (b.percent_worth_it || 0) - (a.percent_worth_it || 0))[0]
      : null

    setStats(prev => ({
      ...prev,
      totalDishes,
      totalVotes,
      avgRating,
      topDishName: topDish?.name || topDish?.dish_name || null
    }))
  }

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    dishes,
    loading,
    error,
    refetch: fetchStats
  }
}
