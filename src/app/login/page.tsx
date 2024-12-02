"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        <div className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="bg-white text-black hover:bg-gray-100"
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Continue with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <GithubIcon className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}
