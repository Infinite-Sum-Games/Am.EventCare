import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Construction } from 'lucide-react'

export const Route = createFileRoute('/analytics')({
    component: AnalyticsPage,
})

function AnalyticsPage() {
    return (
        <div className="p-8 space-y-8 min-h-screen bg-background text-foreground font-sans animate-in fade-in duration-500 flex items-center justify-center">
            <Card className="max-w-md w-full border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 ring-1 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                        <BarChart3 size={40} className="text-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Analytics</CardTitle>
                        <p className="text-sm font-medium text-amber-500/80 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Construction size={14} />
                            Under Construction
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="text-center pb-8 px-8">
                    <p className="text-muted-foreground leading-relaxed">
                        We're building powerful insights to help you manage accommodations better. Check back soon for detailed reports and stats.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
