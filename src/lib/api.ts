export const BASE_URL = "/api/v1";
export const api = {
    LOGIN: `/accommodation/panel/login`,
    GET_ALL_ACCOMODATION: `/accommodation/panel`,

    LOGOUT: `/accommodation/panel/logout`,
    SESSION: `/accommodation/panel/session`,

    GET_UNCLAIMED_BEDS: `/accommodation/panel/beds/unclaimed`,
    DELETE_UNCLAIMED_BED: (bedId: string) => `/accommodation/panel/beds/unclaimed/${bedId}`,

    GET_GATE_LOGS: '/accommodation/panel/gate/logs',
    GET_HOSTEL_LOGS: '/accommodation/panel/hostel/logs'
}
