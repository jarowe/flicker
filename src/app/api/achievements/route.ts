import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

const ACHIEVEMENTS = [
  {
    id: 'first-post',
    title: 'First Steps',
    description: 'Create your first post',
    icon: '🎯',
    condition: async (userId: string) => {
      const postCount = await prisma.post.count({
        where: { authorId: userId },
      })
      return {
        progress: Math.min(postCount, 1),
        maxProgress: 1,
        unlocked: postCount >= 1,
      }
    },
  },
  {
    id: 'authentic-creator',
    title: 'Authentic Creator',
    description: 'Get 10 posts marked as authentic',
    icon: '✨',
    condition: async (userId: string) => {
      const authenticPosts = await prisma.post.count({
        where: {
          authorId: userId,
          isAuthentic: true,
        },
      })
      return {
        progress: authenticPosts,
        maxProgress: 10,
        unlocked: authenticPosts >= 10,
      }
    },
  },
  {
    id: 'engagement-master',
    title: 'Engagement Master',
    description: 'Receive 100 total reactions on your posts',
    icon: '🌟',
    condition: async (userId: string) => {
      const totalReactions = await prisma.reaction.count({
        where: {
          post: {
            authorId: userId,
          },
        },
      })
      return {
        progress: totalReactions,
        maxProgress: 100,
        unlocked: totalReactions >= 100,
      }
    },
  },
  {
    id: 'survivor',
    title: 'Content Survivor',
    description: 'Have a post survive for over 5 minutes',
    icon: '⏰',
    condition: async (userId: string) => {
      const survivingPosts = await prisma.post.count({
        where: {
          authorId: userId,
          expiresAt: {
            gt: new Date(Date.now() + 300000), // 5 minutes in milliseconds
          },
        },
      })
      return {
        progress: Math.min(survivingPosts, 1),
        maxProgress: 1,
        unlocked: survivingPosts > 0,
      }
    },
  },
  {
    id: 'ai-whisperer',
    title: 'AI Whisperer',
    description: 'Receive comments from all AI personas',
    icon: '🤖',
    condition: async (userId: string) => {
      const uniqueAIComments = await prisma.comment.count({
        where: {
          post: {
            authorId: userId,
          },
          authorId: process.env.AI_USER_ID,
        },
        distinct: ['authorId'],
      })
      return {
        progress: uniqueAIComments,
        maxProgress: 4, // Number of AI personas
        unlocked: uniqueAIComments >= 4,
      }
    },
  },
  {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day posting streak',
    icon: '🔥',
    condition: async (userId: string) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { streakDays: true },
      })
      return {
        progress: user?.streakDays || 0,
        maxProgress: 7,
        unlocked: (user?.streakDays || 0) >= 7,
      }
    },
  },
]

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const achievements = await Promise.all(
      ACHIEVEMENTS.map(async (achievement) => {
        const { progress, maxProgress, unlocked } = await achievement.condition(
          session.user.id
        )
        return {
          ...achievement,
          progress,
          maxProgress,
          unlockedAt: unlocked ? new Date() : null,
        }
      })
    )

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
