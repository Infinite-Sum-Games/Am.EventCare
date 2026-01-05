
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Mail, Phone, Bed, User, Clock } from 'lucide-react'
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import type { PendingAllotment } from '@/mocks/mockPendingAllotments'

export const Route = createFileRoute('/pending-allotments')({
    component: PendingAllotmentsPage,
})

function PendingAllotmentsPage() {
    const queryClient = useQueryClient()

    const { data: allotments = [] } = useQuery<PendingAllotment[]>({
        queryKey: ['unclaimed-beds'],
        queryFn: async () => {
            const res = await axiosClient.get(api.GET_UNCLAIMED_BEDS)
            console.log("Unclaimed Beds Response:", res.data)

            // Check if response is directly an array
            if (Array.isArray(res.data)) {
                return res.data
            }

            // Check for likely wrapped properties based on other endpoints
            if (res.data && Array.isArray(res.data.beds)) {
                return res.data.beds
            }

            if (res.data && Array.isArray(res.data.data)) {
                return res.data.data
            }

            return []
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axiosClient.delete(api.DELETE_UNCLAIMED_BED(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unclaimed-beds'] })
            toast.success("Allotment request removed")
        },
        onError: (err) => {
            toast.error("Failed to remove allotment request", {
                description: err.message || "Please try again.",
            })
        }
    })

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to remove this pending allotment?")) {
            deleteMutation.mutate(id)
        }
    }

    return (
        <div className="p-6 space-y-6 min-h-screen bg-background text-foreground animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <Clock className="text-amber-500" />
                    Pending Allotments
                </h1>
                <p className="text-muted-foreground mt-1">Manage and review unclaimed bed allotments.</p>
            </div>

            {Array.isArray(allotments) && allotments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-muted-foreground/25 rounded-lg bg-muted/5">
                    <Bed className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No pending allotments</h3>
                    <p className="text-muted-foreground text-sm">All beds have been claimed or processed.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                    {Array.isArray(allotments) && allotments.map((allotment) => (
                        <Card key={allotment.id} className="bg-card/50 border-input hover:border-amber-500/50 transition-all duration-300 group p-2">
                            <CardContent className="py-2 px-3 pl-4 flex flex-col md:flex-row items-center justify-between gap-3">
                                <div className="flex-1 grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto] gap-x-2 gap-y-1 items-center">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-base flex items-center gap-2">
                                            <User size={16} className="text-amber-500" />
                                            {allotment.student_name}
                                        </h3>
                                        <div className="hidden md:block w-px h-3.5 bg-border" />
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Bed size={14} />
                                        {allotment.hostel_name}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Mail size={14} className="shrink-0" />
                                        <span className="truncate max-w-[140px] md:max-w-none">{allotment.student_email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Phone size={14} className="shrink-0" />
                                        <span>{allotment.phone_number}</span>
                                    </div>
                                </div>

                                {/* Delete Action */}
                                <div className="pt-2 md:pt-0 pl-0 md:pl-2 border-t md:border-t-0 md:border-l border-border/50 self-stretch flex items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(allotment.id)}
                                        className="h-9 px-3 gap-2 border-red-500/20 text-red-500/70 bg-red-500/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/40 transition-all duration-300 text-sm font-medium"
                                    >
                                        <span>Delete</span>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
