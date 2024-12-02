export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  karma: number
  streakDays: number
  lastActive: Date
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  content: string
  authorId: string
  author: User
  lifespan: number
  views: number
  isAuthentic: boolean
  expiresAt: Date
  comments: Comment[]
  reactions: Reaction[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface Reaction {
  id: string
  type: 'like' | 'authentic' | 'real'
  postId: string
  userId: string
  user: User
  createdAt: Date
}

export interface AIPersona {
  id: string
  name: string
  personality: 'brutal' | 'poetic' | 'conspiracy' | 'wholesome'
  avatar: string
  bio: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number
  maxProgress: number
}
