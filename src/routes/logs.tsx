import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Activity } from "lucide-react"
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

export const Route = createFileRoute('/logs')({
    component: LogsPage,
})

function LogsPage() {
    const { user, isLoading: isAuthLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate({ to: '/login' })
        }
    }, [user, isAuthLoading, navigate])

    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 h-full bg-background text-foreground font-sans animate-in fade-in duration-500 space-y-8">
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <div className="relative bg-card border border-border p-4 rounded-full shadow-2xl animate-bounce">
                        <Activity size={48} className="text-amber-500" />
                    </div>
                </div>

                <div className="text-center space-y-2 max-w-md mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Under Construction
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        We're building something awesome here. Check back soon for detailed activity logs!
                    </p>
                </div>

                <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-[bounce_1s_infinite_0ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-[bounce_1s_infinite_200ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-[bounce_1s_infinite_400ms]"></span>
                </div>
            </div>
        </>
    )
}
