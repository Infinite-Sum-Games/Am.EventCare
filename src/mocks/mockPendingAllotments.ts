export interface PendingAllotment {
    id: string;
    student_name: string;
    hostel_name: string;
    student_email: string;
    phone_number: string;
}

export const mockPendingAllotments: PendingAllotment[] = [
    {
        id: "1",
        student_name: "Rahul Sharma",
        hostel_name: "Boys Hostel A",
        student_email: "rahul.sharma@example.com",
        phone_number: "+91 9876543210"
    },
    {
        id: "2",
        student_name: "Priya Patel",
        hostel_name: "Girls Hostel B",
        student_email: "priya.patel@example.com",
        phone_number: "+91 9876543211"
    },
    {
        id: "3",
        student_name: "Amit Kumar",
        hostel_name: "Boys Hostel C",
        student_email: "amit.kumar@example.com",
        phone_number: "+91 9876543212"
    },
    {
        id: "4",
        student_name: "Sneha Reddy",
        hostel_name: "Girls Hostel A",
        student_email: "sneha.reddy@example.com",
        phone_number: "+91 9876543213"
    },
    {
        id: "5",
        student_name: "Vikram Singh",
        hostel_name: "Boys Hostel B",
        student_email: "vikram.singh@example.com",
        phone_number: "+91 9876543214"
    }
];
