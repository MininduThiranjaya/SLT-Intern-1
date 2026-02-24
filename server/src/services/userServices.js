async function searchSchedule(req) {
    const {fromCity,  toCity, travelDate} = req.body
    console.log(fromCity)
    console.log(toCity)
    console.log(travelDate)
}

module.exports = {searchSchedule}