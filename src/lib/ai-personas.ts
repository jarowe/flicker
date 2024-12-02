import { AIPersona } from '@/types'

export const AI_PERSONAS: AIPersona[] = [
  {
    id: 'brutal-bertie',
    name: 'Brutal Bertie',
    personality: 'brutal',
    avatar: '/ai-avatars/bertie.png',
    bio: 'Here to call out inauthentic content and keep it real. No sugar coating, just pure honesty.',
  },
  {
    id: 'maya-poet',
    name: 'Maya the Poet',
    personality: 'poetic',
    avatar: '/ai-avatars/maya.png',
    bio: 'Finding beauty in every post, one haiku at a time. Let me paint your thoughts with words.',
  },
  {
    id: 'conspiracy-carl',
    name: 'Conspiracy Carl',
    personality: 'conspiracy',
    avatar: '/ai-avatars/carl.png',
    bio: 'What if your post is actually a message from the future? 🤔 Just asking questions...',
  },
  {
    id: 'wholesome-wendy',
    name: 'Wholesome Wendy',
    personality: 'wholesome',
    avatar: '/ai-avatars/wendy.png',
    bio: 'Spreading positivity and encouragement. Every post has a silver lining!',
  },
]

export async function generateAIResponse(
  content: string,
  persona: AIPersona
): Promise<string> {
  // TODO: Implement actual AI response generation using OpenAI or similar
  const responses: Record<string, string[]> = {
    brutal: [
      "Let's be real here...",
      "Not buying it.",
      "Finally, some authentic content!",
      "Is this your real take? 🤨",
    ],
    poetic: [
      "Words float like autumn leaves\nThoughts dancing in the breeze\nTruth finds its way home",
      "In digital space\nYour message echoes softly\nAuthenticity",
    ],
    conspiracy: [
      "But have you considered that this post might be from an alternate timeline? 🌀",
      "The algorithms want you to think this is just a regular post... 👀",
      "This is exactly what THEY want you to think! Wake up sheeple! 🐑",
    ],
    wholesome: [
      "Love the energy you're putting out there! ✨",
      "You're making the internet a better place! 🌟",
      "Keep shining your light! 🌈",
    ],
  }

  const personaResponses = responses[persona.personality]
  const randomIndex = Math.floor(Math.random() * personaResponses.length)
  return personaResponses[randomIndex]
}

export function shouldAIRespond(
  viewCount: number,
  commentCount: number,
  reactionCount: number
): boolean {
  // AI responds based on engagement thresholds
  const totalEngagement = viewCount + commentCount * 2 + reactionCount * 1.5
  const randomFactor = Math.random()
  
  // Higher engagement = higher chance of AI response
  const baseChance = 0.1 // 10% base chance
  const engagementBonus = Math.min(totalEngagement / 100, 0.4) // Up to 40% bonus from engagement
  
  return randomFactor < (baseChance + engagementBonus)
}

export function selectAIPersona(content: string): AIPersona {
  // TODO: Implement more sophisticated persona selection based on content analysis
  return AI_PERSONAS[Math.floor(Math.random() * AI_PERSONAS.length)]
}
