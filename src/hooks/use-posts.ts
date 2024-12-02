'use client'

import { useState, useEffect } from 'react'
import { Post } from '@/types'

export function usePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const fetchPosts = async (cursor?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (cursor) params.append('cursor', cursor)
      
      const response = await fetch(`/api/posts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      
      setPosts(prev => cursor ? [...prev, ...data.posts] : data.posts)
      setNextCursor(data.nextCursor)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error('Failed to create post')
      
      const newPost = await response.json()
      setPosts(prev => [newPost, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
      throw err
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')
      
      setPosts(prev => prev.filter(post => post.id !== postId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
      throw err
    }
  }

  const addReaction = async (postId: string, type: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) throw new Error('Failed to add reaction')
      
      const newReaction = await response.json()
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, reactions: [...post.reactions, newReaction] }
            : post
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reaction')
      throw err
    }
  }

  const removeReaction = async (postId: string, type: string) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/reactions?type=${type}`,
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Failed to remove reaction')
      
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                reactions: post.reactions.filter(r => r.type !== type),
              }
            : post
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove reaction')
      throw err
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return {
    posts,
    loading,
    error,
    nextCursor,
    fetchPosts,
    createPost,
    deletePost,
    addReaction,
    removeReaction,
  }
}
