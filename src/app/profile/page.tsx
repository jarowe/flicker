import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/components/user-profile'
import { Achievements } from '@/components/achievements'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Profile | Flicker',
  description: 'View and manage your Flicker profile',
}

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
          reactions: true,
        },
      },
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <UserProfile user={user} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <Achievements />
      </div>
    </div>
  )
}
