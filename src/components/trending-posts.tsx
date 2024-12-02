'use client'

import { useState, useEffect } from 'react'
import { Post } from '@/components/post'
import { Card } from '@/components/ui/card'
import { useAIInteraction } from '@/hooks/use-ai-interaction'

export function TrendingPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { triggerAIResponse } = useAIInteraction()

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await fetch('/api/posts/trending')
        if (!response.ok) throw new Error('Failed to fetch trending posts')
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error('Error fetching trending posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingPosts()
  }, [])

  const handlePostInteraction = async (postId: string) => {
    try {
      // Trigger AI response with a probability based on engagement
      const shouldRespond = Math.random() < 0.3 // 30% chance
      if (shouldRespond) {
        await triggerAIResponse(postId)
      }
    } catch (error) {
      console.error('Error handling post interaction:', error)
    }
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p>Loading trending posts...</p>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p>No trending posts yet. Be the first to create one!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <Post
          key={post.id}
          post={post}
          onInteraction={() => handlePostInteraction(post.id)}
        />
      ))}
    </div>
  )
}
