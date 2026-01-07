import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import type { CreateHostel } from '@/schema/hostel'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Mail, MapPin, Mars, Venus, Trash2, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'
import { NewHostelDialog } from '@/components/new-hostel-dialog'
import { EditHostelDialog } from '@/components/edit-hostel-dialog'

export const Route = createFileRoute('/hostels')({
    component: HostelComponent
})

function HostelComponent() {
    const queryClient = useQueryClient();

    const { data: hostels = [], isLoading: isLoadingHostels, error: hostelsError } = useQuery<CreateHostel[]>({
        queryKey: ['hostels'],
        queryFn: async () => {
            const response = await axiosClient.get(api.GET_ALL_HOSTELS);
            return response.data.hostels;
        }
    });

    // 2. Create Hostel Mutation
    const { mutate: createHostel, isPending: isCreatingHostel } = useMutation({
        mutationFn: async (hostel: CreateHostel) => {
            const response = await axiosClient.post(api.ADD_HOSTEL, hostel);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
            toast.success('Hostel created successfully');
        },
        onError: () => {
            toast.error('Failed to create hostel. Please try again.');
        }
    });

    // 3. Update Hostel Mutation
    const { mutate: updateHostel, isPending: isUpdatingHostel } = useMutation({
        mutationFn: async (hostel: CreateHostel) => {
            // Ensure api.UPDATE_HOSTEL is defined in your api file
            const response = await axiosClient.put(api.UPDATE_HOSTEL, hostel);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
            toast.success('Hostel updated successfully');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error('Failed to update hostel.');
        }
    });

    // 4. Delete Hostel Mutation
    const deleteMutation = useMutation({
        mutationFn: async (hostel_id: string) => {
            return await axiosClient.delete(api.DELETE_HOSTEL(hostel_id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
            toast.success('Hostel deleted successfully');
        },
    });

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    }

    return (
        <div className="p-6 space-y-6 min-h-screen bg-background text-foreground font-sans animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Hostels</h1>
                    <p className="text-muted-foreground mt-1">Create and manage hostels.</p>
                </div>
                <NewHostelDialog onCreate={createHostel} isLoading={isCreatingHostel} />
            </div>

            <div>
                {isLoadingHostels && (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        <span className="ml-2 text-primary">Loading hostels...</span>
                    </div>
                )}

                {hostelsError && (
                    <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                        <p className="text-sm text-destructive">
                            {hostelsError instanceof Error ? hostelsError.message : 'Failed to load hostels. Please try again later.'}
                        </p>
                    </div>
                )}

                {!hostels && !isLoadingHostels && (
                    <div className="p-4 rounded-lg border">
                        <p className="text-sm">
                            No hostels found. Click on "Add New Hostel" to create one.
                        </p>
                    </div>
                )}

                {hostels && hostels.length === 0 && !isLoadingHostels && (
                    <div className="p-4 rounded-lg border">
                        <p className="text-sm">
                            No hostels found. Click on "Add New Hostel" to create one.
                        </p>
                    </div>
                )}

                {hostels && hostels.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {hostels.map((hostel: CreateHostel) => (
                            <Card key={hostel.hostel_id} className="border p-4 rounded-lg overflow-hidden">
                                <CardContent className='px-2 flex flex-col lg:flex-row justify-between items-center gap-6'>
                                    {/* Left Section: Info & Gender Icon */}
                                    <div className="flex items-center w-full lg:w-1/2">
                                        <div className="bg-secondary p-4 rounded-md flex items-center justify-center shrink-0">
                                            {hostel.is_male ? (
                                                <Mars className="text-blue-500 h-8 w-8" />
                                            ) : (
                                                <Venus className="text-pink-500 h-8 w-8" />
                                            )}
                                        </div>
                                        <div className="ml-4 flex flex-col justify-center overflow-hidden">
                                            <h2 className="text-xl font-semibold truncate">{hostel.hostel_name}</h2>
                                            <div className='flex flex-wrap items-center gap-y-1 gap-x-4 mt-1'>
                                                <div className='flex flex-row items-center'>
                                                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground truncate">{hostel.warden_email}</p>
                                                </div>
                                                <div className='flex flex-row items-center'>
                                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {hostel.longtitude && hostel.latitude ? (
                                                        <a href={hostel.map_url || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm text-muted-foreground">
                                                            {hostel.latitude}, {hostel.longtitude}
                                                        </a>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No location</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Section: Pricing */}
                                    <div className="flex flex-row items-center gap-6 bg-muted/30 px-4 py-2 rounded-lg border border-border/50">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Day Scholar</span>
                                            <div className="flex items-center justify-center text-primary font-bold mt-2">
                                                <IndianRupee className="h-4 w-4" />
                                                <span>{hostel.day_scholar_price}</span>
                                            </div>
                                        </div>
                                        <Separator orientation="vertical" className="h-8" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Outsider</span>
                                            <div className="flex items-center justify-center text-primary font-bold mt-2">
                                                <IndianRupee className="h-4 w-4" />
                                                <span>{hostel.outsider_price}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section: Capacity and Actions */}
                                    <div className='flex flex-row items-center shrink-0 ml-auto lg:ml-0'>
                                        <div className="bg-secondary p-2 rounded-md flex flex-col text-center justify-center items-center min-w-24">
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Total Beds</p>
                                            <p className="text-xl font-bold">{hostel.room_count-hostel.room_filled}/{hostel.room_count}</p>
                                        </div>
                                        
                                        <Separator orientation="vertical" className="mx-4 h-12" />
                                        
                                        <div className='flex flex-col gap-2 min-w-24'>
                                            {/* Integrated Edit Dialog */}
                                            <EditHostelDialog 
                                                hostel={hostel} 
                                                onUpdate={updateHostel} 
                                                isLoading={isUpdatingHostel} 
                                            />

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" className="w-full cursor-pointer">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the 
                                                            hostel <strong>{hostel.hostel_name}</strong> and remove the data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => hostel.hostel_id && handleDelete(hostel.hostel_id)}
                                                            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}