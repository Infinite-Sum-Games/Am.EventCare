import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { axiosClient } from '@/lib/axios'
import { api } from '@/lib/api'
import { toast } from "sonner"
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

export const hashPassword = async (password: string): Promise<string> => {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashedPassword;
};
function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { checkSession, user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate({ to: '/details' })
    }
  }, [user, navigate])


  const { mutate: login, isPending } = useMutation({
    mutationFn: async () => {
      const hashedPassword = await hashPassword(password)
      return axiosClient.post(api.LOGIN, {
        "email": email,
        "password": hashedPassword,
      })
    },
    onSuccess: async () => {
      toast.success("Login successful", {
        description: "Welcome back!",
      })
      await checkSession()
      navigate({ to: '/details' })
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      })
      console.error("Login error:", error)
    },
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-3xl transition-all animate-pulse pointer-events-none" />

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-border shadow-2xl z-10 relative">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Anokha 2026
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access the Hospitality Panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-input font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-input font-medium pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
