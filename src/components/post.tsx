'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, BarChart2, Share } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface PostProps {
  post: {
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      name: string
      image: string
    }
    likes: number
    views: number
    expiresAt: string
    likedByMe: boolean
  }
}

export function Post({ post }: PostProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [likes, setLikes] = useState(post.likes)
  const [likedByMe, setLikedByMe] = useState(post.likedByMe)
  const [timeLeft, setTimeLeft] = useState('')
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const expiresAt = new Date(post.expiresAt)
      const timeLeftMs = expiresAt.getTime() - now.getTime()
      
      if (timeLeftMs <= 0) {
        setTimeLeft('Expired')
        setProgress(0)
        return
      }

      const secondsLeft = Math.floor(timeLeftMs / 1000)
      setTimeLeft(`${secondsLeft}s`)
      
      // Calculate progress (assuming initial time was 10 seconds)
      const initialTimeMs = 10 * 1000
      const progressPercent = (timeLeftMs / initialTimeMs) * 100
      setProgress(Math.min(progressPercent, 100))
    }

    updateTime()
    const interval = setInterval(updateTime, 100)
    return () => clearInterval(interval)
  }, [post.expiresAt])

  async function handleLike() {
    if (!session) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like posts',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to like post')

      setLikes(prev => prev + (likedByMe ? -1 : 1))
      setLikedByMe(prev => !prev)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like post. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <article className="relative border-b border-zinc-800 px-4 py-3 hover:bg-zinc-900/40 transition-colors">
      <div className="absolute left-0 top-0 h-1 bg-primary" style={{ width: `${progress}%` }} />
      
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.image} alt={post.author.name} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{post.author.name}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
            <span className="text-zinc-500">·</span>
            <span className={cn(
              'font-medium',
              progress > 50 ? 'text-green-500' :
              progress > 25 ? 'text-yellow-500' :
              'text-red-500'
            )}>
              {timeLeft}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-wrap break-words text-[15px]">{post.content}</p>

          <div className="mt-3 flex items-center gap-6 text-zinc-500">
            <Button
              variant="ghost"
              size="icon"
              className="group flex items-center gap-2 text-zinc-500 hover:text-primary"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  likedByMe && 'fill-primary text-primary'
                )}
              />
              <span className="text-sm">{likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="group flex items-center gap-2 text-zinc-500 hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">0</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="group flex items-center gap-2 text-zinc-500 hover:text-primary"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-sm">{post.views}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="group flex items-center gap-2 text-zinc-500 hover:text-primary"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
