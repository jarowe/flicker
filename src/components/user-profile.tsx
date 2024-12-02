'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatKarma } from '@/lib/utils'

interface UserProfileProps {
  user: {
    id: string
    name: string | null
    image: string | null
    karma: number
    streakDays: number
    lastActive: Date
    createdAt: Date
    _count: {
      posts: number
      comments: number
      reactions: number
    }
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard
            title="Karma"
            value={formatKarma(user.karma)}
            icon="⭐"
          />
          <StatCard
            title="Posts"
            value={user._count.posts.toString()}
            icon="📝"
          />
          <StatCard
            title="Comments"
            value={user._count.comments.toString()}
            icon="💭"
          />
          <StatCard
            title="Streak"
            value={`${user.streakDays} days`}
            icon="🔥"
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: string
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
      <span className="text-2xl mb-2" role="img" aria-label={title}>
        {icon}
      </span>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
