'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Achievement } from '@/types'

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements')
        if (!response.ok) throw new Error('Failed to fetch achievements')
        const data = await response.json()
        setAchievements(data.achievements)
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  if (loading) {
    return <div>Loading achievements...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={`relative ${
            achievement.unlockedAt ? 'bg-primary/5' : 'bg-muted/50'
          }`}
        >
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-primary/10">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label={achievement.title}
                >
                  {achievement.icon}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress
                value={(achievement.progress / achievement.maxProgress) * 100}
              />
              <p className="text-sm text-muted-foreground text-right">
                {achievement.progress} / {achievement.maxProgress}
              </p>
              {achievement.unlockedAt && (
                <p className="text-sm text-primary">
                  Unlocked{' '}
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
          {achievement.unlockedAt && (
            <div className="absolute top-2 right-2">
              <span className="text-primary">✓</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
