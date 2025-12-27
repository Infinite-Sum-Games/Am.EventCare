import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getResponses } from '@/mocks/data'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useMemo, useEffect } from 'react'
import {
    Building,
    School,
    CreditCard,
    CircleX,
    User,
    CheckCircle2,
    AlertCircle,
    Home,
    Clock,
    LogIn,
    LogOut
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/responses')({
    component: ResponsesPage,
})

function ResponsesPage() {
    const navigate = useNavigate()
    // Auth check
    useEffect(() => {
        if (!localStorage.getItem("isAuthenticated")) {
            navigate({ to: '/login' })
        }
    }, [navigate])

    const [search, setSearch] = useState("")
    const [hostelFilter, setHostelFilter] = useState("Hostels")
    const [genderFilter, setGenderFilter] = useState("All") // "All" | "Male" | "Female"
    const [collegeFilter, setCollegeFilter] = useState("Colleges")
    const [paymentFilter, setPaymentFilter] = useState("Status")

    const { data: responses, isLoading, error } = useQuery({
        queryKey: ['responses'],
        queryFn: getResponses,
    })

    const filteredResponses = useMemo(() => {
        if (!responses) return [];
        return responses.filter(r => {
            const matchesSearch =
                r.fullName.toLowerCase().includes(search.toLowerCase()) ||
                r.email.toLowerCase().includes(search.toLowerCase());

            const matchesHostel = hostelFilter === "Hostels" || r.hostel === hostelFilter;
            // Strict gender filter if not All, otherwise loose
            const matchesGender = genderFilter === "All" || r.gender === genderFilter;
            const matchesCollege = collegeFilter === "Colleges" || r.college === collegeFilter;
            const matchesPayment = paymentFilter === "Status" || r.paymentStatus === paymentFilter;

            return matchesSearch && matchesHostel && matchesGender && matchesCollege && matchesPayment;
        });
    }, [responses, search, hostelFilter, genderFilter, collegeFilter, paymentFilter]);

    // Extract unique colleges for filter
    const uniqueColleges = useMemo(() => {
        if (!responses) return [];
        return Array.from(new Set(responses.map(r => r.college))).sort();
    }, [responses]);

    // Active filter count for badge
    const activeFilterCount = [
        hostelFilter !== "Hostels",
        genderFilter !== "All",
        collegeFilter !== "Colleges",
        paymentFilter !== "Status"
    ].filter(Boolean).length;

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading responses...</div>
    if (error) return <div className="p-8 text-center text-destructive">Error loading data</div>

    return (
        <div className="p-6 space-y-6 min-h-screen bg-background text-foreground font-sans animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Accommodation</h1>
                    <p className="text-muted-foreground mt-1">Manage registration and accommodation details.</p>
                </div>
                <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground shadow-sm">
                    Total: <span className="text-foreground font-medium ml-1">{responses?.length}</span>
                </div>
            </div>

            <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className="px-0 pb-6 space-y-4">
                    {/* Search and Filters Container */}
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="max-w-md">
                            <Input
                                placeholder="Search by name or email..."
                                className="bg-background border-input text-foreground focus-visible:ring-ring"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Independent Filters */}
                        <div className="flex flex-wrap items-center gap-6">

                            {/* Gender Toggle Group */}
                            <div className="flex items-center gap-1 p-1 rounded-lg border border-input bg-card/50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setGenderFilter("All")}
                                    className={`h-9 rounded-md px-4 text-xs font-medium transition-all duration-300 border
                                        ${genderFilter === 'All'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    All
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setGenderFilter("Male")}
                                    className={`h-9 rounded-md px-4 text-xs font-medium transition-all duration-300 border
                                        ${genderFilter === 'Male'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    Male
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setGenderFilter("Female")}
                                    className={`h-9 rounded-md px-4 text-xs font-medium transition-all duration-300 border
                                        ${genderFilter === 'Female'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    Female
                                </Button>
                            </div>

                            {/* College Dropdown */}
                            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                                <SelectTrigger className="w-[200px] pl-9 relative bg-background/50 border-input">
                                    <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <SelectValue placeholder="Colleges" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Colleges</SelectLabel>
                                        <SelectItem value="Colleges">Colleges</SelectItem>
                                        {uniqueColleges.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Hostel Dropdown */}
                            <Select value={hostelFilter} onValueChange={setHostelFilter}>
                                <SelectTrigger className="w-[150px] pl-9 relative bg-background/50 border-input">
                                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <SelectValue placeholder="Hostels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Hostels</SelectLabel>
                                        <SelectItem value="Hostels">Hostels</SelectItem>
                                        <SelectItem value="A">Hostel A</SelectItem>
                                        <SelectItem value="B">Hostel B</SelectItem>
                                        <SelectItem value="C">Hostel C</SelectItem>
                                        <SelectItem value="D">Hostel D</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Payment Dropdown */}
                            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                <SelectTrigger className="w-[150px] pl-9 relative bg-background/50 border-input">
                                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="Status">Status</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters (Conditional) */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={() => {
                                        setHostelFilter("Hostels");
                                        setGenderFilter("All");
                                        setCollegeFilter("Colleges");
                                        setPaymentFilter("Status");
                                    }}
                                    className="flex items-center justify-center gap-2 p-2 rounded-lg 
                                             text-xs font-medium text-red-400
                                             bg-red-500/10 border border-red-500/20
                                             shadow-[0_0_10px_rgba(220,38,38,0.1)]
                                             hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]
                                             transition-all duration-300 group h-10 px-4"
                                >
                                    <CircleX size={16} className="group-hover:scale-105 transition-transform" />
                                    <span>Clear Filters</span>
                                </button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="flex flex-col gap-4">
                        {filteredResponses.map(response => (
                            <div key={response.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                {/* Card Flex */}
                                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                                    {/* LEFT SECTION: BIO */}
                                    <div className="flex-[1.5] min-w-[240px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 pb-6 lg:pb-0 lg:pr-6">
                                        <div>
                                            <h3 className="text-xl font-bold uppercase tracking-wide text-foreground">{response.fullName}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{response.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            {/* Gender */}
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-input bg-muted/20">
                                                <User size={14} className="text-muted-foreground" />
                                                <span className="text-sm font-medium uppercase">{response.gender}</span>
                                            </div>
                                            {/* Payment */}
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${response.paymentStatus === 'Paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
                                                {response.paymentStatus === 'Paid' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                <span className="text-sm font-bold uppercase">{response.paymentStatus}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MIDDLE SECTION: DETAILS */}
                                    <div className="flex-[2] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 pb-6 lg:pb-0 lg:pr-6 lg:pl-6">
                                        <div>
                                            <p className="text-sm font-bold text-foreground uppercase tracking-wide mb-1 line-clamp-1" title={response.college}>{response.college}</p>
                                            <p className="font-mono text-sm text-amber-600/90">{response.rollNumber}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            {/* Hostel */}
                                            <div className={`flex-1 min-w-[140px] flex items-center gap-3 p-2 rounded-lg border ${response.hostel !== 'Not Assigned' ? 'border-border bg-card' : 'border-red-500/30 bg-red-500/5 text-red-500'}`}>
                                                <Home size={18} className="opacity-70" />
                                                <div>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Hostel</p>
                                                    <p className="font-medium text-sm truncate">{response.hostel === 'Not Assigned' ? 'Not Assigned' : `Hostel ${response.hostel}`}</p>
                                                </div>
                                            </div>
                                            {/* Status */}
                                            <div className={`flex-1 min-w-[140px] flex items-center gap-3 p-2 rounded-lg border 
                                                ${response.checkInStatus === 'Checked In' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600' : ''}
                                                ${response.checkInStatus === 'Reserved' ? 'border-amber-500/30 bg-amber-500/5 text-amber-600' : ''}
                                                ${response.checkInStatus === 'Checked Out' ? 'border-red-500/30 bg-red-500/5 text-red-600' : ''}
                                             `}>
                                                {response.checkInStatus === 'Checked In' && <CheckCircle2 size={18} />}
                                                {response.checkInStatus === 'Reserved' && <Clock size={18} />}
                                                {response.checkInStatus === 'Checked Out' && <LogOut size={18} />}
                                                <div>
                                                    <p className="text-[10px] uppercase opacity-70 font-semibold">Status</p>
                                                    <p className="font-bold text-sm">{response.checkInStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION: DATES */}
                                    <div className="flex-none flex gap-3 lg:pl-6 items-center justify-end">
                                        {/* Check In */}
                                        <div className="w-32 border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 min-h-[90px] relative overflow-hidden group/date bg-card">
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <LogIn size={12} />
                                                <span className="text-[10px] uppercase font-bold">Check In</span>
                                            </div>
                                            <div className="text-xl font-bold text-foreground">{response.checkInDate}</div>
                                            <div className="mt-1 text-[10px] font-mono bg-muted/50 rounded px-1.5 py-0.5">
                                                {response.checkInTime}
                                            </div>
                                        </div>

                                        {/* Check Out */}
                                        <div className="w-32 border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 min-h-[90px] relative overflow-hidden group/date bg-card">
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <LogOut size={12} />
                                                <span className="text-[10px] uppercase font-bold">Check Out</span>
                                            </div>
                                            <div className="text-xl font-bold text-foreground">{response.checkOutDate}</div>
                                            <div className="mt-1 text-[10px] font-mono bg-muted/50 rounded px-1.5 py-0.5">
                                                {response.checkOutTime}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredResponses.length === 0 && (
                            <div className="bg-card border border-border rounded-xl p-12 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={32} className="text-muted-foreground opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground">No bookings found</h3>
                                <p className="text-muted-foreground mt-1">Try adjusting your filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
