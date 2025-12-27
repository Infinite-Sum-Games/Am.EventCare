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
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  college: z.string(),
  rollNumber: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  checkInStatus: z.enum(["Reserved", "Checked In", "Checked Out"]),
  accommodationType: z.string(),
  hostel: z.enum(["A", "B", "C", "D", "Not Assigned"]),
  paymentStatus: z.enum(["Paid", "Pending"]),
  daysStaying: z.number(),
  checkInDate: z.string(),
  checkInTime: z.string(),
  checkOutDate: z.string(),
  checkOutTime: z.string(),
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

    return {
      id: `user_${i + 1}`,
      fullName,
      email,
      phone: `+91 ${9000000000 + i}`,
      college: colleges[Math.floor(Math.random() * colleges.length)],
      rollNumber: `CB.SC.U4CSE23${(600 + i).toString()}`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      checkInStatus: Math.random() > 0.7 ? (Math.random() > 0.5 ? "Checked In" : "Checked Out") : "Reserved",
      accommodationType: Math.random() > 0.3 ? "Hostel" : "Dorm",
      hostel: Math.random() > 0.2 ? (["A", "B", "C", "D"][Math.floor(Math.random() * 4)] as any) : "Not Assigned",
      paymentStatus: Math.random() > 0.2 ? "Paid" : "Pending",
      daysStaying: Math.floor(Math.random() * 5) + 1,
      checkInDate: "7 JAN",
      checkInTime: "10:00 AM",
      checkOutDate: "9 JAN",
      checkOutTime: "07:00 PM",
    };
  });
};

let formResponses: FormResponse[] = generateResponses(100);

const accommodations: Accommodation[] = [
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
  const checkedIn = formResponses.filter((r) => r.checkInStatus === "Checked In").length;
  const checkedOut = formResponses.filter((r) => r.checkInStatus === "Checked Out").length;
  return { total, checkedIn, checkedOut };
};

export const checkInUser = async (id: string): Promise<FormResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const userIndex = formResponses.findIndex(r => r.id === id || r.email === id);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const updatedUser = { ...formResponses[userIndex], checkInStatus: "Checked In" as const };
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

  const updatedUser = { ...formResponses[userIndex], checkInStatus: "Checked Out" as const };
  formResponses = [
    ...formResponses.slice(0, userIndex),
    updatedUser,
    ...formResponses.slice(userIndex + 1)
  ];

  return updatedUser;
};
