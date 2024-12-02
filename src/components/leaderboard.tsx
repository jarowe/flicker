'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatKarma } from '@/lib/utils'

type LeaderboardCategory = 'karma' | 'authentic' | 'streak'

interface LeaderboardUser {
  id: string
  name: string
  image: string
  karma: number
  authenticPosts: number
  streakDays: number
  isAI?: boolean
}

export function Leaderboard() {
  const [category, setCategory] = useState<LeaderboardCategory>('karma')
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('weekly')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<LeaderboardUser[]>([])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/leaderboard?category=${category}&timeframe=${timeframe}`
      )
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
        <div className="flex space-x-2 mt-4">
          <Button
            variant={category === 'karma' ? 'default' : 'outline'}
            onClick={() => setCategory('karma')}
          >
            Karma
          </Button>
          <Button
            variant={category === 'authentic' ? 'default' : 'outline'}
            onClick={() => setCategory('authentic')}
          >
            Authentic
          </Button>
          <Button
            variant={category === 'streak' ? 'default' : 'outline'}
            onClick={() => setCategory('streak')}
          >
            Streaks
          </Button>
        </div>
        <div className="flex space-x-2 mt-2">
          <Button
            variant={timeframe === 'daily' ? 'default' : 'outline'}
            onClick={() => setTimeframe('daily')}
            size="sm"
          >
            Daily
          </Button>
          <Button
            variant={timeframe === 'weekly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('weekly')}
            size="sm"
          >
            Weekly
          </Button>
          <Button
            variant={timeframe === 'allTime' ? 'default' : 'outline'}
            onClick={() => setTimeframe('allTime')}
            size="sm"
          >
            All Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold w-8">#{index + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.name}
                      {user.isAI && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          AI
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category === 'karma' && `${formatKarma(user.karma)} Karma`}
                      {category === 'authentic' && `${user.authenticPosts} Authentic Posts`}
                      {category === 'streak' && `${user.streakDays} Day Streak`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
