const commonUrl = 'http://localhost:8080/api/'

const API = {
    common: {
        login: `${commonUrl}common/login`,
        forget_password_send_mail: `${commonUrl}common/forget-password-send-mail`,
        forget_password_reset: `${commonUrl}common/forget-password-reset`,
        reg: `${commonUrl}common/reg`,
        verify: `${commonUrl}common/verify`,
        getBuses: `${commonUrl}common/get-buses`,
        getSchedule: `${commonUrl}common/get-schedule`
    },
    user: {
        search: `${commonUrl}user/search-schedule`
    },
    admin: {
        addBus: `${commonUrl}admin/add-bus`,
        deleteBus: `${commonUrl}admin/delete-bus`,
        addSchedule: `${commonUrl}admin/create-new-schedule`,
        deleteSchedule: `${commonUrl}admin/delete-schedule`,
        getUsers: `${commonUrl}admin/get-users`,
        getAllBookings: `${commonUrl}admin/get-all-bookings`,
        updateBookingStatus: `${commonUrl}admin/update-booking-status`
    }
}

export default API