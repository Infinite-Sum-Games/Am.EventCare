export interface GateLog {
    student_name: string;
    student_email: string;
    college_name: string;
    direction: 'IN' | 'OUT';
    logged_at: string; // ISO String
    personell_name: string;
}

export interface HostelLog {
    student_name: string;
    student_email: string;
    college_name: string;
    hostel_name: string;
    logged_at: string; // ISO String
    personell_name: string;
}

export const mockGateLogs: GateLog[] = [
    {
        student_name: "Arjun Kumar",
        student_email: "arjun.k@example.com",
        college_name: "Amrita Vishwa Vidyapeetham",
        direction: "IN",
        logged_at: "2024-02-15T08:30:00Z",
        personell_name: "Security Guard 1"
    },
    {
        student_name: "Priya Sharma",
        student_email: "priya.s@example.com",
        college_name: "PSG College of Technology",
        direction: "OUT",
        logged_at: "2024-02-15T09:15:00Z",
        personell_name: "Security Guard 2"
    },
    {
        student_name: "Rahul Verma",
        student_email: "rahul.v@example.com",
        college_name: "IIT Madras",
        direction: "IN",
        logged_at: "2024-02-15T10:00:00Z",
        personell_name: "Security Guard 1"
    },
    {
        student_name: "Sneha Gupta",
        student_email: "sneha.g@example.com",
        college_name: "NIT Trichy",
        direction: "OUT",
        logged_at: "2024-02-15T11:45:00Z",
        personell_name: "Security Guard 3"
    },
    {
        student_name: "Vikram Singh",
        student_email: "vikram.s@example.com",
        college_name: "BITS Pilani",
        direction: "IN",
        logged_at: "2024-02-15T13:20:00Z",
        personell_name: "Security Guard 2"
    },
    {
        student_name: "Anjali Nair",
        student_email: "anjali.n@example.com",
        college_name: "VIT Vellore",
        direction: "IN",
        logged_at: "2024-02-15T14:10:00Z",
        personell_name: "Security Guard 1"
    },
    {
        student_name: "Karthik R",
        student_email: "karthik.r@example.com",
        college_name: "SSN College of Engineering",
        direction: "OUT",
        logged_at: "2024-02-15T15:30:00Z",
        personell_name: "Security Guard 3"
    }
];

export const mockHostelLogs: HostelLog[] = [
    {
        student_name: "Arjun Kumar",
        student_email: "arjun.k@example.com",
        college_name: "Amrita Vishwa Vidyapeetham",
        hostel_name: "Vasishta",
        logged_at: "2024-02-15T08:45:00Z",
        personell_name: "Warden 1"
    },
    {
        student_name: "Rahul Verma",
        student_email: "rahul.v@example.com",
        college_name: "IIT Madras",
        hostel_name: "Agastya",
        logged_at: "2024-02-15T10:15:00Z",
        personell_name: "Warden 2"
    },
    {
        student_name: "Vikram Singh",
        student_email: "vikram.s@example.com",
        college_name: "BITS Pilani",
        hostel_name: "Vasishta",
        logged_at: "2024-02-15T13:45:00Z",
        personell_name: "Warden 1"
    },
    {
        student_name: "Anjali Nair",
        student_email: "anjali.n@example.com",
        college_name: "VIT Vellore",
        hostel_name: "Gargi",
        logged_at: "2024-02-15T14:30:00Z",
        personell_name: "Warden 3"
    },
    {
        student_name: "Meera Reddy",
        student_email: "meera.r@example.com",
        college_name: "Osmania University",
        hostel_name: "Gargi",
        logged_at: "2024-02-15T16:00:00Z",
        personell_name: "Warden 3"
    }
];
