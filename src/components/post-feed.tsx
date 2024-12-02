'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/components/post'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'

interface Post {
  id: string
  content: string
  author: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  likes: number
  views: number
  expiresAt: string
  likedByMe: boolean
}

interface PostFeedProps {
  type: 'for-you' | 'following'
}

export function PostFeed({ type }: PostFeedProps) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  async function fetchPosts() {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const params = new URLSearchParams()
      if (cursor) params.set('cursor', cursor)
      if (type === 'following') params.set('following', 'true')
      
      const response = await fetch(`/api/posts?${params.toString()}`)
      const data = await response.json()

      if (!data.posts.length) {
        setHasMore(false)
        return
      }

      setPosts(prev => [...prev, ...data.posts])
      setCursor(data.nextCursor)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    setPosts([])
    setCursor(null)
    setHasMore(true)
    fetchPosts()
  }, [type])

  // Fetch more when scrolling to bottom
  useEffect(() => {
    if (inView) {
      fetchPosts()
    }
  }, [inView])

  if (!posts.length && !loading) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
        No posts yet. Be the first to post!
      </div>
    )
  }

  return (
    <div className="divide-y divide-zinc-800">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {hasMore && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          {loading && <div className="text-muted-foreground">Loading more posts...</div>}
        </div>
      )}
    </div>
  )
}
