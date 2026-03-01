const commonUrl = 'https://slt-intern-1.onrender.com/api/'

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
        seatBooking: `${commonUrl}user/bus-seat-booking`,
        deleteUser: `${commonUrl}user/delete-my-account`,
        getMyBookings: `${commonUrl}user/get-my-bookings`,
        createPayment: `${commonUrl}user/create-payment`,
        getSpecificBooking: `${commonUrl}user/get-specific-booking`,
    }
}

export default API