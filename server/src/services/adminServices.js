async function createSchedule(req) {
    const {busNumber,  scheduleDate} = req.body
    console.log(busNumber)
    console.log(scheduleDate)
}

module.exports = {createSchedule}