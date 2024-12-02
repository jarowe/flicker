'use client'

import { CreatePost } from '@/components/create-post'
import { PostFeed } from '@/components/post-feed'
import { Button } from '@/components/ui/button'
import { useSession, signIn } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="flex min-h-screen flex-col">
      <div className="sticky top-16 z-10 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
            <TabsTrigger
              value="for-you"
              className="rounded-none border-b-2 border-transparent px-8 py-3 font-medium data-[state=active]:border-primary"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="rounded-none border-b-2 border-transparent px-8 py-3 font-medium data-[state=active]:border-primary"
            >
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="border-0 p-0">
            <CreatePost />
            <PostFeed type="for-you" />
          </TabsContent>

          <TabsContent value="following" className="border-0 p-0">
            {session ? (
              <>
                <CreatePost />
                <PostFeed type="following" />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 px-4 py-10">
                <h2 className="text-2xl font-bold">See posts from accounts you follow</h2>
                <p className="text-sm text-zinc-400">
                  Sign in to Flicker to see posts from your favorite accounts
                </p>
                <Button onClick={() => signIn()} className="mt-2 bg-primary font-semibold hover:bg-primary/90">
                  Sign in
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
