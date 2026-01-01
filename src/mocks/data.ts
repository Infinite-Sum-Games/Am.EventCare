import { z } from "zod";

// Schemas
export const AccommodationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Dorm", "Hotel", "Hostel"]),
  capacity: z.number(),
  occupied: z.number(),
});

export const FormResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  college_name: z.string(),
  college_roll_number: z.string(),
  is_male: z.boolean(),
  check_in_status: z.enum(["RESERVED", "IN", "OUT"]),
  room_preference: z.string(),
  hostel: z.string(),
  is_paid: z.boolean(),
  check_in_date: z.string(),
  check_in_time: z.string(),
  check_out_date: z.string(),
  check_out_time: z.string(),
});

export type Accommodation = z.infer<typeof AccommodationSchema>;
export type FormResponse = z.infer<typeof FormResponseSchema>;

// Mock Data Generators
const colleges = [
  "IIT Bombay", "NIT Trichy", "BITS Pilani", "Amrita Vishwa Vidyapeetham",
  "SRM University", "VIT Vellore", "Manipal Institute of Technology",
  "Anna University", "PSG Tech", "SASTRA University"
];

const firstNames = [
  "Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Karthik", "Divya",
  "Rahul", "Neha", "Sanjay", "Meera", "Arjun", "Kavya", "Varun", "Shruti",
  "Aditya", "Ria", "Siddharth", "Nisha"
];

const lastNames = [
  "Sharma", "Patel", "Gupta", "Reddy", "Singh", "Kumar", "Iyer", "Menon",
  "Nair", "Rao", "Varma", "Chopra", "Malhotra", "Joshi", "Bhat"
];

const generateResponses = (count: number): FormResponse[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const isMale = Math.random() > 0.5;

    // Generate random dates within a range (e.g., Jan 2025)
    // For simplicity, fixed range or random increment
    const day = 7 + Math.floor(Math.random() * 5); // 7th to 12th
    const stayDuration = 1 + Math.floor(Math.random() * 4); // 1-4 days
    const checkInDate = `2025-01-${day.toString().padStart(2, '0')}`;
    const checkOutDate = `2025-01-${(day + stayDuration).toString().padStart(2, '0')}`;

    // 24h Time
    const inHour = 8 + Math.floor(Math.random() * 12); // 08:00 to 20:00
    const outHour = 7 + Math.floor(Math.random() * 12);
    const checkInTime = `${inHour.toString().padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`;
    const checkOutTime = `${outHour.toString().padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`;


    return {
      id: `user_${i + 1}`,
      name: fullName,
      email,
      phone_number: `+91 ${9000000000 + i}`,
      college_name: colleges[Math.floor(Math.random() * colleges.length)],
      college_roll_number: `CB.SC.U4CSE23${(600 + i).toString()}`,
      is_male: isMale,
      check_in_status: Math.random() > 0.7 ? (Math.random() > 0.5 ? "IN" : "OUT") : "RESERVED",
      room_preference: Math.random() > 0.3 ? "Hostel" : "Dorm",
      hostel: Math.random() > 0.2 ? (["A", "B", "C", "D"][Math.floor(Math.random() * 4)]) : "Not Assigned",
      is_paid: Math.random() > 0.2,
      check_in_date: checkInDate,
      check_in_time: checkInTime,
      check_out_date: checkOutDate,
      check_out_time: checkOutTime,
    };
  });
};

let formResponses: FormResponse[] = generateResponses(100);

export const accommodations: Accommodation[] = [
  { id: "acc_1", name: "Boys Hostel A", type: "Hostel", capacity: 100, occupied: 45 },
  { id: "acc_2", name: "Girls Hostel B", type: "Hostel", capacity: 100, occupied: 32 },
  { id: "acc_3", name: "International Guest House", type: "Hotel", capacity: 20, occupied: 15 },
];

// Simulated API Calls
export const getResponses = async (): Promise<FormResponse[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...formResponses];
};

export const getStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const total = formResponses.length;
  const checkedIn = formResponses.filter((r) => r.check_in_status === "IN").length;
  const checkedOut = formResponses.filter((r) => r.check_in_status === "OUT").length;
  return { total, checkedIn, checkedOut };
};

export const checkInUser = async (id: string): Promise<FormResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const userIndex = formResponses.findIndex(r => r.id === id || r.email === id);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const updatedUser = { ...formResponses[userIndex], check_in_status: "IN" as const };
  formResponses = [
    ...formResponses.slice(0, userIndex),
    updatedUser,
    ...formResponses.slice(userIndex + 1)
  ];

  return updatedUser;
};

export const checkOutUser = async (id: string): Promise<FormResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const userIndex = formResponses.findIndex(r => r.id === id || r.email === id);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const updatedUser = { ...formResponses[userIndex], check_in_status: "OUT" as const };
  formResponses = [
    ...formResponses.slice(0, userIndex),
    updatedUser,
    ...formResponses.slice(userIndex + 1)
  ];

  return updatedUser;
};
