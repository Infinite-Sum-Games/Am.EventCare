import { useState } from 'react'
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
import { Plus, Mars, Venus, Loader2, Map as MapIcon, Globe, Info, Banknote } from 'lucide-react'
import type { CreateHostel } from '@/schema/hostel'

interface NewHostelDialogProps {
    onCreate: (data: CreateHostel) => void
    isLoading: boolean
}

export function NewHostelDialog({ onCreate, isLoading }: NewHostelDialogProps) {
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

    const generatedName = baseName 
        ? `${baseName.toUpperCase()} BHAVANAM - ${roomType}` 
        : `[NAME] BHAVANAM - ${roomType}`;

    const handleSubmit = () => {
        const payload: CreateHostel = {
            hostel_name: `${baseName.toUpperCase()} BHAVANAM - ${roomType}`,
            is_male: gender === 'male',
            room_count: parseInt(roomCount),
            room_filled:0,
            warden_email: email,
            day_scholar_price: parseFloat(dayScholarPrice),
            outsider_price: parseFloat(outsiderPrice),
            latitude: lat || undefined,
            longtitude: long || undefined,
            map_url: mapUrl || undefined,
        }

        onCreate(payload)
        setOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setBaseName('')
        setRoomType('SINGLE')
        setGender('male')
        setRoomCount('1')
        setEmail('')
        setLat('')
        setLong('')
        setMapUrl('')
        setDayScholarPrice('0')
        setOutsiderPrice('0')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer font-semibold">
                    <Plus className="h-4 w-4" />
                    Add Hostel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Hostel</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new hostel bhavanam.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-5 py-4">
                    {/* Name and Room Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Bhavanam Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. AGATHYA"
                                value={baseName}
                                onChange={(e) => setBaseName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Room Type *</Label>
                            <Select value={roomType} onValueChange={setRoomType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
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
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated Name</p>
                            <p className={`text-sm font-mono font-bold ${baseName ? 'text-foreground' : 'text-muted-foreground italic'}`}>
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
                            <Label htmlFor="rooms">Total Beds *</Label>
                            <Input
                                id="rooms"
                                type="number"
                                min="1"
                                value={roomCount}
                                onChange={(e) => setRoomCount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Warden Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="warden@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Separator />

                    {/* Pricing Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Banknote className="h-4 w-4" />
                            Pricing Details (per day)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="day_price">Day Scholar Price *</Label>
                                <Input
                                    id="day_price"
                                    type="number"
                                    placeholder="0.00"
                                    value={dayScholarPrice}
                                    onChange={(e) => setDayScholarPrice(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="out_price">Outsider Price *</Label>
                                <Input
                                    id="out_price"
                                    type="number"
                                    placeholder="0.00"
                                    value={outsiderPrice}
                                    onChange={(e) => setOutsiderPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Location Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <MapIcon className="h-4 w-4" />
                            Location Details (Optional)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                                <Input
                                    id="lat"
                                    placeholder="e.g. 10.1234"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="long" className="text-xs text-muted-foreground">Longitude</Label>
                                <Input
                                    id="long"
                                    placeholder="e.g. 76.5678"
                                    value={long}
                                    onChange={(e) => setLong(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mapUrl" className="text-xs text-muted-foreground">Google Maps URL</Label>
                            <div className="relative">
                                <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="mapUrl"
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="pl-8"
                                    value={mapUrl}
                                    onChange={(e) => setMapUrl(e.target.value)}
                                />
                            </div>
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
                        Save Hostel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}