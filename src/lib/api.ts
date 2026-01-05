export const BASE_URL = "http://localhost:9000/api/v1";
export const api = {
    LOGIN: `/accommodation/panel/login`,
    GET_ALL_ACCOMODATION: `/accommodation/panel`,

    LOGOUT: `/accommodation/panel/logout`,
    SESSION: `/accommodation/panel/session`,

    // hostel routes
    GET_ALL_HOSTELS: `accommodation/app/hostels`,
    ADD_HOSTEL: `/accommodation/panel/hostel`,
    UPDATE_HOSTEL: `/accommodation/panel/hostel`,
    DELETE_HOSTEL: (id: string) => `/accommodation/panel/hostel/${id}`,
}
