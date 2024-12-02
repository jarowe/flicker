import { Metadata } from 'next'
import { Leaderboard } from '@/components/leaderboard'
import { TrendingPosts } from '@/components/trending-posts'

export const metadata: Metadata = {
  title: 'Explore | Flicker',
  description: 'Discover trending content and top users on Flicker',
}

export default function ExplorePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Explore</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
          <TrendingPosts />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Top Users</h2>
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}
