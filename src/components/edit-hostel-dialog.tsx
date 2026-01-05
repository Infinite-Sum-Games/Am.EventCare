import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Edit2, Mars, Venus, Loader2, Map as MapIcon, Info, Banknote } from 'lucide-react'
import type { CreateHostel } from '@/schema/hostel'

interface EditHostelDialogProps {
    hostel: CreateHostel
    onUpdate: (data: CreateHostel) => void
    isLoading: boolean
}

export function EditHostelDialog({ hostel, onUpdate, isLoading }: EditHostelDialogProps) {
    const [open, setOpen] = useState(false)
    
    // Form State
    const [baseName, setBaseName] = useState('')
    const [roomType, setRoomType] = useState('SINGLE')
    const [gender, setGender] = useState<'male' | 'female'>('male')
    const [roomCount, setRoomCount] = useState('1')
    const [email, setEmail] = useState('')
    const [lat, setLat] = useState('')
    const [long, setLong] = useState('')
    const [mapUrl, setMapUrl] = useState('')
    const [dayScholarPrice, setDayScholarPrice] = useState('0')
    const [outsiderPrice, setOutsiderPrice] = useState('0')

    useEffect(() => {
        if (open) {
            // Extract the base name from "NAME BHAVANAM - TYPE"
            const nameParts = hostel.hostel_name.split(' BHAVANAM - ');
            setBaseName(nameParts[0] || '');
            setRoomType(nameParts[1] || 'SINGLE');
            
            setGender(hostel.is_male ? 'male' : 'female');
            setRoomCount(hostel.room_count.toString());
            setEmail(hostel.warden_email);
            setDayScholarPrice(hostel.day_scholar_price?.toString() || '0');
            setOutsiderPrice(hostel.outsider_price?.toString() || '0');
            setLat(hostel.latitude || '');
            setLong(hostel.longtitude || '');
            setMapUrl(hostel.map_url || '');
        }
    }, [open, hostel]);

    const generatedName = baseName 
        ? `${baseName.toUpperCase()} BHAVANAM - ${roomType}` 
        : `[NAME] BHAVANAM - ${roomType}`;

    const handleSubmit = () => {
        const payload: CreateHostel = {
            ...hostel, // Keep the hostel_id
            hostel_name: `${baseName.toUpperCase()} BHAVANAM - ${roomType}`,
            is_male: gender === 'male',
            room_count: parseInt(roomCount),
            warden_email: email,
            day_scholar_price: parseFloat(dayScholarPrice),
            outsider_price: parseFloat(outsiderPrice),
            latitude: lat || undefined,
            longtitude: long || undefined,
            map_url: mapUrl || undefined,
        }

        onUpdate(payload);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full bg-secondary hover:bg-secondary/70 border cursor-pointer text-foreground">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Hostel</DialogTitle>
                    <DialogDescription>
                        Update the details for <strong>{hostel.hostel_name}</strong>.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Bhavanam Name *</Label>
                            <Input
                                id="edit-name"
                                value={baseName}
                                onChange={(e) => setBaseName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Room Type *</Label>
                            <Select value={roomType} onValueChange={setRoomType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SINGLE">SINGLE</SelectItem>
                                    <SelectItem value="DORM">DORM</SelectItem>
                                    <SelectItem value="4 SHARING">4 SHARING</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-muted/50 border rounded-lg p-3 flex items-start gap-3">
                        <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated Name</p>
                            <p className="text-sm font-mono font-bold text-foreground">
                                {generatedName}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="grid gap-2">
                            <Label>Gender *</Label>
                            <ToggleGroup 
                                type="single" 
                                value={gender} 
                                onValueChange={(val) => val && setGender(val as 'male' | 'female')}
                                className="justify-start rounded-md p-1"
                            >
                                <ToggleGroupItem value="male" className="flex-1 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">
                                    <Mars className="h-4 w-4 mr-1" /> Male
                                </ToggleGroupItem>
                                <ToggleGroupItem value="female" className="flex-1 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-700">
                                    <Venus className="h-4 w-4 mr-1" /> Female
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-rooms">Total Beds *</Label>
                            <Input
                                id="edit-rooms"
                                type="number"
                                value={roomCount}
                                onChange={(e) => setRoomCount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-email">Warden Email *</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Banknote className="h-4 w-4" />
                            Pricing Details (per day)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-day_price">Day Scholar Price *</Label>
                                <Input
                                    id="edit-day_price"
                                    type="number"
                                    value={dayScholarPrice}
                                    onChange={(e) => setDayScholarPrice(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-out_price">Outsider Price *</Label>
                                <Input
                                    id="edit-out_price"
                                    type="number"
                                    value={outsiderPrice}
                                    onChange={(e) => setOutsiderPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <MapIcon className="h-4 w-4" />
                            Location Details (Optional)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-lat" className="text-xs text-muted-foreground">Latitude</Label>
                                <Input
                                    id="edit-lat"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-long" className="text-xs text-muted-foreground">Longitude</Label>
                                <Input
                                    id="edit-long"
                                    value={long}
                                    onChange={(e) => setLong(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-mapUrl" className="text-xs text-muted-foreground">Google Maps URL</Label>
                            <Input
                                id="edit-mapUrl"
                                value={mapUrl}
                                onChange={(e) => setMapUrl(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isLoading || !baseName || !email}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}