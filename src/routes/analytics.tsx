import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BarChart3, BedDouble, Building2, Footprints, LogIn, LogOut, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios'
import { api } from '@/lib/api'
import { useMemo } from 'react'

export const Route = createFileRoute('/analytics')({
    component: AnalyticsPage,
})

interface InsideCampusAnalytics {
    date: string;
    counts: {
        IN: number;
        OUT: number;
        CURRENTLY_INSIDE: number;
    }
}

interface HostelStats {
    id: string;
    hostel_name: string;
    room_count: number;
    room_filled: number;
}

interface LiveBedsAnalytics {
    hostels: HostelStats[];
    total_beds_filled: number;
}

function AnalyticsPage() {
    // 1. Fetch Inside Campus Analytics
    const { data: insideCampusData = [] } = useQuery<InsideCampusAnalytics[]>({
        queryKey: ['inside-campus-analytics'],
        queryFn: async () => {
            const res = await axiosClient.get(api.GET_INSIDE_CAMPUS_ANALYTICS)
            if (res.data?.inside_campus_summary) return res.data.inside_campus_summary
            return []
        }
    })

    // 2. Fetch Live Beds Analytics
    const { data: liveBedsData } = useQuery<LiveBedsAnalytics>({
        queryKey: ['live-beds-analytics'],
        queryFn: async () => {
            const res = await axiosClient.get(api.GET_LIVE_BEDS_ANALYTICS)
            // The backend returns a single object in "live_beds_summary", or potentially an array of one
            // Based on earlier analysis, it's likely a single object or we take the first one if array
            const summary = res.data?.live_beds_summary
            if (Array.isArray(summary)) return summary[0] || { hostels: [], total_beds_filled: 0 }
            return summary || { hostels: [], total_beds_filled: 0 }
        }
    })

    // Process Inside Campus Data - Get the latest date
    const latestInsideStats = useMemo(() => {
        if (!insideCampusData.length) return null;
        // Assuming backend sorts by date as per SQL "ORDER BY date", the last one is latest
        return insideCampusData[insideCampusData.length - 1];
    }, [insideCampusData]);

    const totalInside = latestInsideStats?.counts?.CURRENTLY_INSIDE || 0;
    const totalIn = latestInsideStats?.counts?.IN || 0;
    const totalOut = latestInsideStats?.counts?.OUT || 0;

    return (
        <div className="p-8 space-y-8 min-h-screen bg-background text-foreground font-sans animate-in fade-in duration-500 overflow-y-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <BarChart3 className="text-amber-500" />
                    Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">Real-time insights on campus occupancy and accommodation.</p>
            </div>

            {/* SECTON 1: Inside Campus Stats */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Footprints className="text-blue-500" size={24} />
                    Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Currently Inside */}
                    <Card className="bg-card/50 border-border/50 shadow-sm backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={100} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Currently Inside</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-foreground">{totalInside.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Net people on campus</p>
                        </CardContent>
                    </Card>

                    {/* Total Checks IN */}
                    <Card className="bg-card/50 border-border/50 shadow-sm backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LogIn size={100} className="text-emerald-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-500/80 uppercase tracking-wider">Total Check-Ins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-emerald-500">{totalIn.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Entries today</p>
                        </CardContent>
                    </Card>

                    {/* Total Checks OUT */}
                    <Card className="bg-card/50 border-border/50 shadow-sm backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LogOut size={100} className="text-red-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-500/80 uppercase tracking-wider">Total Check-Outs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-red-500">{totalOut.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Exits today</p>
                        </CardContent>
                    </Card>

                    {/* Total Beds Card (Moved here) */}
                    <Card className="bg-linear-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20 shadow-sm backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BedDouble size={100} className="text-purple-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-500 uppercase tracking-wider">Total Beds Filled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-foreground">{liveBedsData?.total_beds_filled?.toLocaleString() || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all hostels</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 2: Live Beds Stats (Hostel List Only) */}
            <div className="space-y-4 pt-4">


                {/* Hostel List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* 2. Hostel List Cards */}
                    {liveBedsData?.hostels?.map((hostel) => {
                        const percentage = hostel.room_count > 0 ? (hostel.room_filled / hostel.room_count) * 100 : 0;
                        const isFull = percentage >= 100;
                        const isHigh = percentage > 80;

                        return (
                            <Card key={hostel.id} className="bg-card/40 border-border/40 hover:bg-card/60 transition-colors">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Building2 size={16} className="text-muted-foreground" />
                                            <span className="truncate max-w-[120px]" title={hostel.hostel_name}>{hostel.hostel_name}</span>
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${isFull ? 'bg-red-500/10 text-red-500' :
                                            isHigh ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {percentage.toFixed(0)}%
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-end justify-between text-xs text-muted-foreground">
                                            <span>Filled: <strong className="text-foreground">{hostel.room_filled}</strong></span>
                                            <span>Total: {hostel.room_count}</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' :
                                                    isHigh ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* SECTION 1.5: Activity History Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="text-amber-500" size={24} />
                    Activity History (Last 7 Days)
                </h2>
                <ActivityHistoryTable data={insideCampusData} />
            </div>
        </div>
    )
}

function ActivityHistoryTable({ data }: { data: InsideCampusAnalytics[] }) {
    if (!data || data.length === 0) return null;

    // Take last 7 days, reverse to show latest first
    const tableData = [...data].slice(-7).reverse();

    return (
        <Card className="bg-card/40 border-border/40 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead className="w-[180px]">Date</TableHead>
                            <TableHead className="text-center">Check-Ins</TableHead>
                            <TableHead className="text-center">Check-Outs</TableHead>
                            <TableHead className="text-right">Net Inside</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row) => (
                            <TableRow key={row.date} className="hover:bg-muted/30 border-border/40">
                                <TableCell className="font-medium">
                                    {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium text-xs">
                                        <LogIn size={12} />
                                        {row.counts.IN}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium text-xs">
                                        <LogOut size={12} />
                                        {row.counts.OUT}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium text-foreground">
                                    {row.counts.CURRENTLY_INSIDE}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
