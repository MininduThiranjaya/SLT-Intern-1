const commonUrl = 'http://localhost:8080/api/'

const API = {
    common: {
        login: `${commonUrl}common/login`,
        forget_password_send_mail: `${commonUrl}common/forget-password-send-mail`,
        forget_password_reset: `${commonUrl}common/forget-password-reset`,
        reg: `${commonUrl}common/reg`,
        verify: `${commonUrl}common/verify`
    },
    user: {
        search: `${commonUrl}user/search-schedule`,
        seatBooking: `${commonUrl}user/bus-seat-booking`
    }
}

export default API