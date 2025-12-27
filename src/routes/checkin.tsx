import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getStats, getResponses } from '@/mocks/data'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, User } from "lucide-react"

export const Route = createFileRoute('/checkin')({
    component: CheckInPage,
})

function CheckInPage() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
        refetchInterval: 5000,
    })

    const { data: responses } = useQuery({
        queryKey: ['responses'],
        queryFn: getResponses,
        refetchInterval: 5000,
    })

    // Sort responses to simulate logs
    const logs = responses?.filter(r => r.checkInStatus !== 'Reserved')
        .slice(0, 8) || []

    return (
        <div className="p-6 min-h-screen bg-background text-foreground font-sans animate-in fade-in duration-500 space-y-8">
            <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Activity</h1>
                <p className="text-muted-foreground mt-1">Real-time occupancy and activity overview.</p>
            </div>

            {/* Stats Overview - Horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-foreground">{stats?.total || 0}</div>
                            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                                <User size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Checked In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-primary">{stats?.checkedIn || 0}</div>
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Activity size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-foreground">{(stats?.total || 0) - (stats?.checkedIn || 0)}</div>
                            <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                                <Activity size={20} className="opacity-50" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Card className="bg-card border-border shadow-lg">
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {logs.map((log, i) => (
                                <div key={i} className="px-6 py-4 hover:bg-muted/20 flex items-center justify-between group transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-2 h-2 rounded-full
                                            ${log.checkInStatus === 'Checked In' ? 'bg-primary shadow-[0_0_8px_rgba(234,88,12,0.5)]' : 'bg-muted-foreground'}
                                        `} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors">{log.fullName}</p>
                                                <span className="text-xs text-muted-foreground">({log.email})</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{log.college}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded
                                            ${log.checkInStatus === 'Checked In' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                                    `}>
                                        {log.checkInStatus === 'Checked In' ? 'IN' : 'OUT'}
                                    </span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                                    No recent activity
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
