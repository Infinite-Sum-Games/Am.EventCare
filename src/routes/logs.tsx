import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
    Activity,
    Search,
    ArrowRightLeft,
    LogIn,
    LogOut,
    Building2,
    CalendarClock,
    School,
    ShieldCheck,
    UserCircle,
    MapPin,
    Mail,
    Loader2
} from "lucide-react"
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import type { GateLog, HostelLog } from '@/mocks/mockLogs'

export const Route = createFileRoute('/logs')({
    component: LogsPage,
})

// Helper to format Date
const formatDateTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    } catch (e) {
        return "Invalid Date";
    }
}

const toTitleCase = (str: string) => {
    if (!str) return "";
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
};

function LogsPage() {
    const { user, isLoading: isAuthLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate({ to: '/login' })
        }
    }, [user, isAuthLoading, navigate])

    // Filters
    const [search, setSearch] = useState("")
    const [directionFilter, setDirectionFilter] = useState<'All' | 'IN' | 'OUT'>("All")
    const [collegeFilter, setCollegeFilter] = useState("All colleges")

    // Data Fetching
    const { 
        data: gateLogs = [], 
        isLoading: isGateLoading 
    } = useQuery<GateLog[]>({
        queryKey: ['gate-logs'],
        queryFn: async () => {
            const res = await axiosClient.get(api.GET_GATE_LOGS)
            // console.log("Gate Logs Response:", res.data)
            if (Array.isArray(res.data)) return res.data
            if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
            if (res.data?.logs && Array.isArray(res.data.logs)) return res.data.logs
            return []
        },
        enabled: !!user, // FIX 1: Wait for auth before fetching
        placeholderData: keepPreviousData, // FIX 2: Keep old data while refetching to prevent flicker
        refetchOnWindowFocus: false, // Optional: Prevents random glitches when switching tabs
    })

    const { 
        data: hostelLogs = [], 
        isLoading: isHostelLoading 
    } = useQuery<HostelLog[]>({
        queryKey: ['hostel-logs'],
        queryFn: async () => {
            const res = await axiosClient.get(api.GET_HOSTEL_LOGS)
            // console.log("Hostel Logs Response:", res.data)
            if (Array.isArray(res.data)) return res.data
            if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
            if (res.data?.logs && Array.isArray(res.data.logs)) return res.data.logs
            return []
        },
        enabled: !!user, // FIX 1
        placeholderData: keepPreviousData, // FIX 2
        refetchOnWindowFocus: false,
    })

    // Extract unique colleges
    const uniqueColleges = useMemo(() => {
        const allLogs = [...gateLogs, ...hostelLogs];
        const colleges = Array.from(new Set(allLogs.map(log => toTitleCase(log.college_name || ""))));
        return colleges.sort();
    }, [gateLogs, hostelLogs]);

    // Filter Logic
    const filteredGateLogs = useMemo(() => {
        return gateLogs.filter(log => {
            const matchesSearch =
                (log.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (log.student_email || "").toLowerCase().includes(search.toLowerCase());
            const matchesDirection = directionFilter === "All" || log.direction === directionFilter;
            const matchesCollege = collegeFilter === "All colleges" || toTitleCase(log.college_name) === collegeFilter;

            return matchesSearch && matchesDirection && matchesCollege;
        });
    }, [gateLogs, search, directionFilter, collegeFilter]);

    const filteredHostelLogs = useMemo(() => {
        return hostelLogs.filter(log => {
            const matchesSearch =
                (log.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (log.student_email || "").toLowerCase().includes(search.toLowerCase());
            const matchesCollege = collegeFilter === "All colleges" || toTitleCase(log.college_name) === collegeFilter;

            return matchesSearch && matchesCollege;
        });
    }, [hostelLogs, search, collegeFilter]);

    // FIX 3: Global Loading State
    // Check if we are doing the very first load (and have no data yet)
    const isFirstLoad = (isGateLoading && gateLogs.length === 0) || (isHostelLoading && hostelLogs.length === 0) || isAuthLoading;

    if (isFirstLoad) {
        return (
            <div className="flex h-full items-center justify-center space-y-4 flex-col opacity-50">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                <p className="text-sm font-mono text-muted-foreground animate-pulse">Syncing logs...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-background text-foreground font-sans animate-in fade-in duration-500 overflow-hidden">
            {/* Header Section */}
            <div className="flex-none p-6 border-b border-border space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Activity className="text-amber-500" />
                            Activity Logs
                        </h1>
                        <p className="text-muted-foreground mt-1">Monitor gate access and hostel check-ins in real-time.</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
                        </div>
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10 bg-card/50 border-input focus:bg-background transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* College Dropdown */}
                        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                            <SelectTrigger className="w-full md:w-70 pl-9 relative bg-card/50 border-input">
                                <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <SelectValue placeholder="All colleges" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="max-h-75">
                                <SelectGroup>
                                    <SelectLabel>Colleges</SelectLabel>
                                    <SelectItem value="All colleges">All colleges</SelectItem>
                                    {uniqueColleges.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Toggle Group - Direction */}
                        <div className="flex items-center gap-1 p-1 rounded-lg border border-input bg-card/50 self-start md:self-auto shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDirectionFilter("All")}
                                className={`h-8 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                    ${directionFilter === 'All'
                                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                            >
                                All
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDirectionFilter("IN")}
                                className={`h-8 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                    ${directionFilter === 'IN'
                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                            >
                                <LogIn size={14} className="mr-2" />
                                IN
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDirectionFilter("OUT")}
                                className={`h-8 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                    ${directionFilter === 'OUT'
                                        ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                            >
                                <LogOut size={14} className="mr-2" />
                                OUT
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {/* <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"> */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-1 gap-0 overflow-hidden">
                {/* COLUMN 1: Gate Access Logs */}
                <div className="flex flex-col border-r border-border overflow-hidden bg-linear-to-b from-transparent to-background/5">
                    <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between sticky top-0 backdrop-blur-sm z-10">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
                            <ArrowRightLeft className="text-blue-500" size={20} />
                            Gate Check In/Out
                        </h2>
                        <Badge variant="secondary" className="font-mono text-xs">{filteredGateLogs.length} Records</Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {filteredGateLogs.length > 0 ? (
                            filteredGateLogs.map((log, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-amber-500/30">
                                    <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <Badge variant="outline" className={`font-mono text-xs border-0 
                                            ${log.direction === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {log.direction}
                                        </Badge>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center 
                                            ${log.direction === 'IN' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                            {log.direction === 'IN' ?
                                                <LogIn size={20} className="text-emerald-500" /> :
                                                <LogOut size={20} className="text-red-500" />
                                            }
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold leading-none">{log.student_name}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                                                <Mail size={10} />
                                                {log.student_email}
                                            </p>

                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <School size={12} />
                                                {log.college_name}
                                            </p>
                                            <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center justify-center gap-1.5 font-mono text-foreground/70 bg-secondary/50 px-2 py-1 rounded leading-none">
                                                    <CalendarClock size={11} />
                                                    {formatDateTime(log.logged_at)}
                                                </span>
                                                <span className="flex items-center gap-1" title="Verified By">
                                                    <ShieldCheck size={11} />
                                                    {log.personell_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No gate logs found" />
                        )}
                    </div>
                </div>

                {/* COLUMN 2: Hostel Check-in Logs */}
                {/* <div className="flex flex-col overflow-hidden bg-linear-to-b from-transparent to-background/5">
                    <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between sticky top-0 backdrop-blur-sm z-10">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
                            <Building2 className="text-purple-500" size={20} />
                            Hostel Check In
                        </h2>
                        <Badge variant="secondary" className="font-mono text-xs">{filteredHostelLogs.length} Records</Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {filteredHostelLogs.length > 0 ? (
                            filteredHostelLogs.map((log, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-amber-500/30">
                                    <div className="absolute top-0 right-0 p-3">
                                        <Badge variant="secondary" className="font-mono text-xs bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">
                                            {log.hostel_name}
                                        </Badge>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-purple-500/10 flex items-center justify-center">
                                            <MapPin size={20} className="text-purple-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold leading-none">{log.student_name}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                                                <Mail size={10} />
                                                {log.student_email}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <School size={12} />
                                                {log.college_name}
                                            </p>
                                            <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center justify-center gap-1.5 font-mono text-foreground/70 bg-secondary/50 px-2 py-1 rounded leading-none">
                                                    <CalendarClock size={11} />
                                                    {formatDateTime(log.logged_at)}
                                                </span>
                                                <span className="flex items-center gap-1" title="Verified By">
                                                    <UserCircle size={11} />
                                                    {log.personell_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No hostel check-ins found" />
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center opacity-60">
            <div className="bg-muted/50 p-4 rounded-full mb-3">
                <Search size={24} />
            </div>
            <p>{message}</p>
        </div>
    )
}