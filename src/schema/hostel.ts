import z from "zod";

export const createHostelSchema = z.object({
    hostel_id: z.uuid().optional(),
    room_count: z.number().min(1, { message: "Available rooms must be at least 1" }),
    room_filled: z.number().min(0, { message: "Filled rooms cannot be negative" }).default(0),
    is_male: z.boolean(),
    warden_email: z.email({ message: "Invalid email address" }),
    latitude: z.string().optional(),
    longtitude: z.string().optional(),
    map_url: z.url({ message: "Invalid URL format" }).optional(),
    hostel_name: z.string()
        .min(1, { message: "Hostel name cannot be empty" })
        .transform(val => val.toUpperCase())
        .refine(
            val => val.endsWith('BHAVANAM - SINGLE') || val.endsWith('BHAVANAM - DORM') || val.endsWith('BHAVANAM - 4 SHARING'),
            { message: "Hostel name must end with 'BHAVANAM - SINGLE', 'BHAVANAM - DORM', or 'BHAVANAM - 4 SHARING'" }
        ),
    day_scholar_price: z.number().min(0),
    outsider_price: z.number().min(0)
});

export type CreateHostel = z.infer<typeof createHostelSchema>;