import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getResponses } from '@/mocks/data'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect } from 'react'
import { User, Users } from 'lucide-react'

export const Route = createFileRoute('/status')({
    component: StatusPage,
})

function StatusPage() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem("isAuthenticated")) {
            navigate({ to: '/login' })
        }
    }, [navigate])

    const { data: responses, isLoading } = useQuery({
        queryKey: ['responses'],
        queryFn: getResponses,
    })

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading status...</div>

    // Split based on Accommodation Type (Mock logic: "Hostel" = Sharing, "Dorm" = Single/Sharing fallback)
    // Actually, let's use the field accommodationType. 
    // Let's assume "Hostel" is Sharing and "Dorm" is Single for this demo visual split, 
    // or just filter generic types if specific logic wasn't provided.
    // User asked: "Status - it should show all the people who want accomdation (from first page) divided to cards as single room/sharing room."
    // My mock data generator sets accommodationType to "Hostel" or "Dorm". 
    // I'll treat "Dorm" as Sharing and "Hostel" as Single (or vice-versa, or just use the string).
    // Let's create two categories.

    const singleRooms = responses?.filter(r => r.accommodationType === 'Hostel') || [] // Let's call Hostel "Single" for demo
    const sharingRooms = responses?.filter(r => r.accommodationType !== 'Hostel') || [] // Dorms etc

    return (
        <div className="p-6 min-h-screen bg-background text-foreground font-sans animate-in fade-in duration-500 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Room Status</h1>
                <p className="text-muted-foreground mt-1">Allocation requests by room type.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Single Rooms Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-bold text-amber-500">
                        <User size={24} />
                        <h2>Single Room Requests</h2>
                        <Badge variant="secondary" className="ml-auto">{singleRooms.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {singleRooms.map(r => (
                            <Card key={r.id} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-foreground">{r.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{r.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="mb-1 border-primary/30 text-primary">{r.hostel}</Badge>
                                        <p className="text-xs text-muted-foreground">{r.checkInStatus}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sharing Rooms Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-bold text-blue-500">
                        <Users size={24} />
                        <h2>Sharing Room Requests</h2>
                        <Badge variant="secondary" className="ml-auto">{sharingRooms.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {sharingRooms.map(r => (
                            <Card key={r.id} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-foreground">{r.fullName}</p>
                                        <p className="text-sm text-muted-foreground">{r.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="mb-1 border-blue-500/30 text-blue-500">{r.hostel}</Badge>
                                        <p className="text-xs text-muted-foreground">{r.checkInStatus}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
