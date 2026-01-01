import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getResponses } from '@/mocks/data'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from 'react'
import {
    Building,
    School,
    CircleX,
    User,
    CheckCircle2,
    AlertCircle,
    Home,
    Clock,
    LogIn,
    LogOut,
    Mars,
    Venus,
    Loader2,
    Search,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CalendarClock
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
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export const Route = createFileRoute('/details')({
    component: ResponsesPage,
})

// Helper Functions
const formatTime = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Assuming ISO YYYY-MM-DD
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    // Custom formatted to DD-MM-YY as requested
    // But user asked for "show in the exact same format seen in the app right now" INITIALLY 
    // And THEN said "just that in format for showing date: use DD-MM-YY"
    // So I will use DD-MM-YY
    return `${day}-${month}-${year}`;
};

const calculateDuration = (inDate: string, outDate: string) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};


function ResponsesPage() {
    const [search, setSearch] = useState("")
    const [hostelFilter, setHostelFilter] = useState("All hostels")
    const [genderFilter, setGenderFilter] = useState("All") // "All" | "Male" | "Female"
    const [collegeFilter, setCollegeFilter] = useState("All colleges")
    const [paymentFilter, setPaymentFilter] = useState("All")

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const { data: responses, isLoading, error } = useQuery({
        queryKey: ['responses'],
        queryFn: getResponses,
    })

    const filteredResponses = useMemo(() => {
        if (!responses) return [];
        return responses.filter(r => {
            const matchesSearch =
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.email.toLowerCase().includes(search.toLowerCase());

            const matchesHostel = hostelFilter === "All hostels" || r.hostel === hostelFilter;
            // Strict gender filter if not All, otherwise loose
            const matchesGender = genderFilter === "All" || (genderFilter === "Male" ? r.is_male : !r.is_male);
            const matchesCollege = collegeFilter === "All colleges" || r.college_name === collegeFilter;
            const matchesPayment = paymentFilter === "All" || (paymentFilter === "Paid" ? r.is_paid : !r.is_paid);

            return matchesSearch && matchesHostel && matchesGender && matchesCollege && matchesPayment;
        });
    }, [responses, search, hostelFilter, genderFilter, collegeFilter, paymentFilter]);

    // Derived Pagination Logic
    const totalPages = Math.ceil(filteredResponses.length / ITEMS_PER_PAGE);
    const paginatedResponses = filteredResponses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [search, hostelFilter, genderFilter, collegeFilter, paymentFilter]);

    // Extract unique colleges for filter
    const uniqueColleges = useMemo(() => {
        if (!responses) return [];
        return Array.from(new Set(responses.map(r => r.college_name))).sort();
    }, [responses]);

    // Active filter count for badge
    const activeFilterCount = [
        hostelFilter !== "All hostels",
        genderFilter !== "All",
        collegeFilter !== "All colleges",
        paymentFilter !== "All"
    ].filter(Boolean).length;

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading responses...</p>
        </div>
    )
    if (error) return (
        <div className="p-8 max-w-md mx-auto">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Error loading data. Please try again later.
                </AlertDescription>
            </Alert>
        </div>
    )

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
                <CardHeader className="px-0 pb-2 space-y-6">
                    {/* Search and Filters Container */}
                    <div className="space-y-6">
                        {/* Search */}
                        {/* Search */}
                        <div className="max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 bg-background border-input text-foreground focus-visible:ring-ring"
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
                                    className={`h-7 rounded-md px-4 text-sm font-medium transition-all duration-300 border
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
                                    className={`h-7 rounded-md px-4 text-sm font-medium transition-all duration-300 border
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
                                    className={`h-7 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                        ${genderFilter === 'Female'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    Female
                                </Button>
                            </div>

                            {/* College Dropdown */}
                            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                                <SelectTrigger className="w-[275px] pl-9 relative bg-background/50 border-input">
                                    <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <SelectValue placeholder="All colleges" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Colleges</SelectLabel>
                                        <SelectItem value="All colleges">All colleges</SelectItem>
                                        {uniqueColleges.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Hostel Dropdown */}
                            <Select value={hostelFilter} onValueChange={setHostelFilter}>
                                <SelectTrigger className="w-[275px] pl-9 relative bg-background/50 border-input">
                                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <SelectValue placeholder="All hostels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Hostels</SelectLabel>
                                        <SelectItem value="All hostels">All hostels</SelectItem>
                                        <SelectItem value="A">Hostel A</SelectItem>
                                        <SelectItem value="B">Hostel B</SelectItem>
                                        <SelectItem value="C">Hostel C</SelectItem>
                                        <SelectItem value="D">Hostel D</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Payment Toggle Group */}
                            <div className="flex items-center gap-1 p-1 rounded-lg border border-input bg-card/50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPaymentFilter("All")}
                                    className={`h-7 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                        ${paymentFilter === 'All'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    All
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPaymentFilter("Paid")}
                                    className={`h-7 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                        ${paymentFilter === 'Paid'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    Paid
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPaymentFilter("Pending")}
                                    className={`h-7 rounded-md px-4 text-sm font-medium transition-all duration-300 border
                                        ${paymentFilter === 'Pending'
                                            ? 'bg-amber-500/5 backdrop-blur-md border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-500'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'}`}
                                >
                                    Pending
                                </Button>
                            </div>



                            {/* Clear Filters (Conditional) */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={() => {
                                        setHostelFilter("All hostels");
                                        setGenderFilter("All");
                                        setCollegeFilter("All colleges");
                                        setPaymentFilter("All");
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-md 
                                             text-sm font-medium text-red-400
                                             bg-red-500/10 border border-red-500/20
                                             shadow-[0_0_10px_rgba(220,38,38,0.1)]
                                             hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]
                                             transition-all duration-300 group h-9 px-4"
                                >
                                    <CircleX size={16} className="group-hover:scale-105 transition-transform" />
                                    <span>Clear Filters</span>
                                </button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                    <div className="flex flex-col gap-2">
                        {paginatedResponses.map(response => (
                            <div key={response.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                {/* Card Flex */}
                                <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-stretch">
                                    {/* LEFT SECTION: BIO */}
                                    <div className="flex-[2] min-w-[240px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 pb-6 lg:pb-0 lg:pr-3">
                                        <div>
                                            <h3 className="text-xl font-bold uppercase tracking-wide text-foreground">{response.name}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <Mail size={12} />
                                                <span>{response.email}</span>
                                                <span className="text-border">|</span>
                                                <Phone size={12} />
                                                <span>{response.phone_number}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            {/* Gender */}
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-input bg-muted/20">
                                                {response.is_male ? (
                                                    <Mars size={14} className="text-muted-foreground" />
                                                ) : (
                                                    <Venus size={14} className="text-muted-foreground" />
                                                )}
                                                <span className="text-sm font-medium uppercase">{response.is_male ? "Male" : "Female"}</span>
                                            </div>
                                            {/* Payment */}
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${response.is_paid ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
                                                {response.is_paid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                <span className="text-sm font-bold uppercase">{response.is_paid ? "Paid" : "Pending"}</span>
                                            </div>
                                            {/* Status - Moved from Section 2 */}
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border 
                                                ${response.check_in_status === 'IN' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600' : ''}
                                                ${response.check_in_status === 'RESERVED' ? 'border-amber-500/30 bg-amber-500/5 text-amber-600' : ''}
                                                ${response.check_in_status === 'OUT' ? 'border-red-500/20 bg-red-500/5 text-red-400' : ''}
                                             `}>
                                                {response.check_in_status === 'IN' && <CheckCircle2 size={14} />}
                                                {response.check_in_status === 'RESERVED' && <Clock size={14} />}
                                                {response.check_in_status === 'OUT' && <LogOut size={14} />}
                                                <span className="text-sm font-bold uppercase">{response.check_in_status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MIDDLE SECTION: DETAILS */}
                                    <div className="flex-[1.5] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 pb-6 lg:pb-0 lg:pr-6 lg:pl-3">
                                        <div>
                                            <p className="text-sm font-bold text-foreground uppercase tracking-wide mb-1 line-clamp-1" title={response.college_name}>{response.college_name}</p>
                                            <p className="font-mono text-sm text-amber-600/90">{response.college_roll_number}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            {/* Hostel */}
                                            <div className={`flex-1 min-w-[140px] flex items-center gap-3 p-2 rounded-lg border ${response.hostel !== 'Not Assigned' ? 'border-border bg-card' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
                                                <Home size={18} className="opacity-70" />
                                                <div>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Hostel</p>
                                                    <p className="font-medium text-sm truncate">{response.hostel === 'Not Assigned' ? 'Not Assigned' : `Hostel ${response.hostel}`}</p>
                                                </div>
                                            </div>

                                            {/* Duration (Calculated) */}
                                            <div className="flex-1 min-w-[140px] flex items-center gap-3 p-2 rounded-lg border border-border bg-card">
                                                <CalendarClock size={18} className="opacity-70" />
                                                <div>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Duration</p>
                                                    <p className="font-medium text-sm truncate">{calculateDuration(response.check_in_date, response.check_out_date)} Days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION: DATES */}
                                    <div className="flex-none flex gap-3 lg:pl-6 items-center justify-end">
                                        {/* Check In */}
                                        <div className={`w-32 border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 min-h-[90px] relative overflow-hidden group/date 
                                            ${response.check_in_status === 'IN' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'bg-card'}`}>
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <LogIn size={12} />
                                                <span className="text-[10px] uppercase font-bold">Check In</span>
                                            </div>
                                            <div className={`text-xl font-bold ${response.check_in_status === 'IN' ? 'text-emerald-500' : 'text-foreground'}`}>
                                                {formatDate(response.check_in_date)}
                                            </div>
                                            <div className="mt-1 text-[10px] font-mono bg-muted/50 rounded px-1.5 py-0.5">
                                                {formatTime(response.check_in_time)}
                                            </div>
                                        </div>

                                        {/* Check Out */}
                                        <div className={`w-32 border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 min-h-[90px] relative overflow-hidden group/date
                                            ${response.check_in_status === 'OUT' ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'bg-card'}`}>
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <LogOut size={12} />
                                                <span className="text-[10px] uppercase font-bold">Check Out</span>
                                            </div>
                                            <div className={`text-xl font-bold ${response.check_in_status === 'OUT' ? 'text-red-500' : 'text-foreground'}`}>
                                                {formatDate(response.check_out_date)}
                                            </div>
                                            <div className="mt-1 text-[10px] font-mono bg-muted/50 rounded px-1.5 py-0.5">
                                                {formatTime(response.check_out_time)}
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

                        {/* Pagination Controls */}
                        {filteredResponses.length > 0 && (
                            <div className="flex items-center justify-between mt-4 py-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredResponses.length)}</span> of <span className="font-medium text-foreground">{filteredResponses.length}</span> results
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex items-center gap-1 mx-2">
                                        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
