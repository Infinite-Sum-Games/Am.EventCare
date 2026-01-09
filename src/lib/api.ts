export const BASE_URL = "/api/v1";
export const api = {
    LOGIN: `/accommodation/panel/login`,
    GET_ALL_ACCOMODATION: `/accommodation/panel`,

    LOGOUT: `/accommodation/panel/logout`,
    SESSION: `/accommodation/panel/session`,

    // hostel routes
    GET_ALL_HOSTELS: `accommodation/panel/hostel`,
    ADD_HOSTEL: `/accommodation/panel/hostel`,
    UPDATE_HOSTEL: `/accommodation/panel/hostel`,
    DELETE_HOSTEL: (id: string) => `/accommodation/panel/hostel/${id}`,
    GET_UNCLAIMED_BEDS: `/accommodation/panel/beds/unclaimed`,
    DELETE_UNCLAIMED_BED: (bedId: string) => `/accommodation/panel/beds/unclaimed/${bedId}`,

    GET_GATE_LOGS: '/accommodation/panel/gate/logs',
    GET_HOSTEL_LOGS: '/accommodation/panel/hostel/logs',

    GET_INSIDE_CAMPUS_ANALYTICS: '/analytics/hospitality/inside',
    GET_LIVE_BEDS_ANALYTICS: '/analytics/hospitality/beds'
}
