import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import {
  generateAIResponse,
  shouldAIRespond,
  selectAIPersona,
} from '@/lib/ai-personas'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { postId } = json

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if AI should respond based on engagement
    if (!shouldAIRespond(
      post.views,
      post._count.comments,
      post._count.reactions
    )) {
      return NextResponse.json({ shouldRespond: false })
    }

    // Select appropriate AI persona and generate response
    const persona = selectAIPersona(post.content)
    const response = await generateAIResponse(post.content, persona)

    // Create AI comment
    const comment = await prisma.post.update({
      where: { id: postId },
      data: {
        comments: {
          create: {
            content: response,
            author: {
              connect: {
                // Use a dedicated AI user account
                id: process.env.AI_USER_ID,
              },
            },
          },
        },
        // Extend post lifespan for AI interaction
        expiresAt: new Date(post.expiresAt.getTime() + 15000), // +15 seconds
      },
      include: {
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      shouldRespond: true,
      comment: comment.comments[0],
      persona,
    })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
