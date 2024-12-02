'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export function CreatePost() {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const maxLength = 280

  if (!session) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error('Failed to create post')

      setContent('')
      toast({
        title: 'Post created!',
        description: 'Your post is now live for 10 seconds.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary">
          <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
          <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-none bg-transparent p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            maxLength={maxLength}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="text-sm text-muted-foreground">
          {content.length}/{maxLength}
        </div>
        <Button 
          type="submit" 
          disabled={!content.trim() || isLoading}
          className="rounded-full bg-primary px-4 font-semibold hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            'Post'
          )}
        </Button>
      </div>
    </form>
  )
}
